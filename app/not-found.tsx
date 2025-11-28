"use client";
import Link from "next/link";
import { Home, ArrowLeft, Gavel, Mic2, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function NotFound() {
    const router = useRouter();
    const [clicks, setClicks] = useState(0);
    const [soundOn, setSoundOn] = useState(false);
    const [nuked, setNuked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Parliament chaos videos with reliable CDN
    const chaosSequence = [
        null,
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4",
        "https://media.giphy.com/media/3o6ZtpWz836WlNYc8w/giphy.mp4",
        "https://media.giphy.com/media/xTiTnhFnd9AW4qnqJi/giphy.mp4",
        "https://media.giphy.com/media/3oFzlYcvZhX7FQGKQM/giphy.mp4",
        "https://media.giphy.com/media/l0HlTy9x-5zd1W9YY/giphy.mp4",
        "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.mp4",
        "https://media.giphy.com/media/xTiTnhFnd9AW4qnqJi/giphy.mp4",
        "https://media.giphy.com/media/3o6ZtpWz836WlNYc8w/giphy.mp4",
    ];const messages = [
  "पेज ने संसद में कागज़ फाड़े और भाग गया",
  "Speaker ने पेज को नाम लेकर निलंबित कर दिया",
  "ये URL अभी well of the house में डुबकी लगा रहा है",
  "पेज ने tractor लेके संसद घेर लिया",
  "404: Page disqualified under Anti-Defection Law",
  "पेज अभी विपक्ष के साथ walkout कर चुका है",
  "The page has moved a No-Confidence Motion against itself",
  "पेज अभी Rajya Sabha में 500+ बार pending है",
  "Chair: “I EXPUNGE THE URL FROM THE RECORDS!”",
];

    const [msg, setMsg] = useState(messages[0]);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsg(m => messages[(messages.indexOf(m) + 1) % messages.length]);
        }, 2800);
        return () => clearInterval(interval);
    }, [messages]);

    // Sound toggle with proper error handling
    const toggleSound = () => {
        setSoundOn(prev => !prev);
        if (!audioRef.current) {
            try {
                audioRef.current = new Audio("data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==");
                audioRef.current.loop = true;
            } catch (e) {
                console.log("Audio not available");
                return;
            }
        }
        if (audioRef.current) {
            if (soundOn) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => {
                    console.log("Audio autoplay blocked");
                });
            }
        }
    };

    const handle404 = () => {
        const next = clicks + 1;
        setClicks(next);

        if (next < chaosSequence.length && chaosSequence[next]) {
            setCurrentVideo(chaosSequence[next]!);
        }

        if (next === 9) {
            setNuked(true);
            setTimeout(() => {
                document.body.style.transition = "all 2s";
                document.body.style.transform = "rotate(360deg) scale(0)";
                setTimeout(() => {
                    router.push("/");
                }, 2200);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

            {/* Nuclear background when nuked */}
            {nuked && (
                <div className="fixed inset-0 bg-red-900 animate-pulse z-50">
                    <div className="absolute inset-0 bg-orange-600 opacity-70 animate-ping"></div>
                    <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-9xl font-black text-yellow-400 animate-bounce text-center">
                        SUSPENDED FROM 12 PARLIAMENTS
                    </h1>
                </div>
            )}

            {/* Flying chaos - optimized */}
            {clicks >= 5 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute font-black text-yellow-400 drop-shadow-2xl animate-chaos"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 4}s`,
                                fontSize: `${20 + Math.random() * 40}px`,
                            }}
                        >
                            {["POI", "ORDER!", "JAI HIND", "NEET", "EXPUNGE", "WALKOUT"][Math.floor(Math.random() * 6)]}
                        </div>
                    ))}
                </div>
            )}

            <div className="z-10 text-center space-y-4 md:space-y-8 px-4 md:px-6 w-full">

                {/* Tricolour 404 with Ashoka Chakra - Mobile responsive */}
                <h1 onClick={handle404} className="text-6xl md:text-[15rem] font-black leading-none cursor-pointer select-none w-full">
                    <div className="bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent drop-shadow-2xl">4</div>
                    <div className="bg-clip-text text-transparent bg-white -mt-2 md:-mt-20 relative h-20 md:h-40 flex items-center justify-center">
                        0
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-24 md:h-24 bg-blue-700 rounded-full flex items-center justify-center animate-spin-slow">
                            <span className="text-2xl md:text-5xl">☸</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent -mt-2 md:-mt-20 drop-shadow-2xl">4</div>
                </h1>

                {/* Rotating message - responsive text */}
                <p className="text-2xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-red-600 to-cyan-500 bg-clip-text text-transparent animate-pulse min-h-16 md:min-h-36 flex items-center justify-center px-2">
                    {msg}
                </p>

                {/* Viral video player - responsive */}
                {currentVideo && (
                    <div className="my-6 md:my-12 max-w-2xl md:max-w-4xl mx-auto">
                        <video
                            src={currentVideo}
                            autoPlay
                            loop
                            muted={!soundOn}
                            playsInline
                            className="rounded-2xl md:rounded-3xl shadow-2xl border-4 md:border-8 border-yellow-500 w-full"
                        />
                        <button
                            onClick={toggleSound}
                            className="mt-2 md:mt-4 px-4 md:px-6 py-2 md:py-3 bg-red-600 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-red-700 text-sm md:text-base"
                        >
                            <Volume2 size={20} />
                            {soundOn ? "Mute" : "Sound"}
                        </button>
                    </div>
                )}

                {/* Buttons - responsive */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center pt-6 md:pt-10">
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-2 md:gap-5 px-6 md:px-14 py-4 md:py-8 bg-gradient-to-r from-orange-600 to-red-700 text-white font-black text-lg md:text-4xl rounded-full shadow-2xl hover:scale-110 transition-all border-4 md:border-8 border-black"
                    >
                        <Home size={28} className="md:w-12 md:h-12" />
                        <span className="hidden md:inline">Back to Sansad</span>
                        <span className="md:hidden">Home</span>
                        <Mic2 className="group-hover:animate-spin hidden md:inline" size={24} />
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 md:gap-5 px-6 md:px-14 py-4 md:py-8 bg-gradient-to-r from-green-700 to-emerald-800 text-white font-black text-lg md:text-4xl rounded-full shadow-2xl hover:scale-110 transition-all border-4 md:border-8 border-black"
                    >
                        <ArrowLeft size={28} className="md:w-12 md:h-12" />
                        <span className="hidden md:inline">Go Back</span>
                        <span className="md:hidden">Back</span>
                        <Gavel size={24} className="animate-bounce hidden md:inline" />
                    </button>
                </div>

                {/* Footer - responsive */}
                <div className="mt-8 md:mt-20 font-mono text-xs md:text-xl bg-zinc-900/95 backdrop-blur-xl border-4 md:border-8 border-yellow-600 p-4 md:p-10 rounded-2xl md:rounded-3xl">
                    <p className="text-red-500 text-lg md:text-3xl animate-pulse">⚡ LIVE FROM PARLIAMENT ⚡</p>
                    <p className="text-yellow-400 text-xs md:text-base mt-2">Clicks: {clicks} → Level: {clicks >= 9 ? "NUCLEAR" : clicks >= 6 ? "PEPPER SPRAY" : "SUSPENSION"}</p>
                    <p className="text-cyan-400 mt-2 text-xs md:text-base">Warning: More clicks = permanent expulsion 🚀</p>
                </div>

                {/* Tricolour bar - hidden on mobile to avoid overlap */}
                <div className="hidden md:flex fixed bottom-0 w-full h-16">
                    <div className="flex-1 bg-orange-600"></div>
                    <div className="flex-1 bg-white flex items-center justify-center">
                        <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center animate-spin">
                            <span className="text-5xl text-white">☸</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-green-600"></div>
                </div>

                <div className="fixed bottom-2 md:bottom-20 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono bg-black/80 px-2 md:px-4 py-1 md:py-2 rounded text-center">
                    Made with ❤️ for MUN Culture • 2025
                </div>
            </div>

            <style jsx>{`
                @keyframes chaos {
                    0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(120vh) rotate(1080deg); opacity: 0; }
                }
                .animate-chaos { animation: chaos 6s linear infinite; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
            `}</style>
        </div>
    );
}