"use client";

import { Card, CardBody, Input, Button, Chip } from "@nextui-org/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface GroupDiscount {
    tier: number;
    percentage: number;
}

interface FeeCalculatorProps {
    baseFee: number;
    onBaseFeeChange: (fee: number) => void;
    earlyBirdPercentage?: number;
    onEarlyBirdPercentageChange: (percentage: number) => void;
    groupDiscounts: GroupDiscount[];
    onGroupDiscountsChange: (discounts: GroupDiscount[]) => void;
}

export default function FeeCalculator({
    baseFee,
    onBaseFeeChange,
    earlyBirdPercentage = 0,
    onEarlyBirdPercentageChange,
    groupDiscounts,
    onGroupDiscountsChange,
}: FeeCalculatorProps) {
    const [newTier, setNewTier] = useState(5);
    const [newPercentage, setNewPercentage] = useState(10);

    const addGroupDiscount = () => {
        if (newTier > 0 && newPercentage > 0 && newPercentage <= 100) {
            // Check for duplicate tiers
            const existingTier = groupDiscounts.find(d => d.tier === newTier);
            if (existingTier) {
                alert(`Discount for ${newTier}+ delegates already exists`);
                return;
            }
            onGroupDiscountsChange([...groupDiscounts, { tier: newTier, percentage: newPercentage }]);
            setNewTier(5);
            setNewPercentage(10);
        } else if (newPercentage > 100) {
            alert("Discount percentage cannot exceed 100%");
        }
    };

    const removeGroupDiscount = (index: number) => {
        onGroupDiscountsChange(groupDiscounts.filter((_, i) => i !== index));
    };

    const earlyBirdFee = baseFee - (baseFee * (earlyBirdPercentage / 100));

    const calculateGroupFee = (tier: number, percentage: number) => {
        return baseFee - (baseFee * (percentage / 100));
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-bold mb-4">Fee Structure</h3>

                    {/* Base Fee */}
                    <Input
                        label="Base Fee (₹)"
                        type="number"
                        value={baseFee.toString()}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) onBaseFeeChange(value);
                        }}
                        startContent={<span className="text-gray-400">₹</span>}
                        className="mb-4"
                        min="0"
                        isRequired
                    />

                    {/* Early Bird */}
                    <div className="mb-6">
                        <Input
                            label="Early Bird Discount (%)"
                            type="number"
                            value={earlyBirdPercentage?.toString() || "0"}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= 100) onEarlyBirdPercentageChange(value);
                            }}
                            endContent={<span className="text-gray-400">%</span>}
                            min="0"
                            max="100"
                            description="0-100%"
                        />
                        {earlyBirdPercentage > 0 && (
                            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-sm text-blue-400">
                                    Early Bird Fee: <span className="font-bold">₹{earlyBirdFee.toFixed(2)}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Group Discounts */}
                <div>
                    <h4 className="text-md font-semibold mb-3">Group Discounts</h4>

                    {/* Existing Discounts */}
                    {groupDiscounts.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {groupDiscounts.map((discount, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <Chip size="sm" color="secondary" variant="flat">
                                            {discount.tier}+ delegates
                                        </Chip>
                                        <span className="text-sm">→</span>
                                        <Chip size="sm" color="success" variant="flat">
                                            {discount.percentage}% off
                                        </Chip>
                                        <span className="text-sm text-gray-400">
                                            = ₹{calculateGroupFee(discount.tier, discount.percentage).toFixed(2)}
                                        </span>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        onClick={() => removeGroupDiscount(index)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Discount */}
                    <div className="flex gap-2">
                        <Input
                            label="Min Delegates"
                            type="number"
                            value={newTier.toString()}
                            onChange={(e) => setNewTier(Number(e.target.value))}
                            size="sm"
                            className="max-w-[120px]"
                        />
                        <Input
                            label="Discount %"
                            type="number"
                            value={newPercentage.toString()}
                            onChange={(e) => setNewPercentage(Number(e.target.value))}
                            size="sm"
                            className="max-w-[120px]"
                        />
                        <Button
                            isIconOnly
                            color="primary"
                            onClick={addGroupDiscount}
                            className="mt-auto"
                            size="lg"
                        >
                            <Plus size={20} />
                        </Button>
                    </div>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold mb-2 text-gray-400">Fee Summary</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Standard Fee:</span>
                            <span className="font-bold">₹{baseFee}</span>
                        </div>
                        {earlyBirdPercentage > 0 && (
                            <div className="flex justify-between text-blue-400">
                                <span>Early Bird:</span>
                                <span className="font-bold">₹{earlyBirdFee.toFixed(2)}</span>
                            </div>
                        )}
                        {groupDiscounts.map((discount, index) => (
                            <div key={index} className="flex justify-between text-green-400">
                                <span>{discount.tier}+ Group:</span>
                                <span className="font-bold">
                                    ₹{calculateGroupFee(discount.tier, discount.percentage).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
