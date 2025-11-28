"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Download, Printer } from "lucide-react";
import { generateQRCode, downloadQRCode } from "@/lib/qrcode-utils";

interface QRCodeDisplayProps {
    registrationId: string;
    attendeeName: string;
    eventType: string;
}

export default function QRCodeDisplay({
    registrationId,
    attendeeName,
    eventType,
}: QRCodeDisplayProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQRCode();
    }, [registrationId]);

    const loadQRCode = async () => {
        try {
            const url = await generateQRCode(registrationId);
            setQrCodeUrl(url);
        } catch (error) {
            console.error("QR code generation error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (qrCodeUrl) {
            downloadQRCode(qrCodeUrl, `qr-${attendeeName.replace(/\s+/g, '-')}.png`);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && qrCodeUrl) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code - ${attendeeName}</title>
                        <style>
                            body {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                font-family: Arial, sans-serif;
                                margin: 0;
                                padding: 20px;
                            }
                            .qr-container {
                                text-align: center;
                                page-break-inside: avoid;
                            }
                            img {
                                max-width: 300px;
                                margin: 20px 0;
                            }
                            h2 {
                                margin: 10px 0;
                                color: #333;
                            }
                            p {
                                color: #666;
                                margin: 5px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="qr-container">
                            <h2>${attendeeName}</h2>
                            <p>${eventType}</p>
                            <img src="${qrCodeUrl}" alt="QR Code" />
                            <p>Scan this code at check-in</p>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 250);
        }
    };

    if (loading) {
        return (
            <Card className="bg-zinc-900/50 border border-white/10">
                <CardBody className="p-6">
                    <div className="aspect-square bg-white/5 rounded-lg animate-pulse" />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-4">
                <div className="text-center">
                    <h4 className="text-lg font-bold mb-2">Check-in QR Code</h4>
                    <p className="text-sm text-gray-400">Scan at the venue for quick check-in</p>
                </div>

                {qrCodeUrl && (
                    <div className="bg-white p-4 rounded-lg">
                        <img
                            src={qrCodeUrl}
                            alt="Check-in QR Code"
                            className="w-full max-w-xs mx-auto"
                        />
                    </div>
                )}

                <div className="flex gap-2 justify-center">
                    <Button
                        startContent={<Download size={16} />}
                        onClick={handleDownload}
                        variant="flat"
                    >
                        Download
                    </Button>
                    <Button
                        startContent={<Printer size={16} />}
                        onClick={handlePrint}
                        variant="flat"
                        color="secondary"
                    >
                        Print
                    </Button>
                </div>

                <p className="text-xs text-center text-gray-500">
                    Present this QR code at the check-in counter
                </p>
            </CardBody>
        </Card>
    );
}
