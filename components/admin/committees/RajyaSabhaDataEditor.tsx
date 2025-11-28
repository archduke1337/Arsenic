"use client";

import { Card, CardBody, Input, Button, Chip } from "@nextui-org/react";
import { Plus, X, Users, Upload, Download, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Papa from 'papaparse';

interface PartyAllocation {
    party: string;
    seats: number;
}

interface RajyaSabhaDataEditorProps {
    stateUT: string;
    onStateUTChange: (state: string) => void;
    seatsAvailable: number;
    onSeatsChange: (seats: number) => void;
    partyAllocation: PartyAllocation[];
    onPartyAllocationChange: (allocation: PartyAllocation[]) => void;
    nominatedMembers: string[];
    onNominatedMembersChange: (members: string[]) => void;
}

function SortablePartyItem({ allocation, index, onRemove }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: allocation.party + index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
        >
            <div className="flex items-center gap-3">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-gray-500" />
                </div>
                <Users size={16} className="text-purple-400" />
                <span className="text-sm font-medium">{allocation.party}</span>
                <Chip size="sm" color="secondary" variant="flat">
                    {allocation.seats} {allocation.seats === 1 ? 'Seat' : 'Seats'}
                </Chip>
            </div>
            <Button
                size="sm"
                color="danger"
                variant="flat"
                isIconOnly
                onClick={() => onRemove(index)}
            >
                <X size={16} />
            </Button>
        </div>
    );
}

export default function RajyaSabhaDataEditor({
    stateUT,
    onStateUTChange,
    seatsAvailable,
    onSeatsChange,
    partyAllocation,
    onPartyAllocationChange,
    nominatedMembers,
    onNominatedMembersChange,
}: RajyaSabhaDataEditorProps) {
    const [newParty, setNewParty] = useState("");
    const [newSeats, setNewSeats] = useState(1);
    const [newNominee, setNewNominee] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addParty = () => {
        if (newParty.trim() && newSeats > 0) {
            const totalAllocated = partyAllocation.reduce((sum, p) => sum + p.seats, 0) + newSeats;
            if (totalAllocated <= seatsAvailable) {
                onPartyAllocationChange([...partyAllocation, { party: newParty.trim(), seats: newSeats }]);
                setNewParty("");
                setNewSeats(1);
            } else {
                alert(`Cannot allocate ${newSeats} seats. Available: ${seatsAvailable - partyAllocation.reduce((sum, p) => sum + p.seats, 0)}`);
            }
        }
    };

    const removeParty = (index: number) => {
        onPartyAllocationChange(partyAllocation.filter((_, i) => i !== index));
    };

    const addNominee = () => {
        if (newNominee.trim()) {
            onNominatedMembersChange([...nominatedMembers, newNominee.trim()]);
            setNewNominee("");
        }
    };

    const removeNominee = (index: number) => {
        onNominatedMembersChange(nominatedMembers.filter((_, i) => i !== index));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = partyAllocation.findIndex((p, i) => p.party + i === active.id);
            const newIndex = partyAllocation.findIndex((p, i) => p.party + i === over.id);
            onPartyAllocationChange(arrayMove(partyAllocation, oldIndex, newIndex));
        }
    };

    // CSV Import
    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: any) => {
                    const imported = results.data
                        .filter((row: any) => row.party && row.seats)
                        .map((row: any) => ({
                            party: row.party.trim(),
                            seats: parseInt(row.seats) || 1,
                        }));
                    onPartyAllocationChange([...partyAllocation, ...imported]);
                },
            });
        }
    };

    // CSV Export
    const handleCSVExport = () => {
        const csv = Papa.unparse(partyAllocation.map(p => ({
            party: p.party,
            seats: p.seats,
        })));
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'party_allocation.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const allocatedSeats = partyAllocation.reduce((sum, p) => sum + p.seats, 0);
    const remainingSeats = seatsAvailable - allocatedSeats;

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-2">Rajya Sabha Configuration</h4>
                        <p className="text-sm text-gray-400">Configure state representation and party allocation</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<Upload size={16} />}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Import CSV
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleCSVImport}
                            className="hidden"
                        />
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<Download size={16} />}
                            onClick={handleCSVExport}
                            isDisabled={partyAllocation.length === 0}
                        >
                            Export CSV
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="State/UT"
                        placeholder="e.g., Maharashtra"
                        value={stateUT}
                        onChange={(e) => onStateUTChange(e.target.value)}
                    />
                    <Input
                        label="Total Seats Available"
                        type="number"
                        value={seatsAvailable.toString()}
                        onChange={(e) => onSeatsChange(Number(e.target.value))}
                        min="1"
                    />
                </div>

                {/* Seat Allocation Summary */}
                {seatsAvailable > 0 && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Allocated Seats:</span>
                            <span className="font-bold text-blue-400">{allocatedSeats} / {seatsAvailable}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">Remaining:</span>
                            <span className={`font-bold ${remainingSeats === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {remainingSeats}
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                                style={{ width: `${(allocatedSeats / seatsAvailable) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Party Allocation with Drag & Drop */}
                {partyAllocation.length > 0 && (
                    <div>
                        <h5 className="text-sm font-semibold text-gray-400 mb-3">Party-wise Seat Allocation</h5>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={partyAllocation.map((p, i) => p.party + i)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {partyAllocation.map((allocation, index) => (
                                        <SortablePartyItem
                                            key={allocation.party + index}
                                            allocation={allocation}
                                            index={index}
                                            onRemove={removeParty}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                <div className="flex gap-2">
                    <Input
                        placeholder="Party name"
                        value={newParty}
                        onChange={(e) => setNewParty(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && newSeats && addParty()}
                        className="flex-1"
                    />
                    <Input
                        type="number"
                        placeholder="Seats"
                        value={newSeats.toString()}
                        onChange={(e) => setNewSeats(Number(e.target.value))}
                        className="w-24"
                        min="1"
                        max={remainingSeats}
                    />
                    <Button
                        color="primary"
                        onClick={addParty}
                        isDisabled={!newParty.trim() || remainingSeats === 0}
                    >
                        <Plus size={16} />
                        Add
                    </Button>
                </div>

                {/* Nominated Members */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Nominated Members (Optional)</h5>

                    {nominatedMembers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {nominatedMembers.map((member, index) => (
                                <Chip
                                    key={index}
                                    onClose={() => removeNominee(index)}
                                    variant="flat"
                                    color="warning"
                                >
                                    {member}
                                </Chip>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Input
                            placeholder="Nominee name"
                            value={newNominee}
                            onChange={(e) => setNewNominee(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addNominee()}
                        />
                        <Button
                            color="warning"
                            onClick={addNominee}
                            isDisabled={!newNominee.trim()}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        CSV format: party,seats
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}
