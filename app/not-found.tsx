"use client";

import Link from "next/link";
import { Home, RotateCcw, Zap, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NotFound() {
    const router = useRouter();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
    const [glitchActive, setGlitchActive] = useState(false);
    const [memeIndex, setMemeIndex] = useState(0);

    const memes = [
        { emoji: "🤔", text: "Let me search my files..." },
        { emoji: "😅", text: "Not in my documents..." },
        { emoji: "🤷", text: "Maybe in downloads?" },
        { emoji: "😭", text: "It's just... gone!" },
        { emoji: "👻", text: "It became a ghost!" },
        { emoji: "🚀", text: "It went to the moon!" },
    ];

    useEffect(() => {
        const newParticles = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 0.5
        }));
        setParticles(newParticles);

        const memeInterval = setInterval(() => {
            setMemeIndex(prev => (prev + 1) % memes.length);
        }, 2000);

        return () => clearInterval(memeInterval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const triggerGlitch = () => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {/* Gradient orbs with enhanced animation */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "1s" }}></div>

                {/* Floating particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animation: `float 8s ease-in-out infinite`,
                            animationDelay: `${particle.delay}s`,
                            opacity: Math.random() * 0.6 + 0.3,
                            boxShadow: `0 0 10px rgba(250, 204, 21, ${Math.random() * 0.5 + 0.3})`
                        }}
                    />
                ))}

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) translateX(0px); }
                        25% { transform: translateY(-30px) translateX(15px); }
                        50% { transform: translateY(-60px) translateX(-15px); }
                        75% { transform: translateY(-30px) translateX(15px); }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.15); }
                    }
                    @keyframes glow {
                        0%, 100% { text-shadow: 0 0 10px rgba(250, 204, 21, 0.5), 0 0 20px rgba(249, 115, 22, 0.3); }
                        50% { text-shadow: 0 0 30px rgba(250, 204, 21, 0.9), 0 0 50px rgba(249, 115, 22, 0.7); }
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes glitch {
                        0% { transform: translate(0, 0); }
                        20% { transform: translate(-2px, 2px); }
                        40% { transform: translate(-2px, -2px); }
                        60% { transform: translate(2px, 2px); }
                        80% { transform: translate(2px, -2px); }
                        100% { transform: translate(0, 0); }
                    }
                    @keyframes shake {
                        0%, 100% { transform: rotateZ(0deg); }
                        10% { transform: rotateZ(-2deg); }
                        20% { transform: rotateZ(2deg); }
                        30% { transform: rotateZ(-2deg); }
                        40% { transform: rotateZ(2deg); }
                    }
                    @keyframes spin-slow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .animate-glow { animation: glow 2s ease-in-out infinite; }
                    .animate-bounce-custom { animation: bounce 2s ease-in-out infinite; }
                    .animate-slide-in { animation: slideIn 0.6s ease-out forwards; }
                    .glitch { animation: glitch 0.3s; }
                    .shake { animation: shake 0.5s; }
                    .spin-slow { animation: spin-slow 3s linear infinite; }
                `}</style>
            </div>

            <div className="z-10 max-w-4xl space-y-8">
                {/* ASCII Art / Big Text */}
                <div className="space-y-4 animate-slide-in font-mono text-xs md:text-sm leading-none text-yellow-400/60 hover:text-yellow-400/80 transition-colors">
                    <pre className="inline-block bg-black/40 p-4 rounded border border-yellow-400/20">{`
    ╔═══════════════════════════════════════╗
    ║         ERROR 404 DETECTED! 🚨        ║
    ║    PAGE NOT FOUND IN THE MATRIX      ║
    ╚═══════════════════════════════════════╝
                    `}</pre>
                </div>

                {/* Main 404 with Glitch Effect */}
                <div className="relative inline-block w-full">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl blur-3xl opacity-20"></div>

                    {/* Main Text Container */}
                    <div className={`relative ${glitchActive ? 'glitch' : ''}`}>
                        <div
                            className="text-8xl md:text-9xl font-black leading-tight animate-glow cursor-pointer select-none hover:scale-105 transition-transform"
                            onClick={triggerGlitch}
                            style={{
                                textShadow: "8px 8px 0px rgba(0,0,0,0.9), -2px -2px 0px rgba(250,204,21,0.4), 4px -4px 0px rgba(255,0,0,0.2)",
                                WebkitTextStroke: "4px #000",
                                filter: glitchActive ? 'hue-rotate(90deg)' : 'none'
                            }}
                        >
                            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                                404
                            </span>
                        </div>

                        {/* Decorative emojis with animations */}
                        <div className="absolute -top-16 left-1/4 text-5xl animate-bounce-custom">⚡</div>
                        <div className="absolute -top-12 right-1/4 text-4xl animate-bounce-custom" style={{ animationDelay: "0.2s" }}>✨</div>
                        <div className="absolute -bottom-12 left-1/3 text-4xl animate-bounce-custom" style={{ animationDelay: "0.4s" }}>💥</div>
                    </div>

                    {/* Animated subtitle */}
                    <div className="text-4xl md:text-5xl font-black mt-8 text-transparent bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400 bg-clip-text animate-glow">
                        PAGE NOT FOUND
                    </div>
                </div>

                {/* Meme Section with Rotating Messages */}
                <div className="space-y-6 mt-12">
                    {/* Top Meme Caption */}
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-8 rounded-2xl border-4 border-black font-black text-3xl md:text-4xl italic transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-yellow-500/60 uppercase tracking-wider">
                        <p className="mb-2">🔍 me looking for the page</p>
                    </div>

                    {/* Emoji meme display */}
                    <div className="bg-gradient-to-b from-zinc-900 to-black border-4 border-yellow-500/30 rounded-2xl p-12 min-h-48 flex flex-col items-center justify-center space-y-4">
                        <div className="text-8xl md:text-9xl animate-bounce-custom" style={{
                            animation: `bounce 1.5s ease-in-out infinite, spin-slow 6s linear infinite`
                        }}>
                            {memes[memeIndex].emoji}
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-yellow-400 min-h-16">
                            {memes[memeIndex].text}
                        </p>
                    </div>

                    {/* Bottom Meme Caption */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl border-4 border-black font-black text-3xl md:text-4xl italic transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/60 uppercase tracking-wider">
                        <p className="mb-3">👻 the page be like:</p>
                        <p className="text-6xl animate-bounce">👻</p>
                    </div>
                </div>

                {/* Funny Messages Section */}
                <div className="space-y-4 text-lg md:text-xl mt-12">
                    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 pl-6 py-4 text-yellow-300">
                        <p className="text-2xl font-bold">✨ MOMENT OF TRUTH:</p>
                        <p className="mt-2">"Oof, you've ventured into the void! 🌌"</p>
                    </div>

                    <div className="bg-orange-500/10 border-l-4 border-orange-500 pl-6 py-4 text-orange-300">
                        <p className="text-2xl font-bold">📢 POINT OF ORDER!</p>
                        <p className="mt-2">This page has been removed, renamed, or is currently at the Starbucks ☕</p>
                    </div>

                    <div className="bg-red-500/10 border-l-4 border-red-500 pl-6 py-4 text-red-300">
                        <p className="text-2xl font-bold">🏃 BREAKING NEWS:</p>
                        <p className="mt-2">This page went missing faster than a delegate during committee break</p>
                    </div>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12" style={{
                    animation: "slideIn 0.8s ease-out 0.2s both"
                }}>
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg rounded-2xl border-4 border-black shadow-lg hover:shadow-yellow-500/80 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden hover:-rotate-2"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-30 transition-opacity"></span>
                        <Home size={28} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-xl">RESCUE ME!</span>
                        <Zap size={24} className="group-hover:animate-pulse" />
                    </Link>

                    <button
                        onClick={() => {
                            triggerGlitch();
                            router.back();
                        }}
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-black text-lg rounded-2xl border-4 border-black shadow-lg hover:shadow-blue-500/80 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden hover:rotate-2"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-30 transition-opacity"></span>
                        <RotateCcw size={28} className="group-hover:rotate-180 transition-transform duration-700" />
                        <span className="text-xl">GO BACK!</span>
                        <Star size={24} className="group-hover:animate-spin" />
                    </button>
                </div>

                {/* Enhanced Terminal Footer */}
                <div className="text-sm md:text-base font-mono bg-gradient-to-r from-black to-zinc-900 backdrop-blur border-2 border-yellow-500/50 p-8 rounded-2xl mt-12 space-y-3 shadow-lg hover:border-yellow-500/80 transition-colors" style={{
                    animation: "slideIn 1s ease-out 0.4s both"
                }}>
                    <p className="text-yellow-300 flex items-center gap-2 text-lg">
                        <span className="text-2xl">$</span>
                        <span>sudo locate-page 404</span>
                        <span className="animate-pulse">|</span>
                    </p>
                    <p className="text-red-500 text-lg">⚠️  ERROR: Page.exe crashed at {new Date().toLocaleTimeString()}</p>
                    <p className="text-red-500">🔍 Searching: /void/404/somewhere/else</p>
                    <p className="text-red-500">❌ Result: NOT FOUND IN ANY DIMENSION</p>
                    <p className="text-green-500 text-lg font-bold">💡 Suggestion: Contact NASA, ask them to search the moon</p>
                </div>

                {/* Badge with animation */}
                <div className="absolute bottom-8 text-base md:text-lg text-gray-300 font-bold flex items-center gap-3 hover:text-yellow-400 transition-all duration-300 group cursor-pointer">
                    <span className="text-3xl animate-pulse group-hover:scale-125 transition-transform">🔥</span>
                    <span className="group-hover:scale-105 transition-transform">ARSENIC SUMMIT 2024</span>
                    <span className="text-3xl animate-pulse group-hover:scale-125 transition-transform">🔥</span>
                </div>

                {/* Meme credit - Bottom right */}
                <div className="absolute bottom-24 right-8 text-xs text-gray-500 font-mono">
                    Made with ❤️ for Meme Lovers
                    <br/>
                    Jokes Powered by MUN Culture™
                </div>
            </div>
        </div>
    );
}
