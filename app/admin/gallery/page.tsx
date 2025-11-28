"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Select, SelectItem, Tabs, Tab, Chip, Checkbox
} from "@heroui/react";
import { Plus, Image as ImageIcon, Trash2, Eye, Edit, Star } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPES } from "@/lib/schema";
import { ID, Query } from "appwrite";
import BulkGalleryUpload from "@/components/admin/gallery/BulkGalleryUpload";
import AlbumManager from "@/components/admin/gallery/AlbumManager";
import ImageCaptionEditor from "@/components/admin/gallery/ImageCaptionEditor";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminGallery() {
    const [activeTab, setActiveTab] = useState("upload");
    const [albums, setAlbums] = useState<any[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState("");
    const [selectedEventType, setSelectedEventType] = useState(EVENT_TYPES[0]);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Batch operations
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Caption editor
    const [editingImage, setEditingImage] = useState<any>(null);
    const [captionEditorOpen, setCaptionEditorOpen] = useState(false);

    useEffect(() => {
        fetchAlbums();
        fetchGalleryImages();
    }, []);

    const fetchAlbums = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ALBUMS,
                [Query.orderDesc("$createdAt")]
            );
            setAlbums(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching albums:", error);
            toast.error("Failed to fetch albums");
        }
    };

    const fetchGalleryImages = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.GALLERY,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            setGalleryImages(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            toast.error("Failed to fetch gallery images");
        }
    };

    const handleBulkUploadComplete = async (uploadedImages: any[]) => {
        setLoading(true);
        try {
            for (const imageData of uploadedImages) {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.GALLERY,
                    ID.unique(),
                    imageData
                );
            }

            toast.success(`${uploadedImages.length} images uploaded successfully!`);
            await fetchGalleryImages();

            if (selectedAlbum) {
                await fetchAlbums();
            }
        } catch (error) {
            console.error("Error saving images:", error);
            toast.error("Failed to save images to database");
        } finally {
            setLoading(false);
        }
    };

    const handleAlbumsChange = async (newAlbums: any[]) => {
        setAlbums(newAlbums);
    };

    const handleDeleteImage = async (imageId: string) => {
        if (confirm("Delete this image permanently?")) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTIONS.GALLERY, imageId);
                await fetchGalleryImages();
                toast.success("Image deleted successfully");
            } catch (error) {
                console.error("Error deleting image:", error);
                toast.error("Failed to delete image");
            }
        }
    };

    // Batch Operations
    const toggleImageSelection = (imageId: string) => {
        const newSelection = new Set(selectedImages);
        if (newSelection.has(imageId)) {
            newSelection.delete(imageId);
        } else {
            newSelection.add(imageId);
        }
        setSelectedImages(newSelection);
    };

    const selectAll = () => {
        setSelectedImages(new Set(displayedImages.map(img => img.$id)));
    };

    const deselectAll = () => {
        setSelectedImages(new Set());
    };

    const handleBatchDelete = async () => {
        if (selectedImages.size === 0) return;

        if (confirm(`Delete ${selectedImages.size} selected images?`)) {
            setLoading(true);
            try {
                for (const imageId of selectedImages) {
                    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.GALLERY, imageId);
                }
                toast.success(`${selectedImages.size} images deleted`);
                setSelectedImages(new Set());
                setIsSelectionMode(false);
                await fetchGalleryImages();
            } catch (error) {
                console.error("Error deleting images:", error);
                toast.error("Failed to delete some images");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBatchMoveToAlbum = async (targetAlbumId: string) => {
        if (selectedImages.size === 0) return;

        setLoading(true);
        try {
            for (const imageId of selectedImages) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.GALLERY,
                    imageId,
                    { albumId: targetAlbumId }
                );
            }
            toast.success(`${selectedImages.size} images moved to album`);
            setSelectedImages(new Set());
            setIsSelectionMode(false);
            await fetchGalleryImages();
        } catch (error) {
            console.error("Error moving images:", error);
            toast.error("Failed to move some images");
        } finally {
            setLoading(false);
        }
    };

    // Caption Editor
    const openCaptionEditor = (image: any) => {
        setEditingImage(image);
        setCaptionEditorOpen(true);
    };

    const handleSaveCaption = async (imageId: string, caption: string, altText?: string) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.GALLERY,
                imageId,
                { caption, altText }
            );
            toast.success("Image details updated");
            await fetchGalleryImages();
        } catch (error) {
            console.error("Error updating caption:", error);
            toast.error("Failed to update image details");
        }
    };

    // Set Album Cover
    const handleSetAlbumCover = async (albumId: string, imageUrl: string) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.ALBUMS,
                albumId,
                { coverImageUrl: imageUrl }
            );
            toast.success("Album cover set successfully");
            await fetchAlbums();
        } catch (error) {
            console.error("Error setting album cover:", error);
            toast.error("Failed to set album cover");
        }
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const displayedImages = selectedAlbum
        ? galleryImages.filter(img => img.albumId === selectedAlbum)
        : galleryImages;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                        Gallery Management
                    </h1>
                    <p className="text-gray-400 mt-1">Upload and organize event photos</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select
                        label="Filter by Album"
                        selectedKeys={selectedAlbum ? [selectedAlbum] : []}
                        onChange={(e) => setSelectedAlbum(e.target.value)}
                        className="w-64"
                        size="sm"
                    >
                        {[{ $id: "", name: "All Images", imageCount: null }, ...albums].map((album) => (
                            <SelectItem key={album.$id} value={album.$id}>
                                {album.imageCount !== null ? `${album.name} (${album.imageCount || 0})` : album.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Tabs */}
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                color="primary"
                variant="underlined"
                className="mb-6"
            >
                {/* Upload Tab */}
                <Tab key="upload" title={`Upload (${galleryImages.length} total)`}>
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-6">
                                <h4 className="text-sm font-semibold mb-3">Upload Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Select Album"
                                        selectedKeys={selectedAlbum ? [selectedAlbum] : []}
                                        onChange={(e) => setSelectedAlbum(e.target.value)}
                                        placeholder="Choose an album (optional)"
                                    >
                                        {albums.map((album) => (
                                            <SelectItem key={album.$id} value={album.$id}>
                                                {album.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Event Type"
                                        selectedKeys={[selectedEventType]}
                                        onChange={(e) => setSelectedEventType(e.target.value as any)}
                                    >
                                        {EVENT_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ')}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {selectedAlbum && (
                                    <p className="text-xs text-blue-400 mt-2">
                                        Images will be added to: {albums.find(a => a.$id === selectedAlbum)?.name}
                                    </p>
                                )}
                            </CardBody>
                        </Card>

                        <BulkGalleryUpload
                            albumId={selectedAlbum}
                            eventType={selectedEventType}
                            onUploadComplete={handleBulkUploadComplete}
                            onError={(error) => toast.error(error)}
                        />
                    </div>
                </Tab>

                {/* Albums Tab */}
                <Tab key="albums" title={`Albums (${albums.length})`}>
                    <AlbumManager
                        albums={albums}
                        onAlbumsChange={handleAlbumsChange}
                        eventTypes={[...EVENT_TYPES]}
                        onSetCover={handleSetAlbumCover}
                    />
                </Tab>

                {/* Gallery Tab */}
                <Tab key="gallery" title={`Gallery (${displayedImages.length})`}>
                    {/* Batch Actions Bar */}
                    {displayedImages.length > 0 && (
                        <Card className="bg-zinc-900/50 border border-white/10 mb-4">
                            <CardBody className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            isSelected={isSelectionMode}
                                            onValueChange={setIsSelectionMode}
                                        >
                                            Selection Mode
                                        </Checkbox>
                                        {isSelectionMode && (
                                            <>
                                                <Button size="sm" variant="flat" onClick={selectAll}>
                                                    Select All
                                                </Button>
                                                <Button size="sm" variant="flat" onClick={deselectAll}>
                                                    Deselect All
                                                </Button>
                                                {selectedImages.size > 0 && (
                                                    <Chip color="primary">{selectedImages.size} selected</Chip>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {selectedImages.size > 0 && (
                                        <div className="flex gap-2">
                                            <Select
                                                placeholder="Move to album..."
                                                size="sm"
                                                className="w-48"
                                                onChange={(e) => handleBatchMoveToAlbum(e.target.value)}
                                            >
                                                {albums.map((album) => (
                                                    <SelectItem key={album.$id} value={album.$id}>
                                                        {album.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Button
                                                size="sm"
                                                color="danger"
                                                variant="flat"
                                                startContent={<Trash2 size={16} />}
                                                onClick={handleBatchDelete}
                                            >
                                                Delete Selected
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {displayedImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {displayedImages.map((image, index) => (
                                <Card key={image.$id} className="bg-zinc-900/50 border border-white/10 group relative">
                                    <CardBody className="p-0">
                                        {/* Selection Checkbox */}
                                        {isSelectionMode && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <Checkbox
                                                    isSelected={selectedImages.has(image.$id)}
                                                    onValueChange={() => toggleImageSelection(image.$id)}
                                                    className="bg-black/50 rounded"
                                                />
                                            </div>
                                        )}

                                        <div className="relative aspect-square">
                                            <img
                                                src={image.imageUrl}
                                                alt={image.caption || "Gallery image"}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => !isSelectionMode && openLightbox(index)}
                                            />

                                            {/* Overlay on Hover */}
                                            {!isSelectionMode && (
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        variant="flat"
                                                        isIconOnly
                                                        onClick={() => openLightbox(index)}
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        color="secondary"
                                                        variant="flat"
                                                        isIconOnly
                                                        onClick={() => openCaptionEditor(image)}
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    {selectedAlbum && (
                                                        <Button
                                                            size="sm"
                                                            color="warning"
                                                            variant="flat"
                                                            isIconOnly
                                                            onClick={() => handleSetAlbumCover(selectedAlbum, image.imageUrl)}
                                                        >
                                                            <Star size={16} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        variant="flat"
                                                        isIconOnly
                                                        onClick={() => handleDeleteImage(image.$id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {image.caption && (
                                            <div className="p-2">
                                                <p className="text-xs text-gray-400 truncate">{image.caption}</p>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-zinc-900/50 border border-white/10">
                            <CardBody className="p-12 text-center">
                                <ImageIcon size={64} className="mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold mb-2">No images yet</h3>
                                <p className="text-gray-400 mb-4">Upload some images to get started</p>
                                <Button
                                    color="primary"
                                    startContent={<Plus size={16} />}
                                    onClick={() => setActiveTab("upload")}
                                >
                                    Upload Images
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </Tab>
            </Tabs>

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={displayedImages.map(img => ({
                    src: img.imageUrl,
                    alt: img.caption || "",
                }))}
            />

            {/* Caption Editor */}
            <ImageCaptionEditor
                isOpen={captionEditorOpen}
                onClose={() => setCaptionEditorOpen(false)}
                image={editingImage}
                onSave={handleSaveCaption}
            />
        </div>
    );
}
