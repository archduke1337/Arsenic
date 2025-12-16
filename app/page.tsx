"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, MapPin, Trophy, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const CountUp = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime: number;
                    const animate = (currentTime: number) => {
                        if (!startTime) startTime = currentTime;
                        const progress = (currentTime - startTime) / (duration * 1000);
                        if (progress < 1) {
                            setCount(Math.floor(end * progress));
                            requestAnimationFrame(animate);
                        } else {
                            setCount(end);
                        }
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return <span ref={ref}>{count}</span>;
};

export default function Home() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState("mun");
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;
            setMousePosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const eventTypes = [
        { id: "mun", label: "Model UN" },
        { id: "lok-sabha", label: "Lok Sabha" },
        { id: "rajya-sabha", label: "Rajya Sabha" },
        { id: "debate", label: "Debate" },
        { id: "youth-parliament", label: "Youth Parliament" },
    ];

    const statData = [
        { label: "Delegates", value: 300, suffix: "+", icon: Users },
        { label: "Committees", value: 12, suffix: "", icon: MapPin },
        { label: "Awards (₹)", value: 50000, suffix: "+", icon: Trophy },
        { label: "Days", value: 2, suffix: "", icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#020412] text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: -mousePosition.x * 2, y: -mousePosition.y * 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-500/10 dark:bg-violet-600/10 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="max-w-5xl mx-auto text-center space-y-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-100 dark:border-white/10 bg-blue-50/50 dark:bg-white/5 backdrop-blur-sm"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-300 tracking-wide uppercase">Registrations Open for 2024</span>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-slate-900 dark:text-white leading-[0.9]"
                        >
                            Where Diplomacy <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Meets Democracy
                            </span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join the region's largest student parliament simulation. <br className="hidden md:block" />
                        Debate, deliberate, and decide the future.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row justify-center gap-5 pt-8"
                    >
                        <Link href="/register" className="group relative px-8 py-4 bg-slate-900 dark:bg-white rounded-full font-semibold text-white dark:text-black transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20">
                            Register Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className="px-8 py-4 rounded-full font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 flex items-center justify-center">
                            Learn More
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </motion.div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                        {statData.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:shadow-none hover:border-blue-500/30 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <IconComponent size={32} className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform relative z-10" />
                                    <div className="text-4xl lg:text-5xl font-bold mb-2 text-slate-900 dark:text-white relative z-10">
                                        <CountUp end={stat.value} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider relative z-10">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white"
                        >
                            Why Join ARSENIC?
                        </motion.h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Experience unparalleled opportunities to develop, compete, and connect
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { emoji: "🎓", title: "World-Class Learning", desc: "Expert mentorship from seasoned diplomats and debaters" },
                            { emoji: "🌍", title: "Global Network", desc: "Connect with delegates from 50+ countries" },
                            { emoji: "🏆", title: "Recognition", desc: "Build your resume with achievements from India's premier summit" },
                            { emoji: "💡", title: "Innovation", desc: "Cutting-edge parliamentary simulation technology" },
                            { emoji: "🤝", title: "Community", desc: "Join an alumni network of 5000+ leaders" },
                            { emoji: "🎯", title: "Growth", desc: "Develop confidence, leadership, and public speaking skills" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="relative z-10 py-32 px-6 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
                            Our Programs
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Choose Your Arena</h2>
                        <div className="flex flex-wrap justify-center gap-2">
                            {eventTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveTab(type.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === type.id
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg"
                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                    Experience the Power of Dialogue
                                </h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Step into the shoes of a diplomat, parliamentarian, or journalist.
                                    Research, debate, and draft resolutions that could change the world.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {["Professional Executive Board", "High-stakes crisis committees", "International delegate participation", "Networking opportunities"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                                View Committee Details
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>

                        <motion.div
                            key={`${activeTab}-img`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=1200"
                                alt="Event"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="text-2xl font-bold">{eventTypes.find(e => e.id === activeTab)?.label}</div>
                                <div className="text-white/80">Edition 2024</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}