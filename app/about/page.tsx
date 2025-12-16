"use client";

export const dynamic = 'force-dynamic';

import { Button } from "@nextui-org/react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Shield, Zap, Globe, Users, Gavel, Mic, Award, ArrowRight, Sparkles, Heart, Star, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    const values = [
        {
            icon: Target,
            title: "Excellence",
            description: "Striving for the highest standards in debate and diplomacy through rigorous training.",
            number: "01"
        },
        {
            icon: Shield,
            title: "Integrity",
            description: "Upholding ethical principles and fostering honest dialogue in every committee.",
            number: "02"
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Embracing new ideas and modernizing parliamentary simulations for the digital age.",
            number: "03"
        }
    ];

    const offerings = [
        { 
            title: "Model UN", 
            icon: Globe, 
            desc: "Simulating UN committees to solve global crises through diplomatic negotiations.",
            color: "from-blue-500 to-blue-700"
        },
        { 
            title: "Lok Sabha", 
            icon: Users, 
            desc: "Drafting bills and debating national policy in India's lower house simulation.",
            color: "from-blue-600 to-blue-800"
        },
        { 
            title: "Rajya Sabha", 
            icon: Gavel, 
            desc: "Reviewing legislation with elder statesmanship in upper house proceedings.",
            color: "from-blue-700 to-indigo-800"
        },
        { 
            title: "Debate", 
            icon: Mic, 
            desc: "Clashing ideologies in a competitive battle of wits and rhetoric.",
            color: "from-cyan-600 to-blue-700"
        },
    ];

    const stats = [
        { number: "1000+", label: "Delegates", icon: Users },
        { number: "50+", label: "Committees", icon: Gavel },
        { number: "100+", label: "Awards", icon: Award },
        { number: "15+", label: "Countries", icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white" ref={containerRef}>
            {/* Subtle Grain Texture */}
            <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none z-50" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <motion.div
                    style={{ y }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/70 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1596720426673-e4e15688cafb?auto=format&fit=crop&q=80"
                        alt="Parliament"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 text-center max-w-6xl mx-auto px-6 py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600/10 border border-blue-500/30 backdrop-blur-sm"
                        >
                            <Star size={14} className="text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">Established 2024</span>
                        </motion.div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                                About
                            </h1>
                            <div className="text-6xl md:text-8xl font-bold text-blue-500">
                                ARSENIC Summit
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            A premier platform empowering the next generation of leaders through
                            immersive parliamentary simulations and competitive discourse.
                        </p>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1 }}
                                    className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors"
                                >
                                    <stat.icon size={24} className="text-blue-500 mb-3 mx-auto" />
                                    <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30">
                                    <Heart size={14} className="text-blue-400" />
                                    <span className="text-sm font-medium text-blue-300">Our Purpose</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-bold">
                                    Our Mission
                                </h2>
                            </div>

                            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                                <p>
                                    To provide a world-class platform for students to develop diplomatic skills,
                                    critical thinking, and public speaking. We believe in the power of youth
                                    to shape the future through constructive dialogue and informed debate.
                                </p>
                                <p>
                                    At ARSENIC Summit, we go beyond traditional simulations. We create an
                                    environment where every voice matters, and every delegate has the
                                    opportunity to make a lasting impact on global discourse.
                                </p>
                            </div>

                            <div className="pt-4">
                                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full" />
                            </div>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="relative group"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-10" />
                                <Image
                                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                                    alt="Mission"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30"
                        >
                            <Lightbulb size={14} className="text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">What We Stand For</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold"
                        >
                            Core Values
                        </motion.h2>
                    </div>

                    {/* Values Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((val, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.15 }}
                                className="group relative"
                            >
                                <div className="border border-white/10 rounded-3xl p-8 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300 h-full">
                                    {/* Number */}
                                    <div className="text-7xl font-bold text-white/5 mb-6">
                                        {val.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                                        <val.icon size={32} className="text-blue-500" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{val.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Offerings Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30"
                        >
                            <Sparkles size={14} className="text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">Our Programs</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold"
                        >
                            What We Offer
                        </motion.h2>
                    </div>

                    {/* Offerings Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {offerings.map((offer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02] backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 h-full">
                                    {/* Icon */}
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${offer.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                                        <offer.icon size={36} className="text-blue-500" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-3xl font-bold mb-4">{offer.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed">{offer.desc}</p>

                                    {/* Arrow Icon */}
                                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={24} className="text-blue-500" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    {/* Impact Section */}
                    <div className="mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16 space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30">
                                <Award size={14} className="text-blue-400" />
                                <span className="text-sm font-medium text-blue-300">Our Impact</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold">
                                Recognition & Achievement
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-blue-600/10 to-transparent hover:border-blue-500/30 transition-all"
                            >
                                <div className="text-4xl font-bold text-blue-400 mb-3">2020</div>
                                <h3 className="text-xl font-bold mb-3">Founded with Vision</h3>
                                <p className="text-gray-400">
                                    Started as a small initiative with a big dream to revolutionize parliamentary simulations in India.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-blue-600/10 to-transparent hover:border-blue-500/30 transition-all"
                            >
                                <div className="text-4xl font-bold text-blue-400 mb-3">5000+</div>
                                <h3 className="text-xl font-bold mb-3">Lives Impacted</h3>
                                <p className="text-gray-400">
                                    Trained and mentored thousands of young leaders across multiple countries and continents.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-blue-600/10 to-transparent hover:border-blue-500/30 transition-all"
                            >
                                <div className="text-4xl font-bold text-blue-400 mb-3">100%</div>
                                <h3 className="text-xl font-bold mb-3">Participant Satisfaction</h3>
                                <p className="text-gray-400">
                                    Consistently rated as the most immersive and rewarding parliamentary experience.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="max-w-4xl mx-auto text-center space-y-8 border-t border-white/10 pt-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                Ready to Make History?
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed mb-12">
                                Join hundreds of delegates from across the nation in this celebration
                                of democracy, diplomacy, and meaningful discourse.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button
                                    as={Link}
                                    href="/register"
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-14 text-base"
                                    endContent={<ArrowRight size={20} />}
                                >
                                    Register Now
                                </Button>
                                <Button
                                    as={Link}
                                    href="/team"
                                    size="lg"
                                    variant="bordered"
                                    className="border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5 text-white font-semibold px-8 h-14 text-base"
                                >
                                    Meet the Team
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}