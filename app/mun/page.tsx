"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Trophy, Target, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function MUNPage() {
    const stats = [
        { label: "Committees", value: "6", icon: Users },
        { label: "Delegates", value: "300+", icon: Globe },
        { label: "Countries", value: "193", icon: Target },
        { label: "Prize Pool", value: "₹25k", icon: Trophy },
    ];

    const committees = [
        { name: "UNSC", desc: "United Nations Security Council", icon: Shield },
        { name: "UNHRC", desc: "Human Rights Council", icon: Users },
        { name: "DISEC", desc: "Disarmament & Int. Security", icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1455384479500-d621b19be55d?q=80&w=2000"
                        alt="UN Assembly"
                        fill
                        className="object-cover opacity-20 dark:opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 via-slate-50/50 to-slate-50 dark:from-black/0 dark:via-black/50 dark:to-[#020202]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                            <Globe size={14} />
                            <span>International Assembly</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
                            Model United <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                                Nations
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Step into the shoes of global leaders. Navigate complex international crises,
                            draft resolutions, and shape the future of diplomacy.
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
                            className="bg-white dark:bg-white/5 backdrop-blur-lg border border-slate-200 dark:border-white/10 p-8 rounded-3xl text-center group hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-none"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
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
                            Diplomacy in <br />
                            <span className="text-blue-600 dark:text-blue-500">Action</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                            The Model United Nations at ARSENIC is more than just a simulation.
                            It's a crucible for leadership, where delegates wrestle with real-world
                            issues ranging from international security to human rights.
                        </p>

                        <div className="grid gap-4">
                            {committees.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
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
                            src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1200"
                            alt="MUN Session"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="text-white text-lg font-medium">Global Perspectives</div>
                            <div className="text-white/60 text-sm">Delegates in session</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-blue-600 dark:bg-blue-900/20 border border-blue-500/30 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-cyan-500/50 dark:from-blue-500/10 dark:to-cyan-500/10 blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Delegate?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                            Secure your portfolio in the most prestigious committees. Registration closes soon.
                        </p>
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            className="bg-white text-blue-900 font-bold px-8"
                        >
                            Register as Delegate <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

