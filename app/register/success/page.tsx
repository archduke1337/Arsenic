"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home, XCircle } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useSearchParams } from "next/navigation";

const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

export default function SuccessPage() {
    const params = useSearchParams();
    const registrationId = params.get("registrationId") || "";
    const codeFromQuery = params.get("code") || params.get("regCode") || "";
    const gatewayFromQuery = params.get("gateway") || "";
    const orderFromQuery = params.get("orderId") || params.get("txnId") || "";
    const statusFromQuery = params.get("status") || params.get("easebuzzStatus") || "success";

    const [registration, setRegistration] = useState<any | null>(null);
    const [payment, setPayment] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        if (!registrationId) return;
        setLoading(true);
        setFetchError(null);
        try {
            const res = await fetch(`/api/registrations/${registrationId}`);
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || "Failed to load registration");
            }
            setRegistration(json.registration);
            setPayment(json.latestPayment || null);
        } catch (err) {
            setFetchError(err instanceof Error ? err.message : "Failed to load registration");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [registrationId]);

    const paidFromQuery = useMemo(() => statusFromQuery === "success" || statusFromQuery === "0", [statusFromQuery]);
    const paidFromData = useMemo(() => {
        return payment?.status === "success" || registration?.paymentStatus === "paid";
    }, [payment, registration]);

    const isSuccess = paidFromQuery || paidFromData;
    const gateway = gatewayFromQuery || payment?.gateway || "";
    const orderId = orderFromQuery || payment?.transactionId || payment?.orderId || "";
    const code = codeFromQuery || registration?.code || "";

    useEffect(() => {
        if (!isSuccess) return;
        // Fire confetti on success
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
    }, [isSuccess]);

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
                            className={`w-20 h-20 ${isSuccess ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} rounded-full flex items-center justify-center mx-auto mb-6`}
                        >
                            {isSuccess ? (
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-500" />
                            )}
                        </motion.div>

                        <h1 className="text-3xl font-bold mb-2">
                            {isSuccess ? "Registration Successful!" : "Payment Pending"}
                        </h1>
                        <p className="text-gray-500 mb-8">
                            {isSuccess
                                ? "Welcome to Arsenic Summit. Your seat has been confirmed."
                                : "We could not confirm your payment yet. If you were charged, please contact support with the details below."}
                        </p>

                        <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl mb-8 space-y-2 text-left">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Registration ID</span>
                                <span className="font-mono text-gray-700 dark:text-gray-200">{registrationId || registration?.$id || "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Gateway</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{gateway || "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Order / Txn</span>
                                <span className="font-mono text-gray-700 dark:text-gray-200">{orderId || "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Status</span>
                                <span className={`font-semibold ${isSuccess ? "text-green-600" : "text-amber-500"}`}>
                                    {isSuccess ? "Paid" : "Pending"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Amount</span>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">
                                    {payment?.amount ? `₹${payment.amount}` : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Registration Code</span>
                                <span className="font-mono text-primary text-lg">
                                    {code || "Generating..."}
                                </span>
                            </div>
                        </div>

                        {fetchError && (
                            <p className="text-sm text-red-500 mb-4">{fetchError}</p>
                        )}
                        {loading && (
                            <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
                                <Spinner size="sm" /> Loading latest status...
                            </div>
                        )}

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
                                variant="bordered"
                                size="lg"
                                className="w-full"
                                isLoading={isRefreshing}
                                onPress={() => {
                                    setIsRefreshing(true);
                                    fetchData();
                                }}
                            >
                                Refresh status
                            </Button>
                            <Button
                                variant="flat"
                                size="lg"
                                className="w-full"
                                startContent={<Download size={18} />}
                                isDisabled={!isSuccess}
                                onPress={() => {
                                    const url = payment?.invoiceUrl || (registrationId ? `/api/payments/receipt?registrationId=${registrationId}` : "");
                                    if (url) {
                                        window.open(url, "_blank");
                                    } else {
                                        alert("Receipt generation coming soon.");
                                    }
                                }}
                            >
                                {isSuccess ? "Download Receipt" : "Receipt unavailable"}
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
