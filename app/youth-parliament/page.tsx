"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Lightbulb, Trophy, Target, Sparkles, Megaphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function YouthParliamentPage() {
    const stats = [
        { label: "Delegates", value: "100+", icon: Users },
        { label: "Agendas", value: "3", icon: Target },
        { label: "Duration", value: "1 Day", icon: Sparkles },
        { label: "Prize", value: "₹10k", icon: Trophy },
    ];

    const highlights = [
        { name: "National Issues", desc: "Debate pressing country-wide topics", icon: Megaphone },
        { name: "Policy Drafting", desc: "Create youth-centric solutions", icon: Lightbulb },
        { name: "Leadership", desc: "Develop public speaking skills", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-yellow-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-yellow-200 dark:selection:bg-yellow-500/30 selection:text-yellow-900 dark:selection:text-white overflow-hidden">

            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=2000" // Youth/Group
                        alt="Youth Parliament"
                        fill
                        className="object-cover opacity-20 dark:opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/0 via-yellow-50/50 to-yellow-50 dark:from-black/0 dark:via-black/50 dark:to-[#020202]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                            <span className="text-xl">🇮🇳</span>
                            <span>Future Leaders</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-8">
                            YOUTH <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400">
                                PARLIAMENT
                            </span>
                        </h1>
                        <p className="text-xl text-slate-700 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            A platform for the changemakers of tomorrow. Discuss national issues,
                            propose innovative solutions, and learn the art of governance.
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
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-lg border border-yellow-100 dark:border-white/10 p-8 rounded-3xl text-center group hover:border-yellow-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-none"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-4 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
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
                            Voice of <br />
                            <span className="text-yellow-600 dark:text-yellow-500">Tomorrow</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                            The Youth Parliament is designed to ignite a passion for public service.
                            It's where you articulate your vision for the country, challenge the status quo,
                            and understand the complexities of policy-making in a democracy.
                        </p>

                        <div className="grid gap-4">
                            {highlights.map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-yellow-50 dark:border-white/5 hover:border-yellow-500/30 transition-colors">
                                    <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
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
                            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200"
                            alt="Discussion"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-950/80 dark:from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="text-white text-lg font-medium">Be the Change</div>
                            <div className="text-white/60 text-sm">Start your journey today</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-yellow-600 dark:bg-yellow-900/20 border border-yellow-500/30 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/50 to-amber-500/50 dark:from-yellow-500/10 dark:to-amber-500/10 blur-3xl opacity-50" />

                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-6">Join the Movement</h2>
                        <p className="text-yellow-100 mb-8 max-w-xl mx-auto">
                            Don't just watch history happen—help write it. Register for the Youth Parliament now.
                        </p>
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            className="bg-white text-yellow-900 font-bold px-8"
                        >
                            Register Now <ArrowRight size={18} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

