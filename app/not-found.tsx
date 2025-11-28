import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 max-w-md space-y-6">
                <div className="flex justify-center mb-6">
                    <div className="p-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 animate-pulse">
                        <AlertTriangle size={64} className="text-yellow-500" />
                    </div>
                </div>

                <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    404
                </h1>

                <h2 className="text-2xl font-bold">Page Not Found</h2>

                <p className="text-gray-400">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all"
                    >
                        <Home size={20} />
                        Return Home
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-8 text-xs text-gray-600">
                Arsenic Summit 2024
            </div>
        </div>
    );
}
