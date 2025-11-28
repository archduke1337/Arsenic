"use client";

import { useState } from "react";
import { Button, Card, CardBody, Divider, Tab, Tabs } from "@heroui/react";
import { RegistrationData } from "../registration-form";
import { CreditCard, Wallet } from "lucide-react";

interface Props {
    data: RegistrationData;
}

export default function PaymentStep({ data }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "easebuzz">("razorpay");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // TODO: Implement actual payment integration
        setTimeout(() => {
            setIsProcessing(false);
            alert("Payment integration pending");
        }, 2000);
    };

    return (
        <div className="space-y-6">
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
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tax (18% GST)</span>
                                <span className="font-medium text-white">₹{Math.round(data.amount * 0.18)}</span>
                            </div>
                            <Divider className="my-2 bg-white/10" />
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-cyan-400">₹{Math.round(data.amount * 1.18)}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Payment Methods */}
                <div>
                    <h3 className="font-semibold mb-4 text-white">Select Payment Method</h3>
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
                            isLoading={isProcessing}
                            onPress={handlePayment}
                        >
                            Pay ₹{Math.round(data.amount * 1.18)}
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
