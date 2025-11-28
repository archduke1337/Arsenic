"use client";

import { Card, CardBody, Input, Button, Chip, Select, SelectItem } from "@nextui-org/react";
import { Plus, X, Flag, Upload, Download, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Papa from 'papaparse';

interface Country {
    name: string;
    flag: string;
    isDouble: boolean;
}

interface MUNDataEditorProps {
    countries: Country[];
    onChange: (countries: Country[]) => void;
    difficultyTag?: 'beginner' | 'intermediate' | 'advanced';
    onDifficultyChange: (tag: 'beginner' | 'intermediate' | 'advanced') => void;
}

function SortableCountryItem({ country, index, onToggleDouble, onRemove }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: country.name + index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="flex items-center gap-3 flex-1">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-gray-500" />
                </div>
                <img
                    src={country.flag}
                    alt={country.name}
                    className="w-6 h-4 object-cover rounded"
                />
                <span className="text-sm font-medium">{country.name}</span>
                {country.isDouble && (
                    <Chip size="sm" color="secondary" variant="flat">
                        Double
                    </Chip>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    onClick={() => onToggleDouble(index)}
                >
                    {country.isDouble ? "Single" : "Double"}
                </Button>
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
        </div>
    );
}

export default function MUNDataEditor({
    countries,
    onChange,
    difficultyTag,
    onDifficultyChange,
}: MUNDataEditorProps) {
    const [newCountry, setNewCountry] = useState("");
    const [isDouble, setIsDouble] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addCountry = () => {
        if (newCountry.trim()) {
            const countryCode = newCountry.substring(0, 2).toUpperCase();
            onChange([...countries, {
                name: newCountry.trim(),
                flag: `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`,
                isDouble,
            }]);
            setNewCountry("");
            setIsDouble(false);
        }
    };

    const removeCountry = (index: number) => {
        onChange(countries.filter((_, i) => i !== index));
    };

    const toggleDouble = (index: number) => {
        const updated = countries.map((country, i) =>
            i === index ? { ...country, isDouble: !country.isDouble } : country
        );
        onChange(updated);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = countries.findIndex((c, i) => c.name + i === active.id);
            const newIndex = countries.findIndex((c, i) => c.name + i === over.id);
            onChange(arrayMove(countries, oldIndex, newIndex));
        }
    };

    // CSV Import
    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: any) => {
                    const importedCountries = results.data
                        .filter((row: any) => row.country && row.country.trim())
                        .map((row: any) => {
                            const countryCode = row.country.substring(0, 2).toUpperCase();
                            return {
                                name: row.country.trim(),
                                flag: `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`,
                                isDouble: row.double?.toLowerCase() === 'true' || row.double === '1',
                            };
                        });
                    onChange([...countries, ...importedCountries]);
                },
                error: (error: any) => {
                    alert(`CSV import failed: ${error.message}`);
                }
            });
        }
    };

    // CSV Export
    const handleCSVExport = () => {
        const csv = Papa.unparse(countries.map(c => ({
            country: c.name,
            double: c.isDouble,
        })));
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'countries.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-2">MUN Committee Configuration</h4>
                        <p className="text-sm text-gray-400">Configure countries and difficulty level</p>
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
                            isDisabled={countries.length === 0}
                        >
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Difficulty Tag */}
                <Select
                    label="Difficulty Level"
                    selectedKeys={difficultyTag ? [difficultyTag] : []}
                    onChange={(e) => onDifficultyChange(e.target.value as any)}
                    classNames={{
                        value: "text-sm"
                    }}
                >
                    <SelectItem key="beginner" value="beginner">
                        Beginner
                    </SelectItem>
                    <SelectItem key="intermediate" value="intermediate">
                        Intermediate
                    </SelectItem>
                    <SelectItem key="advanced" value="advanced">
                        Advanced
                    </SelectItem>
                </Select>

                {/* Country List with Drag & Drop */}
                {countries.length > 0 && (
                    <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-400">Countries ({countries.length})</h5>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={countries.map((c, i) => c.name + i)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {countries.map((country, index) => (
                                        <SortableCountryItem
                                            key={country.name + index}
                                            country={country}
                                            index={index}
                                            onToggleDouble={toggleDouble}
                                            onRemove={removeCountry}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                {/* Add Country */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-2">Add Country</h5>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Country name (e.g., United States)"
                            value={newCountry}
                            onChange={(e) => setNewCountry(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCountry()}
                            startContent={<Flag size={16} className="text-gray-400" />}
                        />
                        <Button
                            color="primary"
                            onClick={addCountry}
                            isDisabled={!newCountry.trim()}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Tip: Press Enter to quickly add • CSV format: country,double
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}
