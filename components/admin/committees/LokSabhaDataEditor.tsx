"use client";

import { Card, CardBody, Input, Button, Select, SelectItem, Chip } from "@heroui/react";
import { Plus, X, Building2 } from "lucide-react";
import { useState } from "react";

interface Party {
    name: string;
    seatShare: number;
}

interface Portfolio {
    role: 'PM' | 'HM' | 'FM' | 'Speaker' | 'Member';
    assignedTo?: string;
}

interface LokSabhaDataEditorProps {
    state: string;
    onStateChange: (state: string) => void;
    reservationType: 'General' | 'SC' | 'ST';
    onReservationChange: (type: 'General' | 'SC' | 'ST') => void;
    parties: Party[];
    onPartiesChange: (parties: Party[]) => void;
    portfolios: Portfolio[];
    onPortfoliosChange: (portfolios: Portfolio[]) => void;
}

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
    "Lakshadweep", "Puducherry"
];

const PORTFOLIO_ROLES: Array<'PM' | 'HM' | 'FM' | 'Speaker' | 'Member'> = ['PM', 'HM', 'FM', 'Speaker', 'Member'];

export default function LokSabhaDataEditor({
    state,
    onStateChange,
    reservationType,
    onReservationChange,
    parties,
    onPartiesChange,
    portfolios,
    onPortfoliosChange,
}: LokSabhaDataEditorProps) {
    const [newPartyName, setNewPartyName] = useState("");
    const [newPartySeats, setNewPartySeats] = useState(1);

    const addParty = () => {
        if (newPartyName.trim() && newPartySeats > 0) {
            onPartiesChange([...parties, { name: newPartyName.trim(), seatShare: newPartySeats }]);
            setNewPartyName("");
            setNewPartySeats(1);
        }
    };

    const removeParty = (index: number) => {
        onPartiesChange(parties.filter((_, i) => i !== index));
    };

    const addPortfolio = (role: typeof PORTFOLIO_ROLES[number]) => {
        const exists = portfolios.find(p => p.role === role);
        if (!exists) {
            onPortfoliosChange([...portfolios, { role }]);
        }
    };

    const removePortfolio = (index: number) => {
        onPortfoliosChange(portfolios.filter((_, i) => i !== index));
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div>
                    <h4 className="text-lg font-bold mb-2">Lok Sabha Configuration</h4>
                    <p className="text-sm text-gray-400">Configure constituency, parties, and portfolios</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* State Selection */}
                    <Select
                        label="State/UT"
                        selectedKeys={state ? [state] : []}
                        onChange={(e) => onStateChange(e.target.value)}
                        placeholder="Select state"
                    >
                        {INDIAN_STATES.map((stateName) => (
                            <SelectItem key={stateName} value={stateName}>
                                {stateName}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Reservation Type */}
                    <Select
                        label="Reservation Type"
                        selectedKeys={[reservationType]}
                        onChange={(e) => onReservationChange(e.target.value as any)}
                    >
                        <SelectItem key="General" value="General">General</SelectItem>
                        <SelectItem key="SC" value="SC">SC (Scheduled Caste)</SelectItem>
                        <SelectItem key="ST" value="ST">ST (Scheduled Tribe)</SelectItem>
                    </Select>
                </div>

                {/* Party Allocation */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Party Seat Allocation</h5>

                    {parties.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {parties.map((party, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 size={16} className="text-blue-400" />
                                        <span className="text-sm font-medium">{party.name}</span>
                                        <Chip size="sm" color="primary" variant="flat">
                                            {party.seatShare} {party.seatShare === 1 ? 'Seat' : 'Seats'}
                                        </Chip>
                                    </div>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        isIconOnly
                                        onClick={() => removeParty(index)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Input
                            placeholder="Party name"
                            value={newPartyName}
                            onChange={(e) => setNewPartyName(e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            placeholder="Seats"
                            value={newPartySeats.toString()}
                            onChange={(e) => setNewPartySeats(Number(e.target.value))}
                            className="w-24"
                            min="1"
                        />
                        <Button
                            color="primary"
                            onClick={addParty}
                            isDisabled={!newPartyName.trim()}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
                </div>

                {/* Portfolios */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Key Portfolios</h5>
                    <div className="flex flex-wrap gap-2">
                        {PORTFOLIO_ROLES.map((role) => {
                            const assigned = portfolios.find(p => p.role === role);
                            return (
                                <Button
                                    key={role}
                                    size="sm"
                                    color={assigned ? "success" : "default"}
                                    variant={assigned ? "flat" : "bordered"}
                                    onClick={() => assigned ? removePortfolio(portfolios.indexOf(assigned)) : addPortfolio(role)}
                                >
                                    {role}
                                    {assigned && <X size={14} className="ml-1" />}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
