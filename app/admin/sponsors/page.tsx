"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem, Chip
} from "@nextui-org/react";
import { Plus, Edit, Trash2, GripVertical, Building2, Upload } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast, Toaster } from "sonner";

const SPONSOR_TIERS = ['TITLE', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'] as const;

interface Sponsor {
    $id?: string;
    name: string;
    tier: typeof SPONSOR_TIERS[number];
    logoUrl: string;
    website?: string;
    description?: string;
    displayOrder: number;
}

function SortableSponsorCard({ sponsor, onEdit, onDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sponsor.$id || sponsor.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const tierColors: Record<string, string> = {
        TITLE: 'bg-gradient-to-r from-purple-500 to-pink-500',
        PLATINUM: 'bg-gradient-to-r from-gray-300 to-gray-400',
        GOLD: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        SILVER: 'bg-gradient-to-r from-gray-400 to-gray-500',
        BRONZE: 'bg-gradient-to-r from-orange-600 to-orange-700',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="flex items-center gap-4 flex-1">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} className="text-gray-500" />
                </div>

                <div className="w-20 h-20 bg-white rounded-lg p-2 flex items-center justify-center">
                    {sponsor.logoUrl ? (
                        <img
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <Building2 size={32} className="text-gray-400" />
                    )}
                </div>

                <div className="flex-1">
                    <h6 className="font-semibold text-lg">{sponsor.name}</h6>
                    <div className="flex gap-2 mt-1">
                        <Chip
                            size="sm"
                            className={`${tierColors[sponsor.tier]} text-white font-bold`}
                        >
                            {sponsor.tier}
                        </Chip>
                        {sponsor.website && (
                            <Chip size="sm" variant="flat">
                                {new URL(sponsor.website).hostname}
                            </Chip>
                        )}
                    </div>
                    {sponsor.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{sponsor.description}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    startContent={<Edit size={16} />}
                    onClick={() => onEdit(sponsor)}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onClick={() => onDelete(sponsor.$id)}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function AdminSponsors() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        tier: "GOLD" as typeof SPONSOR_TIERS[number],
        website: "",
        description: "",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const response = await fetch('/api/admin/sponsors');
            if (!response.ok) throw new Error('Failed to fetch sponsors');
            const data = await response.json();
            setSponsors(data.documents || data);
        } catch (error) {
            console.error("Error fetching sponsors:", error);
            toast.error("Failed to fetch sponsors");
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const uploadLogo = async (): Promise<string> => {
        if (!logoFile) return "";

        try {
            const formData = new FormData();
            formData.append('file', logoFile);
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Logo upload error:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Sponsor name is required");
            return;
        }

        setLoading(true);
        try {
            let logoUrl = editingSponsor?.logoUrl || "";

            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const sponsorData = {
                name: formData.name.trim(),
                tier: formData.tier,
                logoUrl,
                website: formData.website.trim() || undefined,
                description: formData.description.trim() || undefined,
                displayOrder: editingSponsor?.displayOrder ?? sponsors.length,
            };

            if (editingSponsor) {
                const response = await fetch('/api/admin/sponsors', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingSponsor.$id, ...sponsorData })
                });
                if (!response.ok) throw new Error('Update failed');
                toast.success("Sponsor updated successfully");
            } else {
                const response = await fetch('/api/admin/sponsors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sponsorData)
                });
                if (!response.ok) throw new Error('Create failed');
                toast.success("Sponsor created successfully");
            }

            await fetchSponsors();
            resetForm();
        } catch (error) {
            console.error("Error saving sponsor:", error);
            toast.error("Failed to save sponsor");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (sponsorId: string) => {
        if (confirm("Delete this sponsor?")) {
            try {
                const response = await fetch(`/api/admin/sponsors?id=${sponsorId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Delete failed');
                toast.success("Sponsor deleted");
                await fetchSponsors();
            } catch (error) {
                console.error("Error deleting sponsor:", error);
                toast.error("Failed to delete sponsor");
            }
        }
    };

    const handleEdit = (sponsor: Sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name,
            tier: sponsor.tier,
            website: sponsor.website || "",
            description: sponsor.description || "",
        });
        setLogoPreview(sponsor.logoUrl);
        setIsCreating(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            tier: "GOLD",
            website: "",
            description: "",
        });
        setLogoFile(null);
        setLogoPreview("");
        setIsCreating(false);
        setEditingSponsor(null);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = sponsors.findIndex(s => s.$id === active.id);
            const newIndex = sponsors.findIndex(s => s.$id === over.id);
            const reordered = arrayMove(sponsors, oldIndex, newIndex);

            setSponsors(reordered);

            // Update display orders in database
            try {
                for (let i = 0; i < reordered.length; i++) {
                    const response = await fetch('/api/admin/sponsors', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: reordered[i].$id, displayOrder: i })
                    });
                    if (!response.ok) throw new Error('Update order failed');
                }
                toast.success("Sponsor order updated");
            } catch (error) {
                console.error("Error updating order:", error);
                toast.error("Failed to update order");
            }
        }
    };

    // Group sponsors by tier
    const sponsorsByTier = SPONSOR_TIERS.reduce((acc, tier) => {
        acc[tier] = sponsors.filter(s => s.tier === tier);
        return acc;
    }, {} as Record<string, Sponsor[]>);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Sponsor Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage event sponsors and tiers</p>
                </div>
                {!isCreating && (
                    <Button
                        color="primary"
                        startContent={<Plus size={20} />}
                        onClick={() => setIsCreating(true)}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600"
                        size="lg"
                    >
                        Add Sponsor
                    </Button>
                )}
            </div>

            {/* Create/Edit Form */}
            {isCreating && (
                <Card className="bg-zinc-900/50 border border-white/10 mb-6">
                    <CardBody className="p-6 space-y-4">
                        <h3 className="text-xl font-bold">
                            {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Sponsor Name"
                                placeholder="e.g., Acme Corp"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                isRequired
                            />
                            <Select
                                label="Tier"
                                selectedKeys={[formData.tier]}
                                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                            >
                                {SPONSOR_TIERS.map((tier) => (
                                    <SelectItem key={tier} value={tier}>
                                        {tier}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <Input
                            label="Website (Optional)"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />

                        <Input
                            label="Description (Optional)"
                            placeholder="Brief description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        {/* Logo Upload */}
                        <div>
                            <label className="text-sm font-semibold mb-2 block">Logo</label>
                            <div className="flex gap-4">
                                {logoPreview && (
                                    <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center">
                                        <img
                                            src={logoPreview}
                                            alt="Preview"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                )}
                                <Button
                                    startContent={<Upload size={16} />}
                                    onClick={() => document.getElementById('logo-input')?.click()}
                                >
                                    {logoPreview ? "Change Logo" : "Upload Logo"}
                                </Button>
                                <input
                                    id="logo-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                onClick={handleSubmit}
                                isLoading={loading}
                            >
                                {editingSponsor ? "Update" : "Create"}
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

            {/* Sponsors Grid by Tier */}
            {sponsors.length > 0 ? (
                <div className="space-y-6">
                    {SPONSOR_TIERS.map((tier) => {
                        const tierSponsors = sponsorsByTier[tier];
                        if (tierSponsors.length === 0) return null;

                        return (
                            <div key={tier}>
                                <h2 className="text-2xl font-bold mb-4">{tier} Sponsors ({tierSponsors.length})</h2>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={tierSponsors.map(s => s.$id!)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3">
                                            {tierSponsors.map((sponsor) => (
                                                <SortableSponsorCard
                                                    key={sponsor.$id}
                                                    sponsor={sponsor}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-12 text-center">
                        <Building2 size={64} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold mb-2">No sponsors yet</h3>
                        <p className="text-gray-400 mb-4">Add sponsors to showcase partnerships</p>
                        <Button
                            color="primary"
                            startContent={<Plus size={16} />}
                            onClick={() => setIsCreating(true)}
                        >
                            Add First Sponsor
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
