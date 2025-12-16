"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Chip, Switch
} from "@nextui-org/react";
import { Scan, Search, Users, CheckCircle, Clock, Undo } from "lucide-react";
import { COLLECTIONS } from "@/lib/schema";
import { Html5QrcodeScanner } from "html5-qrcode";
import { validateQRCode } from "@/lib/qrcode-utils";
import CheckInSuccess from "@/components/admin/check-in/CheckInSuccess";
import { toast, Toaster } from "sonner";

export default function CheckInPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [scanning, setScanning] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

    // Statistics
    const totalRegistrations = registrations.length;
    const checkedIn = registrations.filter(r => r.checkedIn).length;
    const todayCheckIns = recentCheckIns.filter(r => {
        const today = new Date().setHours(0, 0, 0, 0);
        const checkInDate = new Date(r.checkedInAt).setHours(0, 0, 0, 0);
        return checkInDate === today;
    }).length;
    const checkInPercentage = totalRegistrations > 0 ? Math.round((checkedIn / totalRegistrations) * 100) : 0;

    useEffect(() => {
        fetchRegistrations();
        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, []);

    useEffect(() => {
        if (scanning && !scanner) {
            initializeScanner();
        } else if (!scanning && scanner) {
            scanner.clear();
            setScanner(null);
        }
    }, [scanning]);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/admin/registrations');
            if (!res.ok) throw new Error('Failed to fetch registrations');
            const data = await res.json();
            const regs = data.registrations || [];
            setRegistrations(regs);
            setRecentCheckIns(regs.filter((r: any) => r.checkedIn));
        } catch (error) {
            console.error("Error fetching registrations:", error);
            toast.error("Failed to fetch registrations");
        }
    };

    const initializeScanner = () => {
        const html5QrCodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            false
        );

        html5QrCodeScanner.render(onScanSuccess, onScanError);
        setScanner(html5QrCodeScanner);
    };

    const onScanSuccess = async (decodedText: string) => {
        const validation = validateQRCode(decodedText);

        if (!validation.valid) {
            toast.error(validation.error || "Invalid QR code");
            playSound('error');
            return;
        }

        await handleCheckIn(validation.registrationId!);
    };

    const onScanError = (error: any) => {
        // Suppress error messages (they're too frequent)
    };

    const handleCheckIn = async (registrationId: string) => {
        try {
            const registration = registrations.find(r => r.$id === registrationId);

            if (!registration) {
                toast.error("Registration not found");
                playSound('error');
                return;
            }

            if (registration.checkedIn) {
                toast.warning(`${registration.fullName || registration.name || 'This person'} is already checked in`);
                playSound('warning');
                return;
            }

            // Call secure API instead of direct client mutation
            const res = await fetch('/api/checkin/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    qrData: registration.code,
                    eventId: registration.eventId,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Check-in failed');
            }

            const data = await res.json();

            // Update local state with API result
            setRegistrations(prev => prev.map(r =>
                r.$id === registrationId
                    ? { ...r, checkedIn: true, checkedInAt: data.participant?.checkedInAt || new Date().toISOString() }
                    : r
            ));

            setRecentCheckIns(prev => [{
                ...registration,
                checkedIn: true,
                checkedInAt: data.participant?.checkedInAt || new Date().toISOString(),
            }, ...prev]);

            // Show success animation
            setSuccessData(registration);
            setShowSuccess(true);
            playSound('success');

        } catch (error) {
            console.error("Check-in error:", error);
            toast.error("Failed to check in attendee");
            playSound('error');
        }
    };

    const handleManualCheckIn = async (registration: any) => {
        await handleCheckIn(registration.$id);
    };

    const handleUndoLastCheckIn = async () => {
        if (recentCheckIns.length === 0) {
            toast.error("No recent check-ins to undo");
            return;
        }

        const lastCheckIn = recentCheckIns[0];

        if (confirm(`Undo check-in for ${lastCheckIn.name}?`)) {
            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.REGISTRATIONS,
                    lastCheckIn.$id,
                    {
                        checkedIn: false,
                        checkedInAt: null,
                    }
                );

                setRegistrations(prev => prev.map(r =>
                    r.$id === lastCheckIn.$id
                        ? { ...r, checkedIn: false, checkedInAt: null }
                        : r
                ));

                setRecentCheckIns(prev => prev.slice(1));
                toast.success("Check-in undone");
            } catch (error) {
                console.error("Undo error:", error);
                toast.error("Failed to undo check-in");
            }
        }
    };

    const playSound = (type: 'success' | 'error' | 'warning') => {
        if (!soundEnabled) return;

        // You can add actual sound files here
        const audio = new Audio();
        if (type === 'success') {
            // audio.src = '/sounds/success.mp3';
        } else if (type === 'error') {
            // audio.src = '/sounds/error.mp3';
        }
        audio.play().catch(() => {
            // Ignore errors if sound files don't exist
        });
    };

    const filteredRegistrations = registrations.filter(r => {
        if (!searchQuery) return false;
        const query = searchQuery.toLowerCase();
        return (
            (r.fullName?.toLowerCase().includes(query)) ||
            (r.name?.toLowerCase().includes(query)) ||
            (r.email?.toLowerCase().includes(query)) ||
            (r.institution?.toLowerCase().includes(query))
        );
    });

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white p-8">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Check-In Station
                        </h1>
                        <p className="text-gray-400 mt-1">Scan QR codes or search manually</p>
                    </div>
                    <div className="flex gap-4">
                        <Switch
                            isSelected={soundEnabled}
                            onValueChange={setSoundEnabled}
                            size="sm"
                        >
                            Sound Effects
                        </Switch>
                        <Button
                            color="warning"
                            variant="flat"
                            startContent={<Undo size={16} />}
                            onClick={handleUndoLastCheckIn}
                            isDisabled={recentCheckIns.length === 0}
                        >
                            Undo Last
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Scanner & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <Users size={24} className="text-blue-400" />
                                    <div>
                                        <p className="text-2xl font-bold">{totalRegistrations}</p>
                                        <p className="text-xs text-gray-400">Total</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={24} className="text-green-400" />
                                    <div>
                                        <p className="text-2xl font-bold">{checkedIn}</p>
                                        <p className="text-xs text-gray-400">Checked In</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={24} className="text-yellow-400" />
                                    <div>
                                        <p className="text-2xl font-bold">{todayCheckIns}</p>
                                        <p className="text-xs text-gray-400">Today</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12">
                                        <svg className="transform -rotate-90 w-12 h-12">
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                                className="text-gray-700"
                                            />
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="20"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={`${checkInPercentage * 1.25} 125`}
                                                className="text-purple-400"
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                            {checkInPercentage}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400">Progress</p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* QR Scanner */}
                    <Card className="bg-zinc-900/50 border border-white/10">
                        <CardBody className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">QR Code Scanner</h3>
                                <Button
                                    color={scanning ? "danger" : "primary"}
                                    onClick={() => setScanning(!scanning)}
                                    startContent={<Scan size={16} />}
                                >
                                    {scanning ? "Stop Scanner" : "Start Scanner"}
                                </Button>
                            </div>

                            {scanning ? (
                                <div id="qr-reader" className="rounded-lg overflow-hidden" />
                            ) : (
                                <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
                                    <div className="text-center">
                                        <Scan size={64} className="mx-auto mb-4 text-gray-600" />
                                        <p className="text-gray-400">Click "Start Scanner" to begin</p>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Manual Search & Recent Check-ins */}
                <div className="space-y-6">
                    {/* Manual Search */}
                    <Card className="bg-zinc-900/50 border border-white/10">
                        <CardBody className="p-6">
                            <h3 className="text-xl font-bold mb-4">Manual Search</h3>
                            <Input
                                placeholder="Search by name, email, or school..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                startContent={<Search size={16} />}
                                classNames={{
                                    inputWrapper: "bg-black/50 border border-white/10",
                                }}
                            />

                            {searchQuery && (
                                <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                                    {filteredRegistrations.slice(0, 10).map((reg) => (
                                        <div
                                            key={reg.$id}
                                            className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold">{reg.fullName || reg.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{reg.email}</p>
                                                    {reg.institution && (
                                                        <p className="text-xs text-gray-500">{reg.institution}</p>
                                                    )}
                                                </div>
                                                {reg.checkedIn ? (
                                                    <Chip size="sm" color="success" variant="flat">
                                                        Checked In
                                                    </Chip>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        onClick={() => handleManualCheckIn(reg)}
                                                    >
                                                        Check In
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredRegistrations.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">No results found</p>
                                    )}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Recent Check-ins */}
                    <Card className="bg-zinc-900/50 border border-white/10">
                        <CardBody className="p-6">
                            <h3 className="text-xl font-bold mb-4">Recent Check-ins</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {recentCheckIns.slice(0, 10).map((reg) => (
                                    <div
                                        key={reg.$id}
                                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        <p className="font-semibold text-sm">{reg.fullName || reg.name || 'Unknown Attendee'}</p>
                                        <p className="text-xs text-gray-400">
                                            {reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }) : 'Just now'}
                                        </p>
                                    </div>
                                ))}
                                {recentCheckIns.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No check-ins yet</p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Success Animation */}
            {showSuccess && successData && (
                <CheckInSuccess
                    attendeeName={successData.name}
                    eventType={successData.eventType || "Event"}
                    onDismiss={() => setShowSuccess(false)}
                />
            )}
        </div>
    );
}
