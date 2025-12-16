"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Instagram, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

const teamMembers = [
    {
        id: 1,
        name: "Yomi Denzel",
        role: "E-Commerce 2.0",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 2,
        name: "Timothée Moiroux",
        role: "Investissement Immobilier",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 3,
        name: "David Sequiera",
        role: "Closing",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 4,
        name: "Manuel Ravier",
        role: "Investissement Immobilier",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 5,
        name: "Sarah Chen",
        role: "Product Strategy",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 6,
        name: "Marcus Johnson",
        role: "Tech Lead",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 7,
        name: "Elena Rodriguez",
        role: "Creative Director",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    },
    {
        id: 8,
        name: "James Wilson",
        role: "Operations",
        image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1887&auto=format&fit=crop",
        socials: { twitter: "#", linkedin: "#" }
    }
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-[#020202] text-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#003366]/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-4"
                    >
                        Partnered with most of the <br className="hidden md:block" />
                        <span className="italic font-serif text-white/50">top people at each industry</span>
                    </motion.h1>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative h-[400px] rounded-[32px] overflow-hidden cursor-pointer"
                        >
                            {/* Image */}
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/90 via-[#001f3f]/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-blue-200 text-sm font-medium tracking-wide uppercase mb-4">{member.role}</p>

                                {/* Socials (Reveal on hover) */}
                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 translate-y-4 group-hover:translate-y-0">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors">
                                        <Twitter size={14} />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors">
                                        <Linkedin size={14} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Navigation (Visual only as per reference) */}
                <div className="flex justify-center items-center gap-12 mt-16 md:mt-24">
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-48 h-[2px] bg-white/10 overflow-hidden">
                        <div className="w-1/3 h-full bg-white" />
                    </div>
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
