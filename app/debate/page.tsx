"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mic, Users, Trophy, Brain, Zap, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function DebatePage() {
    const stats = [
        { label: "Teams", value: "50+", icon: Users },
        { label: "Rounds", value: "5", icon: Zap },
        { label: "Topics", value: "10+", icon: Brain },
        { label: "Prize", value: "₹15k", icon: Trophy },
    ];

    const formats = [
        { name: "Asian Parliamentary", desc: "3v3 Format on Policy", icon: Users },
        { name: "British Parliamentary", desc: "2v2 Strategic Debate", icon: Mic },
        { name: "Turncoat", desc: "Switch sides mid-speech", icon: Zap },
    ];

    return (
        <div className="min-h-screen bg-fuchsia-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-fuchsia-200 dark:selection:bg-fuchsia-500/30 selection:text-fuchsia-900 dark:selection:text-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1475721027767-4d529c145769?q=80&w=2000" // Podium/Microphone
                        alt="Debate"
                        fill
                        className="object-cover opacity-20 dark:opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-50/0 via-fuchsia-50/50 to-fuchsia-50 dark:from-black/0 dark:via-black/50 dark:to-[#020202]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/10 border border-fuchsia-200 dark:border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                            <span className="text-xl">🎙️</span>
                            <span>Championship</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-8">
                            THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400">
                                DEBATE
                            </span>
                        </h1>
                        <p className="text-xl text-slate-700 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            A battle of wits, logic, and rhetoric. Stand your ground, dismantle opposing arguments,
                            and convince the house with your eloquence.
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
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-fuchsia-100 dark:border-white/10 p-8 rounded-3xl text-center group hover:border-fuchsia-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-none"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-4 text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform" />
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
                            Power of <br />
                            <span className="text-fuchsia-600 dark:text-fuchsia-500">Persuasion</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                            From classic Asian Parliamentary to high-stakes British Parliamentary styles,
                            our debate championship covers it all. Prepare to think on your feet, structure
                            compelling arguments, and rebut with precision.
                        </p>

                        <div className="grid gap-4">
                            {formats.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-fuchsia-50 dark:border-white/5 hover:border-fuchsia-500/30 transition-colors">
                                    <div className="p-3 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400">
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
                            src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1200"
                            alt="Debate Stage"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950/80 dark:from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="text-white text-lg font-medium">The Floor is Yours</div>
                            <div className="text-white/60 text-sm">Make every word count</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-fuchsia-600 dark:bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/50 to-pink-500/50 dark:from-fuchsia-500/10 dark:to-pink-500/10 blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Take the Mic</h2>
                        <p className="text-fuchsia-100 mb-8 max-w-xl mx-auto">
                            The stage is set, the motion is tabled. Are you ready to speak up?
                        </p>
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            className="bg-white text-fuchsia-900 font-bold px-8"
                        >
                            Register Team <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

