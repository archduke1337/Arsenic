"use client";

import { Select, SelectItem, Input, Button, Chip } from "@heroui/react";
import { X } from "lucide-react";

interface RegistrationFiltersProps {
    events: string[];
    selectedEvent: string;
    onEventChange: (event: string) => void;
    paymentStatus: string;
    onPaymentStatusChange: (status: string) => void;
    checkInStatus: string;
    onCheckInStatusChange: (status: string) => void;
    schoolSearch: string;
    onSchoolSearchChange: (school: string) => void;
    amountRange: [number, number];
    onAmountRangeChange: (range: [number, number]) => void;
    onClearAll: () => void;
}

const PAYMENT_STATUSES = ['ALL', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];
const CHECKIN_STATUSES = ['ALL', 'CHECKED_IN', 'NOT_CHECKED_IN'];

export default function RegistrationFilters({
    events,
    selectedEvent,
    onEventChange,
    paymentStatus,
    onPaymentStatusChange,
    checkInStatus,
    onCheckInStatusChange,
    schoolSearch,
    onSchoolSearchChange,
    amountRange,
    onAmountRangeChange,
    onClearAll,
}: RegistrationFiltersProps) {
    const hasActiveFilters =
        selectedEvent !== 'ALL' ||
        paymentStatus !== 'ALL' ||
        checkInStatus !== 'ALL' ||
        schoolSearch !== '' ||
        amountRange[0] > 0 ||
        amountRange[1] < 100000;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        size="sm"
                        variant="flat"
                        startContent={<X size={14} />}
                        onClick={onClearAll}
                    >
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Event Filter */}
                <Select
                    label="Event Type"
                    selectedKeys={[selectedEvent]}
                    onChange={(e) => onEventChange(e.target.value)}
                    size="sm"
                >
                    {["ALL", ...events].map((event) => (
                        <SelectItem key={event} value={event}>
                            {event === "ALL" ? "All Events" : event.replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </Select>

                {/* Payment Status Filter */}
                <Select
                    label="Payment Status"
                    selectedKeys={[paymentStatus]}
                    onChange={(e) => onPaymentStatusChange(e.target.value)}
                    size="sm"
                >
                    {PAYMENT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </Select>

                {/* Check-in Status Filter */}
                <Select
                    label="Check-in Status"
                    selectedKeys={[checkInStatus]}
                    onChange={(e) => onCheckInStatusChange(e.target.value)}
                    size="sm"
                >
                    {CHECKIN_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                        </SelectItem>
                    ))}
                </Select>

                {/* School Search */}
                <Input
                    label="School"
                    placeholder="Search by school..."
                    value={schoolSearch}
                    onChange={(e) => onSchoolSearchChange(e.target.value)}
                    size="sm"
                    classNames={{
                        inputWrapper: "bg-zinc-900/50 border border-white/10",
                    }}
                />

                {/* Amount Range */}
                <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Amount Range</label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={amountRange[0].toString()}
                            onChange={(e) => onAmountRangeChange([parseInt(e.target.value) || 0, amountRange[1]])}
                            size="sm"
                            startContent={<span className="text-xs">₹</span>}
                        />
                        <span>—</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={amountRange[1].toString()}
                            onChange={(e) => onAmountRangeChange([amountRange[0], parseInt(e.target.value) || 100000])}
                            size="sm"
                            startContent={<span className="text-xs">₹</span>}
                        />
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {selectedEvent !== 'ALL' && (
                        <Chip size="sm" onClose={() => onEventChange('ALL')} variant="flat" color="primary">
                            Event: {selectedEvent.replace(/_/g, ' ')}
                        </Chip>
                    )}
                    {paymentStatus !== 'ALL' && (
                        <Chip size="sm" onClose={() => onPaymentStatusChange('ALL')} variant="flat" color="success">
                            Payment: {paymentStatus}
                        </Chip>
                    )}
                    {checkInStatus !== 'ALL' && (
                        <Chip size="sm" onClose={() => onCheckInStatusChange('ALL')} variant="flat" color="secondary">
                            Check-in: {checkInStatus.replace(/_/g, ' ')}
                        </Chip>
                    )}
                    {schoolSearch && (
                        <Chip size="sm" onClose={() => onSchoolSearchChange('')} variant="flat">
                            School: {schoolSearch}
                        </Chip>
                    )}
                </div>
            )}
        </div>
    );
}
