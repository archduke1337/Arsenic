"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, MapPin, Trophy, Calendar, ChevronDown } from "lucide-react";

const CountUp = ({ end, duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTime;
                    const animate = (currentTime) => {
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

export default function ModernHero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [activeTab, setActiveTab] = useState("mun");

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

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/15 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                        transform: `translateY(${scrollY * 0.5}px)`,
                    }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm opacity-0 animate-fadeInUp"
                        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-sm text-gray-400 tracking-wide">ARSENIC SUMMIT 2024</span>
                    </div>

                    <div className="space-y-4">
                        <h1
                            className="text-6xl md:text-8xl font-bold tracking-tight opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
                        >
                            Where Diplomacy
                        </h1>
                        <h1
                            className="text-6xl md:text-8xl font-bold tracking-tight opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
                        >
                            Meets{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                Democracy
                            </span>
                        </h1>
                    </div>

                    <p
                        className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fadeInUp"
                        style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
                    >
                        Join the region's largest student parliament simulation. Debate, deliberate, and decide the future.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row justify-center gap-4 pt-4 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: "1s", animationFillMode: "forwards" }}
                    >
                        <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-300 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Register Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="px-8 py-4 border border-white/10 hover:border-white/20 rounded-lg font-medium transition-all duration-300 hover:bg-white/[0.02]">
                            Learn More
                        </button>
                    </div>
                </div>

                <div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fadeInUp"
                    style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
                >
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ChevronDown className="w-4 h-4 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative z-10 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {statData.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all group"
                                >
                                    <IconComponent size={32} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                                    <div className="text-5xl font-bold mb-2 text-white">
                                        <CountUp end={stat.value} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/30">
                            <span className="text-sm font-medium text-blue-300">Our Programs</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold">Choose Your Arena</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Select an event format to explore its unique opportunities and details.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {eventTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveTab(type.id)}
                                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                                    activeTab === type.id
                                        ? "bg-blue-600 text-white"
                                        : "border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30"
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-5xl font-bold">
                                    Experience the Power of Dialogue
                                </h3>
                                <p className="text-lg text-gray-400 leading-relaxed">
                                    Step into the shoes of a diplomat, parliamentarian, or journalist.
                                    Research, debate, and draft resolutions that could change the world.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {["Professional Executive Board", "High-stakes crisis committees", "International delegate participation", "Networking opportunities"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs shrink-0">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-300 overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    View Committee Details
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>

                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="text-6xl">🎯</div>
                                <div className="text-white font-bold text-2xl">{eventTypes.find(e => e.id === activeTab)?.label}</div>
                                <div className="text-gray-300 text-sm">2024 Edition</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Countdown Section */}
            <div className="relative z-10 py-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <h2 className="text-4xl md:text-5xl font-bold">The Summit Begins In</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[{ value: "14", label: "Days" }, { value: "06", label: "Hours" }, { value: "45", label: "Minutes" }, { value: "30", label: "Seconds" }].map((item, index) => (
                            <div key={index} className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:border-blue-500/30 transition-all">
                                <div className="text-5xl font-bold text-blue-500 mb-2">{item.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative z-10 py-32 px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-5xl md:text-6xl font-bold">
                        Ready to Make Your Mark?
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Join hundreds of delegates from across the region. Debate globally, impact locally, and forge lifelong connections.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all duration-300 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                Register Today
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button className="px-8 py-4 border border-white/10 hover:border-white/20 rounded-lg font-medium transition-all duration-300 hover:bg-white/[0.02]">
                            View Delegates
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                .animate-bounce {
                    animation: bounce 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}