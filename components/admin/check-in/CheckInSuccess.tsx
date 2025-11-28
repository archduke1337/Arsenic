"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardBody, Chip } from "@heroui/react";
import { CheckCircle, User, Calendar } from "lucide-react";

interface CheckInSuccessProps {
    attendeeName: string;
    eventType: string;
    onDismiss: () => void;
}

export default function CheckInSuccess({
    attendeeName,
    eventType,
    onDismiss,
}: CheckInSuccessProps) {
    useEffect(() => {
        // Trigger confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            // Left side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#9333ea', '#ec4899', '#f97316'],
            });

            // Right side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#3b82f6', '#06b6d4', '#10b981'],
            });
        }, 250);

        // Auto-dismiss after 3 seconds
        const dismissTimer = setTimeout(() => {
            onDismiss();
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(dismissTimer);
        };
    }, [onDismiss]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in">
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500">
                <CardBody className="p-12 text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
                            <CheckCircle size={80} className="relative text-green-400 animate-bounce" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div>
                        <h2 className="text-4xl font-bold text-green-400 mb-2">
                            Check-in Successful!
                        </h2>
                        <p className="text-gray-400">Welcome to the event</p>
                    </div>

                    {/* Attendee Info */}
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center justify-center gap-3">
                            <User size={20} className="text-purple-400" />
                            <span className="text-2xl font-semibold">{attendeeName}</span>
                        </div>
                        <Chip
                            color="primary"
                            variant="flat"
                            size="lg"
                            startContent={<Calendar size={16} />}
                        >
                            {eventType}
                        </Chip>
                    </div>

                    {/* Timestamp */}
                    <p className="text-sm text-gray-500">
                        {new Date().toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
