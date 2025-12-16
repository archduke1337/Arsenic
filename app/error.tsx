"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { RefreshCcw, AlertOctagon } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 max-w-md space-y-6">
                <div className="flex justify-center mb-6">
                    <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20">
                        <AlertOctagon size={64} className="text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold">Something went wrong!</h1>

                <p className="text-gray-400">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>

                <div className="p-4 rounded-lg bg-zinc-900 border border-white/10 text-left text-sm font-mono text-red-400 overflow-auto max-h-32 w-full">
                    {error.message || "Unknown error occurred"}
                </div>

                <div className="pt-4 flex gap-4 justify-center">
                    <Button
                        color="danger"
                        variant="shadow"
                        size="lg"
                        startContent={<RefreshCcw size={20} />}
                        onClick={() => reset()}
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="bordered"
                        onClick={() => window.location.href = "/"}
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
