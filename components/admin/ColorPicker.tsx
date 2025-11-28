"use client";

import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { Input, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
    className?: string;
}

export default function ColorPicker({ label, value, onChange, className = "" }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={className}>
            <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
                <PopoverTrigger>
                    <Input
                        label={label}
                        value={value || "#3B82F6"}
                        readOnly
                        startContent={
                            <div
                                className="w-6 h-6 rounded-full border-2 border-white/20 cursor-pointer"
                                style={{ backgroundColor: value || "#3B82F6" }}
                            />
                        }
                        className="cursor-pointer"
                        classNames={{
                            input: "cursor-pointer"
                        }}
                    />
                </PopoverTrigger>
                <PopoverContent className="p-4 bg-zinc-900 border border-white/10">
                    <div className="space-y-3">
                        <HexColorPicker color={value || "#3B82F6"} onChange={onChange} />
                        <Input
                            label="Hex Code"
                            value={value || "#3B82F6"}
                            onChange={(e) => onChange(e.target.value)}
                            size="sm"
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
