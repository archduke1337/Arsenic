"use client";

import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
} from "@heroui/react";
import { Save } from "lucide-react";

interface ImageCaptionEditorProps {
    isOpen: boolean;
    onClose: () => void;
    image: any;
    onSave: (imageId: string, caption: string, altText?: string) => void;
}

export default function ImageCaptionEditor({
    isOpen,
    onClose,
    image,
    onSave,
}: ImageCaptionEditorProps) {
    const [caption, setCaption] = useState(image?.caption || "");
    const [altText, setAltText] = useState(image?.altText || "");

    const handleSave = () => {
        if (image) {
            onSave(image.$id, caption, altText);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            classNames={{
                base: "bg-zinc-950 border border-white/10",
                header: "border-b border-white/10",
                footer: "border-t border-white/10",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h3 className="text-xl font-bold">Edit Image Details</h3>
                        </ModalHeader>
                        <ModalBody>
                            {image && (
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                                        <img
                                            src={image.imageUrl}
                                            alt={caption || "Preview"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Caption Input */}
                                    <Input
                                        label="Caption"
                                        placeholder="Enter a caption for this image"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        description="This will be displayed below the image"
                                    />

                                    {/* Alt Text */}
                                    <Textarea
                                        label="Alt Text (Accessibility)"
                                        placeholder="Describe the image for screen readers"
                                        value={altText}
                                        onChange={(e) => setAltText(e.target.value)}
                                        minRows={2}
                                        description="Helps with SEO and accessibility"
                                    />

                                    {/* Image Info */}
                                    <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400">
                                        <p><span className="font-semibold">Event:</span> {image.eventType}</p>
                                        {image.albumId && (
                                            <p className="mt-1"><span className="font-semibold">Album ID:</span> {image.albumId}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSave}
                                startContent={<Save size={16} />}
                            >
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
