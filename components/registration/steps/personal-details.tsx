"use client";

import { Input } from "@heroui/react";
import { RegistrationData } from "../registration-form";

interface Props {
    data: RegistrationData;
    updateData: (updates: Partial<RegistrationData>) => void;
}

export default function PersonalDetailsStep({ data, updateData }: Props) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Personal Details</h2>
                <p className="text-gray-400">Tell us a bit about yourself.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={data.fullName}
                    onValueChange={(val) => updateData({ fullName: val })}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                        label: "text-gray-400",
                        input: "text-white"
                    }}
                    isRequired
                />
                <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={data.email}
                    onValueChange={(val) => updateData({ email: val })}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                        label: "text-gray-400",
                        input: "text-white"
                    }}
                    isRequired
                />
                <Input
                    type="tel"
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    value={data.phone}
                    onValueChange={(val) => updateData({ phone: val })}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                        label: "text-gray-400",
                        input: "text-white"
                    }}
                    isRequired
                />
                <Input
                    label="Institution / School"
                    placeholder="Enter your school or college name"
                    value={data.institution}
                    onValueChange={(val) => updateData({ institution: val })}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                        label: "text-gray-400",
                        input: "text-white"
                    }}
                    isRequired
                />
            </div>
        </div>
    );
}
