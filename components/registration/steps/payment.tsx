"use client";

import { useMemo, useState } from "react";
import { Button, Card, CardBody, Divider, Input, Tab, Tabs } from "@nextui-org/react";
import { RegistrationData } from "../registration-form";
import { CreditCard, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

type RazorpayHandlerResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Props {
    data: RegistrationData;
    updateData: (updates: Partial<RegistrationData>) => void;
}

export default function PaymentStep({ data, updateData }: Props) {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "easebuzz">("razorpay");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const totalAmount = useMemo(() => {
        const discounted = Math.max(data.amount - discount, 0);
        return Math.round(discounted * 1.18); // add 18% GST
    }, [data.amount, discount]);

    const loadRazorpayScript = () =>
        new Promise<boolean>((resolve) => {
            if (typeof window === "undefined") return resolve(false);
            if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
                return resolve(true);
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleApplyCoupon = async () => {
        if (!data.couponCode) return;
        setIsApplying(true);
        setErrorMessage(null);
        try {
            const response = await fetch("/api/validate-coupon", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: data.couponCode,
                    eventId: data.eventType,
                    baseAmount: data.amount,
                }),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || "Coupon validation failed");
            }

            setDiscount(result.discountAmount ?? 0);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Coupon validation failed";
            setErrorMessage(message);
            setDiscount(0);
        } finally {
            setIsApplying(false);
        }
    };

    const handleRazorpayPayment = async (registrationId: string): Promise<string> => {
        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
            throw new Error("Unable to load Razorpay checkout");
        }

        const response = await fetch("/api/payments/razorpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: totalAmount,
                email: data.email,
                name: data.fullName,
                registrationId,
            }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to create Razorpay order");
        }

        const orderId = result.orderId;
        updateData({ orderId });

        if (!result.razorpayKeyId) {
            throw new Error("Razorpay key is not configured");
        }

        return new Promise<string>((resolve, reject) => {
            const options = {
                key: result.razorpayKeyId,
                amount: result.amount, // in paise
                currency: result.currency || "INR",
                name: "Arsenic Summit",
                description: "Registration Payment",
                order_id: result.orderId,
                prefill: {
                    name: data.fullName,
                    email: data.email,
                    contact: data.phone,
                },
                handler: async (resp: RazorpayHandlerResponse) => {
                    setIsVerifying(true);
                    try {
                        const verifyRes = await fetch("/api/payments/razorpay", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                orderId: resp.razorpay_order_id,
                                paymentId: resp.razorpay_payment_id,
                                signature: resp.razorpay_signature,
                                registrationId,
                            }),
                        });
                        const verifyJson = await verifyRes.json();
                        if (!verifyRes.ok || !verifyJson.success) {
                            throw new Error(verifyJson.error || "Verification failed");
                        }
                        resolve(orderId);
                    } catch (err) {
                        reject(err);
                    } finally {
                        setIsVerifying(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsProcessing(false);
                        setIsVerifying(false);
                    },
                },
                notes: {
                    registrationId,
                },
                theme: {
                    color: "#0ea5e9",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (failure: any) => {
                reject(new Error(failure?.error?.description || "Payment failed"));
            });
            rzp.open();
        });
    };

    const handleEasebuzzPayment = async (registrationId: string) => {
        const response = await fetch("/api/payments/easebuzz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: totalAmount,
                email: data.email,
                name: data.fullName,
                phone: data.phone,
                registrationId,
                redirectUrl: `${window.location.origin}/api/payments/easebuzz/callback`,
            }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to create Easebuzz order");
        }

        updateData({ orderId: result.txnId || result.orderId });

        // Easebuzz uses a POST form submission; create a hidden form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.paymentUrl;
        form.style.display = "none";

        Object.entries(result.payload || {}).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value ?? "");
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setErrorMessage(null);
        try {
            // 1) Create registration record
            const registrationRes = await fetch("/api/registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: data.userId || data.email, // prefer authenticated user id
                    eventId: data.eventId || data.eventType,
                    eventType: data.eventType,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    institution: data.institution,
                    amountPaid: totalAmount,
                    paymentStatus: "pending",
                    code: data.couponCode,
                }),
            });

            const registrationJson = await registrationRes.json();
            if (!registrationRes.ok) {
                throw new Error(registrationJson.error || "Registration failed");
            }

            const registrationId = registrationJson.$id || registrationJson.registrationId;
            const registrationCode = registrationJson.code;
            updateData({ registrationId, code: registrationCode });

            // 2) Create payment order via selected gateway
            if (paymentMethod === "razorpay") {
                const orderId = await handleRazorpayPayment(registrationId);
                const search = new URLSearchParams({
                    registrationId,
                    orderId: orderId || "",
                    gateway: "razorpay",
                    code: registrationCode || "",
                    status: "success",
                });
                router.push(`/register/success?${search.toString()}`);
            } else {
                await handleEasebuzzPayment(registrationId);
                // Redirect handled by form submit; nothing else to do here
            }
        } catch (error) {
            console.error("Payment error:", error);
            const message = error instanceof Error ? error.message : "Unknown error";
            setErrorMessage(message);
            toast.error(message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Toaster richColors position="top-center" />
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Payment</h2>
                <p className="text-gray-400">Securely complete your registration.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card className="bg-white/5 border border-white/10 dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-semibold mb-4 text-white">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Event</span>
                                <span className="font-medium text-white">{data.eventType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Registration Fee</span>
                                <span className="font-medium text-white">₹{data.amount}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Coupon Discount</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tax (18% GST)</span>
                                <span className="font-medium text-white">₹{Math.round(Math.max(data.amount - discount, 0) * 0.18)}</span>
                            </div>
                            <Divider className="my-2 bg-white/10" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-cyan-400">₹{totalAmount}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Payment Methods */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Select Payment Method</h3>
                    <div className="flex gap-2 mb-4">
                        <Input
                            label="Coupon Code"
                            placeholder="Enter coupon"
                            value={data.couponCode || ""}
                            onValueChange={(val) => updateData({ couponCode: val })}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                                label: "text-gray-400",
                                input: "text-white",
                            }}
                        />
                        <Button
                            onPress={handleApplyCoupon}
                            isLoading={isApplying}
                            className="mt-auto bg-white/10 text-white"
                            isDisabled={!data.couponCode}
                        >
                            Apply
                        </Button>
                    </div>
                    {errorMessage && (
                        <p className="text-red-400 text-sm mb-3">{errorMessage}</p>
                    )}
                    <Tabs
                        aria-label="Payment Options"
                        fullWidth
                        size="lg"
                        selectedKey={paymentMethod}
                        onSelectionChange={(k) => setPaymentMethod(k as "razorpay" | "easebuzz")}
                        classNames={{
                            cursor: "bg-gradient-to-r from-blue-500 to-cyan-500",
                            tabContent: "group-data-[selected=true]:text-white font-semibold"
                        }}
                    >
                        <Tab
                            key="razorpay"
                            title={
                                <div className="flex items-center gap-2 text-white">
                                    <CreditCard size={20} /> Razorpay
                                </div>
                            }
                        />
                        <Tab
                            key="easebuzz"
                            title={
                                <div className="flex items-center gap-2 text-white">
                                    <Wallet size={20} /> Easebuzz
                                </div>
                            }
                        />
                    </Tabs>

                    <div className="mt-6">
                        <p className="text-xs text-gray-400 mb-4 text-center">
                            {paymentMethod === "razorpay"
                                ? "Pay securely with Credit/Debit Card, UPI, or Netbanking via Razorpay."
                                : "Alternative payment gateway optimized for Indian cards and UPI via Easebuzz."}
                        </p>

                        <Button
                            size="lg"
                            color="primary"
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-white shadow-lg shadow-blue-500/30"
                            isLoading={isProcessing || isVerifying}
                            onPress={handlePayment}
                            isDisabled={!data.email || !data.fullName || !data.eventType}
                        >
                            Pay ₹{totalAmount}
                        </Button>

                        <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-400">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>256-bit SSL Secured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
