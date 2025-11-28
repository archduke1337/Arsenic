"use client";

import { Card, CardBody, Input, Button, Chip, Checkbox } from "@heroui/react";
import { Plus, X, Image as ImageIcon, Edit2, Star } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Album {
    $id?: string;
    name: string;
    slug: string;
    eventType: string;
    coverImageUrl?: string;
    description?: string;
    year: string;
    displayOrder?: number;
    imageCount?: number;
}

interface AlbumManagerProps {
    albums: Album[];
    onAlbumsChange: (albums: Album[]) => void;
    eventTypes: string[];
    onSetCover?: (albumId: string, imageUrl: string) => void;
}

function SortableAlbumCard({ album, onEdit, onDelete, onSetCover }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: album.$id || album.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
        >
            <div className="flex items-center gap-4 flex-1">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                    {album.coverImageUrl ? (
                        <img
                            src={album.coverImageUrl}
                            alt={album.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <ImageIcon size={24} className="text-white" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h6 className="font-semibold">{album.name}</h6>
                        {album.coverImageUrl && (
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        )}
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                        <Chip size="sm" variant="flat" color="secondary">
                            {album.eventType}
                        </Chip>
                        <Chip size="sm" variant="flat">
                            {album.year}
                        </Chip>
                        <Chip size="sm" variant="flat" color="primary">
                            {album.imageCount || 0} images
                        </Chip>
                    </div>
                    {album.description && (
                        <p className="text-xs text-gray-400 mt-1">{album.description}</p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    isIconOnly
                    onClick={() => onEdit(album)}
                >
                    <Edit2 size={16} />
                </Button>
                <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onClick={() => onDelete(album)}
                >
                    <X size={16} />
                </Button>
            </div>
        </div>
    );
}

export default function AlbumManager({
    albums,
    onAlbumsChange,
    eventTypes,
    onSetCover,
}: AlbumManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        eventType: eventTypes[0] || "",
        description: "",
        year: new Date().getFullYear().toString(),
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCreate = () => {
        if (formData.name.trim()) {
            const newAlbum: Album = {
                name: formData.name.trim(),
                slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                eventType: formData.eventType,
                description: formData.description.trim() || undefined,
                year: formData.year,
                displayOrder: albums.length,
                imageCount: 0,
            };
            onAlbumsChange([...albums, newAlbum]);
            resetForm();
        }
    };

    const handleUpdate = () => {
        if (editingAlbum) {
            const updated = albums.map(a =>
                a === editingAlbum
                    ? {
                        ...a,
                        name: formData.name,
                        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                        eventType: formData.eventType,
                        description: formData.description || undefined,
                        year: formData.year,
                    }
                    : a
            );
            onAlbumsChange(updated);
            resetForm();
        }
    };

    const handleDelete = (album: Album) => {
        if (confirm(`Delete album "${album.name}"? This will not delete the images.`)) {
            onAlbumsChange(albums.filter(a => a !== album));
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            eventType: eventTypes[0] || "",
            description: "",
            year: new Date().getFullYear().toString(),
        });
        setIsCreating(false);
        setEditingAlbum(null);
    };

    const startEdit = (album: Album) => {
        setEditingAlbum(album);
        setFormData({
            name: album.name,
            eventType: album.eventType,
            description: album.description || "",
            year: album.year,
        });
        setIsCreating(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = albums.findIndex(a => (a.$id || a.name) === active.id);
            const newIndex = albums.findIndex(a => (a.$id || a.name) === over.id);
            const reordered = arrayMove(albums, oldIndex, newIndex).map((a, i) => ({
                ...a,
                displayOrder: i,
            }));
            onAlbumsChange(reordered);
        }
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-1">Album Management</h4>
                        <p className="text-sm text-gray-400">Organize images into albums • Drag to reorder</p>
                    </div>
                    {!isCreating && (
                        <Button
                            color="primary"
                            startContent={<Plus size={16} />}
                            onClick={() => setIsCreating(true)}
                        >
                            Create Album
                        </Button>
                    )}
                </div>

                {/* Create/Edit Form */}
                {isCreating && (
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                        <h5 className="text-sm font-semibold">
                            {editingAlbum ? "Edit Album" : "Create New Album"}
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Album Name"
                                placeholder="e.g., ARSENIC 2024"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                isRequired
                            />
                            <Input
                                label="Year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                isRequired
                            />
                        </div>
                        <Input
                            label="Event Type"
                            value={formData.eventType}
                            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                            placeholder="MUN, Lok Sabha, etc."
                        />
                        <Input
                            label="Description (Optional)"
                            placeholder="Brief description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                onClick={editingAlbum ? handleUpdate : handleCreate}
                                isDisabled={!formData.name.trim()}
                            >
                                {editingAlbum ? "Update" : "Create"}
                            </Button>
                            <Button
                                variant="flat"
                                onClick={resetForm}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Albums List with Drag & Drop */}
                {albums.length > 0 ? (
                    <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-gray-400">Albums ({albums.length})</h5>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={albums.map(a => a.$id || a.name)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {albums.map((album) => (
                                        <SortableAlbumCard
                                            key={album.$id || album.name}
                                            album={album}
                                            onEdit={startEdit}
                                            onDelete={handleDelete}
                                            onSetCover={onSetCover}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No albums yet. Create one to get started!</p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
