"use client";

import { useState } from "react";
import { Button, Input, Card, CardBody, Link } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim()) {
            toast.error("Please enter both email and password");
            return;
        }
        
        setIsLoading(true);

        try {
            await login(email, password);
            toast.success("Login successful!");
            router.push("/admin");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex items-center justify-center px-4 py-12">
            <Toaster richColors position="top-center" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1.2fr,1.3fr] gap-0 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-zinc-950"
            >
                {/* Left visual panel */}
                <div className="relative hidden md:block bg-gradient-to-br from-[rgba(0,35,149,0.9)] via-[rgba(30,64,175,0.9)] to-black">
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(147,197,253,0.4),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.4),transparent_55%)]" />
                    <div className="absolute inset-6 rounded-3xl border border-white/20" />
                    <div className="relative h-full flex flex-col justify-center p-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/40 flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="Arsenic Summit Logo"
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white/80">Arsenic Summit</span>
                                <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                                    Delegate Portal
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-white">
                                Welcome back.
                            </h2>
                            <p className="text-sm text-blue-100/80 max-w-xs">
                                Sign in to manage your registrations, view allocations, and stay updated with summit timelines.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="px-6 sm:px-10 py-10 flex flex-col justify-center">
                    <div className="mb-8">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 mb-2">
                            Login
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                            Log in
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline text-[rgb(0,35,149)] dark:text-blue-300">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="name@college.edu"
                            value={email}
                            onValueChange={setEmail}
                            startContent={<Mail className="text-gray-400" size={18} />}
                            variant="bordered"
                            autoComplete="email"
                            classNames={{
                                inputWrapper:
                                    "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:!border-[rgb(0,35,149)] dark:focus-within:!border-blue-400 shadow-none",
                                label: "text-gray-500 dark:text-gray-400",
                                input: "text-slate-900 dark:text-white"
                            }}
                            required
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onValueChange={setPassword}
                            startContent={<Lock className="text-gray-400" size={18} />}
                            variant="bordered"
                            autoComplete="current-password"
                            classNames={{
                                inputWrapper:
                                    "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:!border-[rgb(0,35,149)] dark:focus-within:!border-blue-400 shadow-none",
                                label: "text-gray-500 dark:text-gray-400",
                                input: "text-slate-900 dark:text-white"
                            }}
                            required
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full mt-2 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm tracking-tight py-6"
                            isLoading={isLoading}
                            spinner={<Loader2 className="animate-spin" size={20} />}
                        >
                            {isLoading ? "Signing in..." : "Log in"}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
