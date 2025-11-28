"use client";

import { Card, CardBody, Input, Button, Select, SelectItem, Chip, Textarea } from "@heroui/react";
import { Plus, X, MessageSquare, Upload, Download, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Papa from 'papaparse';

interface Adjudicator {
    name: string;
    expertise?: string;
}

interface DebateDataEditorProps {
    type: 'PD' | 'Turncoat' | 'Extempore';
    onTypeChange: (type: 'PD' | 'Turncoat' | 'Extempore') => void;
    topics: string[];
    onTopicsChange: (topics: string[]) => void;
    formatRules: string;
    onFormatRulesChange: (rules: string) => void;
    adjudicators: Adjudicator[];
    onAdjudicatorsChange: (adjudicators: Adjudicator[]) => void;
}

function SortableTopicItem({ topic, index, onRemove }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: topic + index });

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
            <div className="flex items-center gap-3 flex-1">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-gray-500" />
                </div>
                <MessageSquare size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-sm">{topic}</span>
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

export default function DebateDataEditor({
    type,
    onTypeChange,
    topics,
    onTopicsChange,
    formatRules,
    onFormatRulesChange,
    adjudicators,
    onAdjudicatorsChange,
}: DebateDataEditorProps) {
    const [newTopic, setNewTopic] = useState("");
    const [newAdjudicatorName, setNewAdjudicatorName] = useState("");
    const [newAdjudicatorExpertise, setNewAdjudicatorExpertise] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addTopic = () => {
        if (newTopic.trim()) {
            onTopicsChange([...topics, newTopic.trim()]);
            setNewTopic("");
        }
    };

    const removeTopic = (index: number) => {
        onTopicsChange(topics.filter((_, i) => i !== index));
    };

    const addAdjudicator = () => {
        if (newAdjudicatorName.trim()) {
            onAdjudicatorsChange([...adjudicators, {
                name: newAdjudicatorName.trim(),
                expertise: newAdjudicatorExpertise.trim() || undefined,
            }]);
            setNewAdjudicatorName("");
            setNewAdjudicatorExpertise("");
        }
    };

    const removeAdjudicator = (index: number) => {
        onAdjudicatorsChange(adjudicators.filter((_, i) => i !== index));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = topics.findIndex((t, i) => t + i === active.id);
            const newIndex = topics.findIndex((t, i) => t + i === over.id);
            onTopicsChange(arrayMove(topics, oldIndex, newIndex));
        }
    };

    // CSV Import for topics
    const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results: any) => {
                    const imported = results.data
                        .filter((row: any) => row.topic)
                        .map((row: any) => row.topic.trim());
                    onTopicsChange([...topics, ...imported]);
                },
            });
        }
    };

    // CSV Export
    const handleCSVExport = () => {
        const csv = Papa.unparse(topics.map(t => ({ topic: t })));
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'debate_topics.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-2">Debate Configuration</h4>
                        <p className="text-sm text-gray-400">Configure debate type, topics, and adjudicators</p>
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
                            isDisabled={topics.length === 0}
                        >
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Debate Type */}
                <Select
                    label="Debate Type"
                    selectedKeys={[type]}
                    onChange={(e) => onTypeChange(e.target.value as any)}
                >
                    <SelectItem key="PD" value="PD">
                        Parliamentary Debate (PD)
                    </SelectItem>
                    <SelectItem key="Turncoat" value="Turncoat">
                        Turncoat
                    </SelectItem>
                    <SelectItem key="Extempore" value="Extempore">
                        Extempore
                    </SelectItem>
                </Select>

                {/* Topics with Drag & Drop */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Debate Topics ({topics.length})</h5>

                    {topics.length > 0 && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={topics.map((t, i) => t + i)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                                    {topics.map((topic, index) => (
                                        <SortableTopicItem
                                            key={topic + index}
                                            topic={topic}
                                            index={index}
                                            onRemove={removeTopic}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g., Should AI be regulated?"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTopic()}
                            className="flex-1"
                        />
                        <Button
                            color="primary"
                            onClick={addTopic}
                            isDisabled={!newTopic.trim()}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Drag to reorder • Press Enter to add • CSV format: topic
                    </p>
                </div>

                {/* Format Rules */}
                <Textarea
                    label="Format Rules"
                    placeholder="Describe the debate format, time limits, speaking order, etc."
                    value={formatRules}
                    onChange={(e) => onFormatRulesChange(e.target.value)}
                    minRows={4}
                    description="Outline the structure and rules for this debate format"
                />

                {/* Adjudicators */}
                <div>
                    <h5 className="text-sm font-semibold text-gray-400 mb-3">Adjudicators</h5>

                    {adjudicators.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {adjudicators.map((adj, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{adj.name}</p>
                                        {adj.expertise && (
                                            <p className="text-xs text-gray-400">{adj.expertise}</p>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        isIconOnly
                                        onClick={() => removeAdjudicator(index)}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Input
                            placeholder="Adjudicator name"
                            value={newAdjudicatorName}
                            onChange={(e) => setNewAdjudicatorName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Input
                                placeholder="Expertise (optional)"
                                value={newAdjudicatorExpertise}
                                onChange={(e) => setNewAdjudicatorExpertise(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                color="primary"
                                onClick={addAdjudicator}
                                isDisabled={!newAdjudicatorName.trim()}
                            >
                                <Plus size={16} />
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
