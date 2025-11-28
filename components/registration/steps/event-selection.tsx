"use client";

import { RadioGroup, Radio, Select, SelectItem, Input } from "@heroui/react";
import { RegistrationData } from "../registration-form";
import { EVENT_TYPES, EVENT_TYPE_LABELS } from "@/lib/schema";

interface Props {
    data: RegistrationData;
    updateData: (updates: Partial<RegistrationData>) => void;
}

export default function EventSelectionStep({ data, updateData }: Props) {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Choose Your Arena</h2>
                <p className="text-gray-400">Select the event format you wish to participate in.</p>
            </div>

            <RadioGroup
                label="Event Type"
                value={data.eventType}
                onValueChange={(val) => updateData({ eventType: val })}
                orientation="horizontal"
                classNames={{ 
                    wrapper: "gap-4 flex-wrap",
                    label: "text-white"
                }}
            >
                {EVENT_TYPES.map((type) => (
                    <Radio
                        key={type}
                        value={type}
                        classNames={{
                            base: "m-0 bg-white/5 hover:bg-white/10 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-blue-500",
                            label: "text-white",
                        }}
                    >
                        {EVENT_TYPE_LABELS[type]}
                    </Radio>
                ))}
            </RadioGroup>

            {data.eventType === "MUN" && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <Select
                        label="Committee"
                        placeholder="Select Committee"
                        selectedKeys={data.committee ? [data.committee] : []}
                        onChange={(e) => updateData({ committee: e.target.value })}
                        variant="bordered"
                        classNames={{
                            trigger: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                            label: "text-gray-400",
                            value: "text-white"
                        }}
                    >
                        <SelectItem key="unsc">UN Security Council</SelectItem>
                        <SelectItem key="unhrc">UN Human Rights Council</SelectItem>
                        <SelectItem key="disec">DISEC</SelectItem>
                    </Select>

                    <Input
                        label="Preferred Country"
                        placeholder="e.g. USA, Russia, India"
                        value={data.country || ""}
                        onValueChange={(val) => updateData({ country: val })}
                        variant="bordered"
                        classNames={{
                            inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                            label: "text-gray-400",
                            input: "text-white"
                        }}
                    />
                </div>
            )}

            {(data.eventType === "LOK_SABHA" || data.eventType === "RAJYA_SABHA") && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    <Input
                        label="Preferred Constituency/State"
                        placeholder="e.g. Varanasi / Maharashtra"
                        value={data.constituency || ""}
                        onValueChange={(val) => updateData({ constituency: val })}
                        variant="bordered"
                        classNames={{
                            inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                            label: "text-gray-400",
                            input: "text-white"
                        }}
                    />
                    <Input
                        label="Political Party"
                        placeholder="e.g. BJP, INC"
                        value={data.party || ""}
                        onValueChange={(val) => updateData({ party: val })}
                        variant="bordered"
                        classNames={{
                            inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                            label: "text-gray-400",
                            input: "text-white"
                        }}
                    />
                </div>
            )}
        </div>
    );
}
