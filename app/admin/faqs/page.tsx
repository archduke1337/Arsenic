"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem, Textarea
} from "@nextui-org/react";
import { Plus, Edit, Trash2, GripVertical, HelpCircle } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID, Query } from "appwrite";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

const FAQ_CATEGORIES = ['GENERAL', 'REGISTRATION', 'PAYMENT', 'EVENT', 'ACCOMMODATION'] as const;

interface FAQ {
    $id?: string;
    category: typeof FAQ_CATEGORIES[number];
    question: string;
    answer: string;
    displayOrder: number;
}

function SortableFAQItem({ faq, onEdit, onDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: faq.$id || faq.question });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="flex items-start gap-3 flex-1">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
                    <GripVertical size={20} className="text-gray-500" />
                </div>

                <div className="flex-1">
                    <h6 className="font-semibold mb-2">{faq.question}</h6>
                    <p className="text-sm text-gray-400 line-clamp-2">{faq.answer}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    isIconOnly
                    onClick={() => onEdit(faq)}
                >
                    <Edit size={16} />
                </Button>
                <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onClick={() => onDelete(faq.$id)}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function AdminFAQs() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

    const [formData, setFormData] = useState({
        category: "GENERAL" as typeof FAQ_CATEGORIES[number],
        question: "",
        answer: "",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FAQS,
                [Query.orderAsc("displayOrder")]
            );
            setFaqs(response.documents as any);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            toast.error("Failed to fetch FAQs");
        }
    };

    const handleSubmit = async () => {
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error("Question and answer are required");
            return;
        }

        setLoading(true);
        try {
            const faqData = {
                category: formData.category,
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                displayOrder: editingFAQ?.displayOrder ?? faqs.length,
            };

            if (editingFAQ) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.FAQS,
                    editingFAQ.$id!,
                    faqData
                );
                toast.success("FAQ updated successfully");
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.FAQS,
                    ID.unique(),
                    faqData
                );
                toast.success("FAQ created successfully");
            }

            await fetchFAQs();
            resetForm();
        } catch (error) {
            console.error("Error saving FAQ:", error);
            toast.error("Failed to save FAQ");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (faqId: string) => {
        if (confirm("Delete this FAQ?")) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FAQS, faqId);
                toast.success("FAQ deleted");
                await fetchFAQs();
            } catch (error) {
                console.error("Error deleting FAQ:", error);
                toast.error("Failed to delete FAQ");
            }
        }
    };

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq);
        setFormData({
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
        });
        setIsCreating(true);
    };

    const resetForm = () => {
        setFormData({
            category: "GENERAL",
            question: "",
            answer: "",
        });
        setIsCreating(false);
        setEditingFAQ(null);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = filteredFAQs.findIndex(f => f.$id === active.id);
            const newIndex = filteredFAQs.findIndex(f => f.$id === over.id);
            const reordered = arrayMove(filteredFAQs, oldIndex, newIndex);

            const updatedFAQs = [...faqs.filter(f => selectedCategory === "ALL" || f.category !== selectedCategory), ...reordered];
            setFaqs(updatedFAQs);

            try {
                for (let i = 0; i < reordered.length; i++) {
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTIONS.FAQS,
                        reordered[i].$id!,
                        { displayOrder: i }
                    );
                }
                toast.success("FAQ order updated");
            } catch (error) {
                console.error("Error updating order:", error);
                toast.error("Failed to update order");
            }
        }
    };

    const filteredFAQs = selectedCategory === "ALL"
        ? faqs
        : faqs.filter(f => f.category === selectedCategory);

    const faqsByCategory = FAQ_CATEGORIES.reduce((acc, category) => {
        acc[category] = faqs.filter(f => f.category === category);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        FAQ Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage frequently asked questions</p>
                </div>
                <div className="flex gap-4">
                    <Select
                        label="Filter by Category"
                        selectedKeys={[selectedCategory]}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-48"
                        size="sm"
                    >
                        {["ALL", ...FAQ_CATEGORIES].map((category) => (
                            <SelectItem key={category} value={category}>
                                {category === "ALL" 
                                    ? "All Categories" 
                                    : `${category} (${faqsByCategory[category as keyof typeof faqsByCategory]?.length || 0})`}
                            </SelectItem>
                        ))}
                    </Select>
                    {!isCreating && (
                        <Button
                            color="primary"
                            startContent={<Plus size={20} />}
                            onClick={() => setIsCreating(true)}
                            size="lg"
                        >
                            Add FAQ
                        </Button>
                    )}
                </div>
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <Card className="bg-zinc-900/50 border border-white/10 mb-6">
                    <CardBody className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">
                            {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
                        </h3>

                        <Select
                            label="Category"
                            selectedKeys={[formData.category]}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        >
                            {FAQ_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            label="Question"
                            placeholder="What is your question?"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            isRequired
                        />

                        <Textarea
                            label="Answer"
                            placeholder="Provide a detailed answer..."
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            minRows={4}
                            isRequired
                        />

                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                onClick={handleSubmit}
                                isLoading={loading}
                            >
                                {editingFAQ ? "Update" : "Create"}
                            </Button>
                            <Button
                                variant="flat"
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* FAQs List */}
            {filteredFAQs.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredFAQs.map(f => f.$id!)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {filteredFAQs.map((faq) => (
                                <SortableFAQItem
                                    key={faq.$id}
                                    faq={faq}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-12 text-center">
                        <HelpCircle size={64} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold mb-2">No FAQs yet</h3>
                        <p className="text-gray-400 mb-4">Add FAQs to help users find answers</p>
                        <Button
                            color="primary"
                            startContent={<Plus size={16} />}
                            onClick={() => setIsCreating(true)}
                        >
                            Add First FAQ
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
