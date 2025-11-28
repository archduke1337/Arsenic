"use client";

import { Card, CardBody, Switch, Chip } from "@heroui/react";
import { CreditCard } from "lucide-react";

interface PaymentGatewayConfig {
    razorpay: boolean;
    easebuzz: boolean;
    autoFallback: boolean;
}

interface PaymentGatewayTogglesProps {
    config: PaymentGatewayConfig;
    onChange: (config: PaymentGatewayConfig) => void;
}

export default function PaymentGatewayToggles({ config, onChange }: PaymentGatewayTogglesProps) {
    const updateConfig = (key: keyof PaymentGatewayConfig, value: boolean) => {
        onChange({ ...config, [key]: value });
    };

    const activeGateways = [config.razorpay && "Razorpay", config.easebuzz && "Easebuzz"].filter(Boolean);

    return (
        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
            <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                        <CreditCard size={20} className="text-purple-400" />
                        Payment Gateways
                    </h4>
                    {activeGateways.length > 0 && (
                        <Chip size="sm" color="success" variant="flat">
                            {activeGateways.length} Active
                        </Chip>
                    )}
                </div>

                <div className="space-y-4">
                    <Switch
                        isSelected={config.razorpay}
                        onValueChange={(val) => updateConfig('razorpay', val)}
                        color="secondary"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Razorpay</span>
                            <span className="text-xs text-gray-400">
                                Primary payment gateway
                            </span>
                        </div>
                    </Switch>

                    <Switch
                        isSelected={config.easebuzz}
                        onValueChange={(val) => updateConfig('easebuzz', val)}
                        color="secondary"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Easebuzz</span>
                            <span className="text-xs text-gray-400">
                                Secondary payment gateway
                            </span>
                        </div>
                    </Switch>

                    {activeGateways.length > 1 && (
                        <Switch
                            isSelected={config.autoFallback}
                            onValueChange={(val) => updateConfig('autoFallback', val)}
                            color="warning"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Auto Fallback</span>
                                <span className="text-xs text-gray-400">
                                    Automatically switch if one gateway fails
                                </span>
                            </div>
                        </Switch>
                    )}
                </div>

                {activeGateways.length === 0 && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-400">
                            ⚠️ At least one payment gateway must be enabled
                        </p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
