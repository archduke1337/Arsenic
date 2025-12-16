"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Trophy, Users, Globe, Sparkles, Target, Heart, Shield, Lightbulb } from "lucide-react";

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const stats = [
        { label: "Delegates", value: "1000+", icon: Users },
        { label: "Committees", value: "50+", icon: Trophy },
        { label: "Awards", value: "100+", icon: Target },
        { label: "Countries", value: "15+", icon: Globe },
    ];

    const values = [
        {
            title: "Diplomacy",
            desc: "Fostering peaceful conflict resolution through dialogue and negotiation.",
            icon: Shield,
            color: "blue"
        },
        {
            title: "Innovation",
            desc: "Pioneering new solutions to age-old international challenges.",
            icon: Lightbulb,
            color: "amber"
        },
        {
            title: "Unity",
            desc: "Building bridges across cultures and boarders for a common future.",
            icon: Heart,
            color: "rose"
        }
    ];

    const team = [
        {
            name: "Aarav Sharma",
            role: "Secretary General",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop"
        },
        {
            name: "Sarah Chen",
            role: "Director General",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop"
        },
        {
            name: "James Wilson",
            role: "Charge d'Affaires",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white overflow-hidden selection:bg-blue-100 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-white">

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/80 backdrop-blur-[2px] z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000"
                        alt="Conference Hall"
                        fill
                        className="object-cover opacity-20 dark:opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-slate-50 dark:from-black/0 dark:via-black/50 dark:to-[#020202] z-10" />
                </div>

                <motion.div
                    style={{ opacity, scale }}
                    className="relative z-20 text-center max-w-5xl mx-auto px-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
                        <Sparkles size={14} />
                        <span>Established 2024</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
                        About
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400 pb-4">
                            ARSENIC Summit
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        A premier platform empowering the next generation of leaders through
                        immersive parliamentary simulations and competitive discourse.
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-slate-400 dark:text-white/30"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-slate-400 dark:via-white/30 to-transparent" />
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 -mt-20 px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-sm hover:bg-white dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500"
                            >
                                <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-500" />
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-white/40 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                                Our Purpose
                            </div>
                            <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-tight text-slate-900 dark:text-white">
                                Fostering Global <br />
                                <span className="text-slate-400 dark:text-white/30">Citizenship</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-white/60 mb-8 leading-relaxed">
                                At ARSENIC Summit, we believe in the power of youth to shape the future.
                                Our simulations replicate real-world diplomatic challenges, pushing delegates
                                to think critically, negotiate effectively, and lead with empathy.
                            </p>

                            <div className="space-y-6">
                                {values.map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
                                    >
                                        <div className={`p-3 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                            <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[600px] rounded-[3rem] overflow-hidden"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1577962917302-cd874c4e3169?q=80&w=1200"
                                alt="Conference Discussion"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-black/90 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-12">
                                <div className="text-5xl font-bold text-white mb-2">2024</div>
                                <div className="text-white/60 text-lg">Theme: "Diplomacy in Digital Age"</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Programs Preview Section */}
            <section className="py-32 px-6 bg-slate-100 dark:bg-[#050505] rounded-[3rem] mx-4 md:mx-8 mb-8">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-blue-600 dark:text-white/80 text-xs font-bold uppercase tracking-widest mb-6">
                        What We Stand For
                    </div>
                    <h2 className="text-4xl md:text-6xl font-medium mb-6 text-slate-900 dark:text-white">Our Programs</h2>
                    <p className="text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
                        From beginner-friendly committees to crisis simulations for seasoned delegates.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {['Model UN', 'Youth Parliament', 'Debate'].map((item, i) => (
                        <div key={item} className="group relative h-[400px] rounded-3xl overflow-hidden bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                            <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                                <ArrowRight className="text-slate-900 dark:text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" size={32} />
                            </div>
                            <div className="h-full flex flex-col justify-end p-8">
                                <h3 className="text-3xl font-medium text-slate-900 dark:text-white mb-4">{item}</h3>
                                <p className="text-slate-500 dark:text-white/50 line-clamp-3">
                                    Engage in intense deliberations, draft resolutions, and shape global policy in our flagship {item} simulations.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-7xl font-medium mb-8 text-slate-900 dark:text-white">
                        Ready to Make an <br />
                        <span className="text-blue-600 dark:text-blue-500">Impact?</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-white/50 mb-12 max-w-2xl mx-auto">
                        Join over 1000+ delegates from across the nation in the wildest diplomatic simulation of the year.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="px-10 py-5 rounded-full bg-blue-900 dark:bg-white text-white dark:text-black font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            Register Now
                        </button>
                        <button className="px-10 py-5 rounded-full bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium text-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300">
                            Meet the Team
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}