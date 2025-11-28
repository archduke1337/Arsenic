"use client";

import { useState } from "react";
import { Button, Input, Card, CardBody, Link } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            router.push("/admin");
        } catch (error) {
            console.error("Login error:", error);
            alert("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div
                    className="w-full h-full bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] bg-cover bg-center"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-6 relative z-20"
            >
                <Card className="bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
                    <CardBody className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-4xl font-bold mb-2 font-display text-white">Welcome Back</h1>
                                <p className="text-gray-400">Sign in to access your dashboard</p>
                            </motion.div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onValueChange={setEmail}
                                startContent={<Mail className="text-gray-400" size={18} />}
                                variant="bordered"
                                classNames={{
                                    inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white"
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
                                classNames={{
                                    inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white"
                                }}
                                required
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white shadow-lg shadow-blue-500/25"
                                isLoading={isLoading}
                                spinner={<Loader2 className="animate-spin" size={20} />}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    Register here <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
