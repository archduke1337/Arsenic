"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gavel, Users, Trophy, Flag, Mic2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function LokSabhaPage() {
    const stats = [
        { label: "Seats", value: "543", icon: Users },
        { label: "Parties", value: "10+", icon: Flag },
        { label: "Sessions", value: "4", icon: Gavel },
        { label: "Prize", value: "₹20k", icon: Trophy },
    ];

    const flows = [
        { name: "Question Hour", desc: "Hold the government accountable", icon: AlertCircle },
        { name: "Zero Hour", desc: "Raise urgent public matters", icon: Mic2 },
        { name: "Legislation", desc: "Debate and pass crucial bills", icon: Gavel },
    ];

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-orange-200 dark:selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1596520774490-5e4f9a4e4e75?q=80&w=2000" // Use a relevant parliament image
                        alt="Lok Sabha"
                        fill
                        className="object-cover opacity-20 dark:opacity-30 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-50/0 via-orange-50/50 to-orange-50 dark:from-black/0 dark:via-black/50 dark:to-[#020202]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                            <span className="text-xl">🏛️</span>
                            <span>House of the People</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-8">
                            LOK <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-400">
                                SABHA
                            </span>
                        </h1>
                        <p className="text-xl text-slate-700 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Experience the heat of Indian democracy. Represents the voice of the people,
                            debating policies that shape the nation's destiny.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="relative z-20 -mt-20 px-6 pb-20">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-orange-100 dark:border-white/10 p-8 rounded-3xl text-center group hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-none"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-4 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
                            <div className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{stat.value}</div>
                            <div className="text-sm font-medium text-slate-500 dark:text-white/40 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                            Democracy <br />
                            <span className="text-orange-600 dark:text-orange-500">Unfiltered</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                            The Lok Sabha simulation demands quick thinking, political acumen, and powerful oratory.
                            Navigate through legislative procedures, form alliances, and stand your ground against the opposition.
                        </p>

                        <div className="grid gap-4">
                            {flows.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-orange-50 dark:border-white/5 hover:border-orange-500/30 transition-colors">
                                    <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-gray-500">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1200"
                            alt="Parliament Session"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 dark:from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="text-white text-lg font-medium">Satyameva Jayate</div>
                            <div className="text-white/60 text-sm">Truth alone triumphs</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-orange-600 dark:bg-orange-900/20 border border-orange-500/30 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/50 to-red-500/50 dark:from-orange-500/10 dark:to-red-500/10 blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Join the Parliament</h2>
                        <p className="text-orange-100 mb-8 max-w-xl mx-auto">
                            Represent a constituency and make your voice heard in the nation's highest legislative body.
                        </p>
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            className="bg-white text-orange-900 font-bold px-8"
                        >
                            Apply for Candidacy <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

