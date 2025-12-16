"use client";

import { useState } from "react";
import { Button, Input, Card, CardBody, Link } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.email, formData.password, formData.name);
            toast.success("Account created successfully!");
            router.push("/admin");
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error(err instanceof Error ? err.message : "Registration failed");
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
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(248,113,113,0.4),transparent_55%)]" />
                    <div className="absolute inset-6 rounded-3xl border border-white/20" />
                    <div className="relative h-full flex flex-col justify-between p-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center text-xs tracking-widest font-semibold">
                                AR
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white/80">Arsenic Summit</span>
                                <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                                    Create your account
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-white">
                                Join the summit.
                            </h2>
                            <p className="text-sm text-blue-50/80 max-w-xs">
                                Set up your delegate account in a few steps and get access to registrations, allocations,
                                and event updates.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-blue-100/70">
                            <span className="h-px w-8 bg-blue-200/40" />
                            Fast registration • Secure • Theme aware
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="px-6 sm:px-10 py-10 flex flex-col justify-center">
                    <div className="mb-8">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500 mb-2">
                            Sign up
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                            Create an account
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link href="/login" className="underline text-[rgb(0,35,149)] dark:text-blue-300">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onValueChange={(value) =>
                                setFormData({ ...formData, name: value })
                            }
                            startContent={<User className="text-gray-400" size={18} />}
                            variant="bordered"
                            classNames={{
                                inputWrapper:
                                    "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 focus-within:!border-[rgb(0,35,149)] dark:focus-within:!border-blue-400 shadow-none",
                                label: "text-gray-500 dark:text-gray-400",
                                input: "text-slate-900 dark:text-white"
                            }}
                            required
                        />

                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="name@college.edu"
                            value={formData.email}
                            onValueChange={(value) =>
                                setFormData({ ...formData, email: value })
                            }
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
                            placeholder="Create a password"
                            value={formData.password}
                            onValueChange={(value) =>
                                setFormData({ ...formData, password: value })
                            }
                            startContent={<Lock className="text-gray-400" size={18} />}
                            variant="bordered"
                            autoComplete="new-password"
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
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onValueChange={(value) =>
                                setFormData({ ...formData, confirmPassword: value })
                            }
                            startContent={<Lock className="text-gray-400" size={18} />}
                            variant="bordered"
                            autoComplete="new-password"
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
                            {isLoading ? "Creating Account..." : "Create account"}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
