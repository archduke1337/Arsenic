"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import Image from "next/image";
import { ArrowRight, Users, MapPin, Trophy, Calendar, Globe, Mic, Gavel } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const CountUp = ({ end, duration = 2 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
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
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
    const [stats, setStats] = useState({ delegates: 0, committees: 0, awards: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6928648600197e286fda";
                const [registrations, committees, awards] = await Promise.all([
                    databases.listDocuments(databaseId, "Registrations", [Query.limit(1)]),
                    databases.listDocuments(databaseId, "Committees", [Query.limit(1)]),
                    databases.listDocuments(databaseId, "Awards", [Query.limit(1)]),
                ]);
                setStats({
                    delegates: registrations.total || 0,
                    committees: committees.total || 12,
                    awards: awards.total || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats({ delegates: 0, committees: 12, awards: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statData = [
        { label: "Delegates", value: stats.delegates, suffix: "+", icon: Users, color: "text-blue-400" },
        { label: "Committees", value: stats.committees, suffix: "", icon: MapPin, color: "text-purple-400" },
        { label: "Awards (₹)", value: stats.awards, suffix: "+", icon: Trophy, color: "text-yellow-400" },
        { label: "Days", value: 2, suffix: "", icon: Calendar, color: "text-cyan-400" },
    ];

    return (
        <div className="py-24 bg-zinc-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statData.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                                    <CardBody className="text-center py-8">
                                        <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${stat.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="text-4xl font-bold mb-2 text-white">
                                            {loading ? <Spinner size="sm" /> : <><CountUp end={stat.value} />{stat.suffix}</>}
                                        </div>
                                        <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [activeTab, setActiveTab] = useState("mun");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const eventTypes = [
        { id: "mun", label: "Model UN", color: "from-blue-600 to-cyan-500", iconName: "globe", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80" },
        { id: "lok-sabha", label: "Lok Sabha", color: "from-orange-500 to-red-500", iconName: "gavel", image: "https://images.unsplash.com/photo-1596720426673-e4e15688cafb?auto=format&fit=crop&q=80" },
        { id: "rajya-sabha", label: "Rajya Sabha", color: "from-green-600 to-emerald-500", iconName: "users", image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80" },
        { id: "debate", label: "Debate", color: "from-purple-600 to-pink-500", iconName: "mic", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" },
        { id: "youth-parliament", label: "Youth Parliament", color: "from-yellow-500 to-amber-500", iconName: "trophy", image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80" },
    ];

    const getIcon = (iconName: string) => {
        const iconProps = { size: 24 };
        switch(iconName) {
            case "globe": return <Globe {...iconProps} />;
            case "gavel": return <Gavel {...iconProps} />;
            case "users": return <Users {...iconProps} />;
            case "mic": return <Mic {...iconProps} />;
            case "trophy": return <Trophy {...iconProps} />;
            default: return null;
        }
    };

    const activeEvent = eventTypes.find((e) => e.id === activeTab);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % 5);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#06b6d4', '#8b5cf6']
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative h-screen overflow-hidden flex items-center justify-center">
                <div 
                    className="absolute inset-0 z-0 transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url(${eventTypes[currentImageIndex].image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-black/60 z-[1]" />
                <div className="relative z-[2] max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Chip variant="shadow" classNames={{ base: "bg-white/10 backdrop-blur-md border border-white/20 mb-6" }}>
                            <span className="font-semibold tracking-wide text-white">ARSENIC SUMMIT 2024</span>
                        </Chip>
                        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight leading-tight text-white">
                            Where Diplomacy <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-gradient-x">
                                Meets Democracy
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            Join the region's largest student parliament simulation.
                            Debate, deliberate, and decide the future.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button
                                as={Link}
                                href="/register"
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg px-10 py-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                                endContent={<ArrowRight />}
                                onPress={handleConfetti}
                            >
                                Register Now
                            </Button>
                            <Button
                                as={Link}
                                href="/about"
                                size="lg"
                                variant="bordered"
                                className="font-bold text-lg px-10 py-8 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                            >
                                Learn More
                            </Button>
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2">
                        <motion.div 
                            className="w-1 h-2 bg-white rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            </div>

            <StatsSection />

            <div className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Choose Your Arena</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Select an event format to explore its unique opportunities and details.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mb-16 sticky top-24 z-30 p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 w-fit mx-auto">
                        {eventTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveTab(type.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === type.id
                                        ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                                        : "text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {getIcon(type.iconName)}
                                {type.label}
                            </button>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 gap-16 items-center"
                        >
                            <div className="order-2 md:order-1">
                                <Chip color="primary" variant="flat" className="mb-6">
                                    {activeEvent?.label} Highlights
                                </Chip>
                                <h3 className="text-4xl font-bold mb-6 leading-tight text-white">
                                    Experience the <br />
                                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeEvent?.color}`}>
                                        Power of Dialogue
                                    </span>
                                </h3>
                                <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                                    Step into the shoes of a diplomat, parliamentarian, or journalist.
                                    Research, debate, and draft resolutions that could change the world.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {["Professional Executive Board", "High-stakes crisis committees", "International delegate participation", "Networking opportunities"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-200">
                                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${activeEvent?.color} flex items-center justify-center text-white text-xs shadow-lg`}>✓</div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`bg-gradient-to-r ${activeEvent?.color} text-white font-bold shadow-lg`}
                                    size="lg"
                                    endContent={<ArrowRight size={18} />}
                                >
                                    View Committee Details
                                </Button>
                            </div>
                            <div className="order-1 md:order-2 relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r ${activeEvent?.color} rounded-3xl transform rotate-3 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/20 aspect-video dark:bg-zinc-900 bg-gray-100">
                                    {activeEvent?.image && (
                                        <Image
                                            src={activeEvent.image}
                                            alt={activeEvent.label || "Event image"}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <div className="text-white font-bold text-xl dark:text-white text-gray-900">{activeEvent?.label}</div>
                                        <div className="text-gray-300 dark:text-gray-400 text-sm">2024 Edition</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="py-24 bg-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">The Summit Begins In</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[{ value: "14", label: "Days" }, { value: "06", label: "Hours" }, { value: "45", label: "Minutes" }, { value: "30", label: "Seconds" }].map((item, index) => (
                            <div key={index} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                                <div className="text-4xl md:text-6xl font-mono font-bold text-cyan-400 mb-2">{item.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-widest">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-24 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Make Your Mark?</h2>
                        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join hundreds of delegates from across the region. Debate globally, impact locally, and forge lifelong connections.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Button
                                as={Link}
                                href="/register"
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg px-10 py-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                                endContent={<ArrowRight />}
                                onPress={handleConfetti}
                            >
                                Register Today
                            </Button>
                            <Button
                                as={Link}
                                href="/delegates"
                                size="lg"
                                variant="bordered"
                                className="font-bold text-lg px-10 py-8 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-colors"
                            >
                                View Delegates
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
