import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 max-w-2xl space-y-8">
                {/* Main 404 Meme Section */}
                <div className="space-y-6">
                    {/* Top Text - Meme Style */}
                    <div className="text-6xl md:text-8xl font-black leading-tight" style={{
                        textShadow: "4px 4px 0px #000, -4px -4px 0px #000, 4px -4px 0px #000, -4px 4px 0px #000, 0px 4px 0px #000, 4px 0px 0px #000, 0px -4px 0px #000, -4px 0px 0px #000",
                        WebkitTextStroke: "2px #000"
                    }}>
                        <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                            404
                        </span>
                        <span className="block text-4xl md:text-6xl mt-4 text-white" style={{
                            textShadow: "3px 3px 0px #FF6B35, -2px -2px 0px #004E89",
                            WebkitTextStroke: "1px #FF6B35"
                        }}>
                            PAGE NOT FOUND
                        </span>
                    </div>

                    {/* Meme Captions */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-6 rounded-lg border-4 border-black font-black text-2xl md:text-3xl italic">
                            <p className="mb-2">ME SEARCHING FOR THE PAGE</p>
                        </div>

                        <div className="text-5xl md:text-6xl">
                            🔍 ❌ 📄
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg border-4 border-black font-black text-2xl md:text-3xl italic">
                            <p className="mb-2">THE PAGE I'M LOOKING FOR:</p>
                            <p className="text-5xl">👻</p>
                        </div>
                    </div>

                    {/* Funny Messages */}
                    <div className="space-y-3 text-lg md:text-xl">
                        <p className="text-yellow-300 font-bold">
                            "Oof, you've ventured into the void!"
                        </p>
                        <p className="text-orange-300">
                            Or as they say in MUN: "Point of Order! This page doesn't exist."
                        </p>
                        <p className="text-gray-400">
                            This page went missing faster than a delegate during recess.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-lg rounded-xl border-4 border-black shadow-lg hover:shadow-yellow-500/50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Home size={24} />
                        GO HOME
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-black text-lg rounded-xl border-4 border-black shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={24} />
                        GO BACK
                    </button>
                </div>

                {/* Footer Meme */}
                <div className="text-sm md:text-base font-mono bg-black/50 border-2 border-yellow-500/30 p-4 rounded-lg mt-8">
                    <p className="text-yellow-300">$ sudo find-page 404</p>
                    <p className="text-red-500">Error: Page.exe has stopped responding</p>
                    <p className="text-green-500">Suggestion: Touch grass and try again</p>
                </div>

                {/* Bottom Badge */}
                <div className="absolute bottom-8 text-xs text-gray-600 font-bold">
                    🔥 ARSENIC SUMMIT 2024 🔥
                </div>
            </div>
        </div>
    );
}
