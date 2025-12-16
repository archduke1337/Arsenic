"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Globe,
    Award,
    Mic2,
    Users,
    Zap,
    BookOpen,
    CheckCircle2,
    PlayCircle,
    MoveRight
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
const CountUp = ({ end, duration = 2.5 }: { end: number; duration?: number }) => {
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

// Luxury Hover Card Component
const FeatureCard = ({ item, index }: { item: any, index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className="group relative p-10 rounded-[2rem] bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 overflow-hidden hover:shadow-2xl dark:hover:bg-white/[0.06] transition-all duration-500"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 255, 255, 0.1),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                    <div className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white">
                        {item.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-400 dark:text-white/40 uppercase tracking-widest font-mono">0{index + 1}</span>
                </div>
                <h3 className="text-2xl font-medium text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-white/50 leading-relaxed font-light">{item.desc}</p>
            </div>
        </motion.div>
    );
};

export default function Home() {
    const { scrollY } = useScroll();
    const [activeTab, setActiveTab] = useState("mun");

    // Parallax & Fade effects
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    const scale = useTransform(scrollY, [0, 800], [1, 0.9]);
    const yText = useTransform(scrollY, [0, 500], [0, 100]);

    const eventTypes = [
        { id: "mun", label: "Model UN" },
        { id: "lok-sabha", label: "Lok Sabha" },
        { id: "rajya-sabha", label: "Rajya Sabha" },
        { id: "debate", label: "Debate" },
        { id: "youth-parliament", label: "Youth Parliament" },
    ];

    const stats = [
        { label: "Delegates", value: 300, suffix: "+" },
        { label: "Committees", value: 12, suffix: "" },
        { label: "Awards Fund", value: 50000, suffix: "₹" },
        { label: "Nations", value: 50, suffix: "+" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white selection:bg-rose-500/20 selection:text-rose-600 dark:selection:bg-white/20 dark:selection:text-white relative overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                <motion.div
                    style={{ opacity, scale, y: yText }}
                    className="max-w-7xl mx-auto text-center space-y-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center gap-4 text-xs font-medium tracking-[0.2em] uppercase text-slate-500 dark:text-white/40"
                    >
                        <span>[ DXB ] 12:30 AM</span>
                        <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/20" />
                        <span>Arsenic Summit '24</span>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[0.95] mix-blend-difference dark:mix-blend-normal text-slate-900 dark:text-white"
                        >
                            Where <span className="font-serif italic text-slate-600 dark:text-white/80">Diplomacy</span> <br />
                            Meets <span className="font-serif italic text-slate-600 dark:text-white/80">Democracy</span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg md:text-xl text-slate-600 dark:text-white/50 max-w-xl mx-auto font-light leading-relaxed"
                    >
                        Join the region's largest student parliament simulation.
                        Websites, apps, e-commerce, graphic identities crafted for a distinct digital presence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row justify-center gap-6 pt-10"
                    >
                        <Link href="/register" className="group relative h-14 px-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-medium flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-slate-800 dark:hover:bg-white/90 hover:scale-105">
                            <span className="relative z-10">Registrati</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/about" className="group relative h-14 px-8 rounded-full border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-medium flex items-center justify-center gap-3 overflow-hidden transition-all hover:border-slate-400 dark:hover:border-white/40 hover:bg-slate-50 dark:hover:bg-white/5">
                            <span className="relative z-10">Scopri di più</span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Bottom Ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 left-0 right-0 flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-medium tracking-widest uppercase text-slate-400 dark:text-white/30 px-6 text-center"
                >
                    <span>Trusted by 10+ Institutes</span>
                    <span>ISO Certified</span>
                    <span>Global recognition</span>
                </motion.div>
            </section>

            {/* Stats - Minimalist Row */}
            <section className="relative z-10 py-20 md:py-32 border-t border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="text-center md:text-left group cursor-default"
                            >
                                <div className="text-5xl md:text-6xl font-light text-slate-900 dark:text-white mb-2 group-hover:text-slate-700 dark:group-hover:text-white/80 transition-colors">
                                    <CountUp end={stat.value} />
                                    <span className="text-slate-400 dark:text-white/40 text-4xl ml-1">{stat.suffix}</span>
                                </div>
                                <div className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-white/40 group-hover:text-slate-700 dark:group-hover:text-white/60 transition-colors">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Join - Grid */}
            <section className="relative z-10 py-20 md:py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-4 text-slate-900 dark:text-white">
                                Why Choose <span className="font-serif italic text-slate-600 dark:text-white/70">Arsenic?</span>
                            </h2>
                            <p className="text-slate-600 dark:text-white/50 max-w-sm">
                                Elevating the standard of student diplomacy through immersive simulations.
                            </p>
                        </div>
                        <Link href="/about" className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest transition-colors pb-2 border-b border-slate-200 dark:border-white/10 hover:border-slate-900 dark:hover:border-white">
                            View All Features <MoveRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <Award className="w-6 h-6" />, title: "World Class", desc: "Expert mentorship from seasoned diplomats and international debaters." },
                            { icon: <Globe className="w-6 h-6" />, title: "Global Network", desc: "Connect with like-minded delegates from over 50+ countries." },
                            { icon: <Zap className="w-6 h-6" />, title: "Innovation", desc: "Cutting-edge parliamentary simulation technology and protocols." },
                            { icon: <Users className="w-6 h-6" />, title: "Community", desc: "Join an alumni network of 5000+ leaders worldwide." },
                            { icon: <Mic2 className="w-6 h-6" />, title: "Public Speaking", desc: "Develop confidence, leadership, and persuasive communication." },
                            { icon: <BookOpen className="w-6 h-6" />, title: "Resources", desc: "Access to comprehensive study guides and research materials." }
                        ].map((item, i) => (
                            <FeatureCard key={i} item={item} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Event Showcase - Horizontal Scroll / Sticky */}
            <section className="relative z-10 py-20 md:py-40 px-6 bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-white transition-colors duration-500">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/60">
                                    Our Programs
                                </div>
                                <h2 className="text-4xl md:text-6xl font-medium leading-[1.1]">
                                    <span className="bg-gradient-to-r from-[#003366] via-[#005A9C] to-[#4B9CD3] bg-clip-text text-transparent bg-[200%_auto] animate-shine">
                                        Choose Your
                                    </span> <br />
                                    <span className="font-serif italic text-slate-400 dark:text-white/50">Diplomatic Arena</span>
                                </h2>
                                <p className="text-slate-600 dark:text-white/50 text-lg leading-relaxed max-w-md font-light">
                                    From the intensity of the Security Council to the legislative precision of the Lok Sabha.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {eventTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setActiveTab(type.id)}
                                        className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ${activeTab === type.id
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-black font-medium"
                                            : "border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:border-slate-400 dark:hover:border-white/30 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                                <Link href={`/${activeTab}`} className="inline-flex items-center gap-3 text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-white/70 transition-colors group">
                                    <span className="text-lg">View Committee Details</span>
                                    <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/20 flex items-center justify-center group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-none">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={
                                        activeTab === 'mun' ? "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=1200" :
                                            activeTab === 'lok-sabha' ? "https://images.unsplash.com/photo-1596520774490-5e4f9a4e4e75?q=80&w=1200" :
                                                "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200"
                                    }
                                    alt="Event"
                                    fill
                                    className="object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                        <div className="text-white/60 text-sm uppercase tracking-widest">Watch Trailer</div>
                                    </div>
                                    <h3 className="text-3xl font-medium text-white mb-2">
                                        {eventTypes.find(e => e.id === activeTab)?.label}
                                    </h3>
                                    <div className="flex items-center gap-4 text-white/50 text-sm">
                                        <span>2024 Edition</span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span>Offline & Online</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}