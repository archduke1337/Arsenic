'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, Progress, Chip } from '@nextui-org/react';

interface QRScannerProps {
  eventId: string;
  onScanSuccess?: (participant: any) => void;
  onScanError?: (error: string) => void;
}

export function QRScanner({ eventId, onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0, checkInRate: '0%' });

  // Initialize camera
  useEffect(() => {
    if (!isScanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Cannot access camera. Please check permissions.');
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isScanning]);

  // Scan for QR codes
  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const interval = setInterval(() => {
      const context = canvasRef.current?.getContext('2d');
      if (!context || !videoRef.current || !canvasRef.current) return;

      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      // For real implementation, use a QR code library like:
      // - jsQR
      // - html5-qrcode
      // - quagga2

      // Placeholder - in production, integrate jsQR:
      // const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      // const code = jsQR(imageData.data, imageData.width, imageData.height);
    }, 100);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Fetch check-in stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/checkin/scan?eventId=${eventId}`);
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (isScanning) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isScanning, eventId]);

  const handleProcessQR = async (qrData: string) => {
    try {
      const response = await fetch('/api/checkin/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData, eventId }),
      });

      const data = await response.json();

      if (data.success) {
        setScanResult(data.participant);
        onScanSuccess?.(data.participant);
        setError('');

        // Auto-clear result after 2 seconds
        setTimeout(() => setScanResult(null), 2000);
      } else {
        setError(data.error);
        onScanError?.(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Scan failed';
      setError(errorMessage);
      onScanError?.(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Statistics */}
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Checked In</p>
            <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rate</p>
            <p className="text-2xl font-bold">{stats.checkInRate}</p>
          </div>
        </div>
        <Progress
          value={(stats.checkedIn / stats.total) * 100 || 0}
          className="mt-4"
          color="success"
        />
      </Card>

      {/* Scanner */}
      <Card className="p-4">
        {isScanning ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className="hidden"
              />
              <div className="absolute inset-0 border-2 border-blue-500 opacity-30">
                <div className="absolute inset-4 border border-blue-500 opacity-50" />
              </div>
            </div>

            <p className="text-center text-gray-600 text-sm">
              Position the QR code in the center of the frame
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Click below to start scanning</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {scanResult && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-800 font-semibold">✓ Check-in Successful!</p>
            <p className="text-green-700 mt-2">
              <strong>{scanResult.name}</strong> from <strong>{scanResult.committee}</strong>
            </p>
            <p className="text-green-600 text-sm mt-1">
              Portfolio: {scanResult.portfolio || 'General Delegate'}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-4 flex gap-2">
          <Button
            onPress={() => setIsScanning(!isScanning)}
            color={isScanning ? 'danger' : 'primary'}
            className="flex-1"
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>
          <Button
            onPress={() => {
              setScanResult(null);
              setError('');
            }}
            variant="flat"
          >
            Clear
          </Button>
        </div>
      </Card>

      {/* Committee Stats */}
      {stats && Object.keys(stats.byCommittee || {}).length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">By Committee</h3>
          <div className="space-y-2">
            {Object.entries(stats.byCommittee || {}).map(([committee, data]: any) => (
              <div key={committee} className="flex items-center justify-between">
                <span className="text-sm">{committee}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    {data.checkedIn}/{data.total}
                  </span>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={data.checkedIn === data.total ? 'success' : 'warning'}
                  >
                    {((data.checkedIn / data.total) * 100).toFixed(0)}%
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
