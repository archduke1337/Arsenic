"use client";

import { useEffect } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export default function SuccessPage() {
    const regCode = "AS-2026-XYZ";

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-black">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <Card className="border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                    <CardBody className="text-center p-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </motion.div>

                        <h1 className="text-3xl font-bold mb-2">Registration Successful!</h1>
                        <p className="text-gray-500 mb-8">
                            Welcome to Arsenic Summit. Your seat has been confirmed.
                        </p>

                        <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl mb-8">
                            <p className="text-sm text-gray-500 mb-1">Registration Code</p>
                            <p className="text-3xl font-mono font-bold tracking-wider text-primary">
                                {regCode}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                as={Link}
                                href="/dashboard"
                                color="primary"
                                size="lg"
                                className="w-full font-bold shadow-lg shadow-blue-500/30"
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="flat"
                                size="lg"
                                className="w-full"
                                startContent={<Download size={18} />}
                            >
                                Download Receipt
                            </Button>
                            <Button
                                as={Link}
                                href="/"
                                variant="light"
                                className="w-full"
                                startContent={<Home size={18} />}
                            >
                                Back to Home
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}