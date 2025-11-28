"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X, Camera, Award, Users, Mic, PartyPopper, Sparkles } from "lucide-react";

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<string>("all");

    const images = [
        { src: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80", category: "Committees", size: "large", alt: "MUN Committee session in progress" },
        { src: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80", category: "Delegates", size: "medium", alt: "Delegates discussing during conference" },
        { src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80", category: "Awards", size: "small", alt: "Awards ceremony at summit" },
        { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80", category: "Socials", size: "medium", alt: "Social event networking" },
        { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80", category: "Closing", size: "large", alt: "Closing ceremony celebration" },
        { src: "https://images.unsplash.com/photo-1475721027767-4d529c145769?auto=format&fit=crop&q=80", category: "Speakers", size: "small", alt: "Guest speaker addressing audience" },
        { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80", category: "Committees", size: "medium", alt: "Committee deliberations" },
        { src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80", category: "Delegates", size: "small", alt: "Delegate networking break" },
        { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80", category: "Awards", size: "large", alt: "Award winners celebration" },
    ];

    const categories = [
        { name: "All", value: "all", icon: <Camera size={18} /> },
        { name: "Committees", value: "Committees", icon: <Users size={18} /> },
        { name: "Delegates", value: "Delegates", icon: <Sparkles size={18} /> },
        { name: "Awards", value: "Awards", icon: <Award size={18} /> },
        { name: "Speakers", value: "Speakers", icon: <Mic size={18} /> },
        { name: "Socials", value: "Socials", icon: <PartyPopper size={18} /> },
    ];

    const filteredImages = filter === "all" 
        ? images 
        : images.filter(img => img.category === filter);

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
        setIsOpen(true);
    };

    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grain Overlay */}
            <div className="bg-noise" />

            {/* Hero Section */}
            <div className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,65,160,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,65,160,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-imperial backdrop-blur-xl border border-blue-500/30"
                        >
                            <Camera size={16} className="text-blue-400" />
                            <span className="text-sm font-semibold text-blue-300">Summit Memories</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                            Moments of
                            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-gradient-x">
                                Excellence
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Relive the intensity, diplomacy, and camaraderie of ARSENIC Summit through our curated collection of memorable moments.
                        </p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center justify-center gap-8 pt-8"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">500+</div>
                                <div className="text-sm text-gray-500">Photos</div>
                            </div>
                            <div className="w-px h-12 bg-gray-800" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">50+</div>
                                <div className="text-sm text-gray-500">Events</div>
                            </div>
                            <div className="w-px h-12 bg-gray-800" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">1000+</div>
                                <div className="text-sm text-gray-500">Delegates</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    {categories.map((cat, index) => (
                        <motion.button
                            key={cat.value}
                            onClick={() => setFilter(cat.value)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            className={`group relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                                filter === cat.value
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                                    : 'glass-dark hover:glass-blue text-gray-400 hover:text-white border border-white/5 hover:border-blue-500/30'
                            }`}
                        >
                            {cat.icon}
                            <span>{cat.name}</span>
                            {filter === cat.value && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            {/* Gallery Grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
                    >
                        {filteredImages.map((img, index) => (
                            <motion.div
                                key={`${filter}-${index}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                                    img.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                                    img.size === 'medium' ? 'md:row-span-2' : ''
                                }`}
                                onClick={() => handleImageClick(img.src)}
                            >
                                {/* Image Container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 to-black/50 z-0" />
                                
                                {img.src && (
                                    <Image
                                        alt={img.alt}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                        src={img.src}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                )}

                                {/* Border Glow Effect */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-all duration-300" />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-900/0 group-hover:from-blue-600/30 group-hover:to-blue-900/50 transition-all duration-500 flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileHover={{ scale: 1, opacity: 1 }}
                                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 mx-auto">
                                            <ZoomIn className="w-8 h-8 text-white" />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white text-sm font-semibold">
                                        {img.category}
                                    </div>
                                </div>

                                {/* Bottom Gradient Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                    <div className="space-y-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <h3 className="text-white font-bold text-lg">{img.alt}</h3>
                                        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32"
                    >
                        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-500">No images found in this category</p>
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                backdrop="blur"
                classNames={{
                    base: "bg-black/95 backdrop-blur-2xl border border-blue-500/20",
                    backdrop: "bg-black/80 backdrop-blur-md",
                    closeButton: "hover:bg-white/10 active:bg-white/20 text-white top-4 right-4 z-50"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <ModalBody className="p-0 overflow-hidden flex items-center justify-center min-h-[80vh] relative">
                            {selectedImage && (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 to-black/50 z-0" />
                                    <Image
                                        src={selectedImage}
                                        alt="Gallery Preview"
                                        className="max-h-full max-w-full object-contain relative z-10"
                                        fill
                                        sizes="90vw"
                                    />
                                    <div className="absolute inset-0 pointer-events-none shadow-inner shadow-blue-900/50 z-20" />
                                </>
                            )}
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}