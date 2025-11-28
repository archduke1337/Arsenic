"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const images = [
        { src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80", category: "Committees", size: "large", alt: "MUN Committee session in progress" },
        { src: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80", category: "Delegates", size: "medium", alt: "Delegates discussing during conference" },
        { src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80", category: "Awards", size: "small", alt: "Awards ceremony at summit" },
        { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", category: "Socials", size: "medium", alt: "Social event networking" },
        { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80", category: "Closing", size: "large", alt: "Closing ceremony celebration" },
        { src: "https://images.unsplash.com/photo-1475721027767-4d529c145769?auto=format&fit=crop&q=80", category: "Speakers", size: "small", alt: "Guest speaker addressing audience" },
    ];

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
        setIsOpen(true);
    };

    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-4">
                            Capturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Moments</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Relive the intensity, diplomacy, and camaraderie of past summits.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group overflow-hidden rounded-xl cursor-pointer border border-white/10 ${img.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                                img.size === 'medium' ? 'md:row-span-2' : ''
                                }`}
                            onClick={() => handleImageClick(img.src)}
                        >
                            {img.src && (
                                <Image
                                    alt={img.alt}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    src={img.src}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <ZoomIn className="w-8 h-8 mx-auto mb-2 text-white" />
                                    <p className="text-white font-bold text-lg">{img.category}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                backdrop="blur"
                classNames={{
                    base: "bg-transparent shadow-none",
                    closeButton: "hover:bg-white/10 active:bg-white/20 text-white top-4 right-4"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <ModalBody className="p-0 overflow-hidden flex items-center justify-center h-[80vh]">
                            {selectedImage && (
                                <Image
                                    src={selectedImage}
                                    alt="Gallery Preview"
                                    className="max-h-full max-w-full object-contain"
                                    fill
                                    sizes="90vw"
                                />
                            )}
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
