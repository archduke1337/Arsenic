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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
            <Toaster richColors position="top-center" />
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
                                <h1 className="text-4xl font-bold mb-2 font-display text-white">Join Us</h1>
                                <p className="text-gray-400">Create your account to get started</p>
                            </motion.div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white"
                                }}
                                required
                            />

                            <Input
                                type="email"
                                label="Email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, email: value })
                                }
                                startContent={<Mail className="text-gray-400" size={18} />}
                                variant="bordered"
                                autoComplete="email"
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
                                placeholder="Create a password"
                                value={formData.password}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, password: value })
                                }
                                startContent={<Lock className="text-gray-400" size={18} />}
                                variant="bordered"
                                autoComplete="new-password"
                                classNames={{
                                    inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500 bg-white/5",
                                    label: "text-gray-400",
                                    input: "text-white"
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
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    Login here <ArrowRight size={14} className="ml-1" />
                                </Link>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    );
}
