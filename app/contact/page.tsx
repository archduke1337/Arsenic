"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { COLLECTIONS } from "@/lib/schema";
import { toast } from "sonner";

export default function ModernContact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill all fields correctly");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setSubmitSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            toast.success("Message sent successfully! We'll get back to you soon.");
            
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["University Campus", "New Delhi, India 110001"],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["contact@arsenic.com", "support@arsenic.com"],
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: ["+91 98765 43210", "+91 12345 67890"],
            color: "from-orange-500 to-red-500"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
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
                    }}
                />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
                <div className="max-w-7xl w-full">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm mb-6 opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm text-gray-400 tracking-wide">CONTACT US</span>
                        </div>
                        
                        <h1
                            className="text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
                        >
                            Get in{" "}
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Touch
                            </span>
                        </h1>
                        
                        <p
                            className="text-xl text-gray-400 max-w-2xl mx-auto opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                        >
                            Have questions about the summit? We're here to help and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => {
                                const IconComponent = info.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group relative border border-white/10 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 opacity-0 animate-fadeInUp"
                                        style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} p-[1px] group-hover:scale-110 transition-transform`}>
                                                <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                                                    <IconComponent size={24} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                                                {info.details.map((detail, i) => (
                                                    <p key={i} className="text-gray-400 text-sm">{detail}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
                                    </div>
                                );
                            })}

                            {/* Quick Info */}
                            <div
                                className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] opacity-0 animate-fadeInUp"
                                style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
                            >
                                <h3 className="text-lg font-bold mb-4">Quick Response Time</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We typically respond within 24 hours during business days. For urgent inquiries, please call us directly.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div
                            className="border border-white/10 rounded-2xl p-8 bg-white/[0.02] backdrop-blur-sm opacity-0 animate-fadeInUp"
                            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
                        >
                            {submitSuccess ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} className="text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Message Sent Successfully!</h3>
                                    <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                                className={`w-full px-4 py-3 bg-white/[0.02] border rounded-lg focus:outline-none text-white placeholder-gray-600 transition-all ${
                                                    errors.name ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                                                }`}
                                                value={formData.name}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, name: e.target.value });
                                                    if (errors.name) setErrors({ ...errors, name: "" });
                                                }}
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className={`w-full px-4 py-3 bg-white/[0.02] border rounded-lg focus:outline-none text-white placeholder-gray-600 transition-all ${
                                                    errors.email ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                                                }`}
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    if (errors.email) setErrors({ ...errors, email: "" });
                                                }}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Subject</label>
                                        <div className="relative">
                                            <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                            <input
                                                type="text"
                                                placeholder="What is this regarding?"
                                                className={`w-full pl-12 pr-4 py-3 bg-white/[0.02] border rounded-lg focus:outline-none text-white placeholder-gray-600 transition-all ${
                                                    errors.subject ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                                                }`}
                                                value={formData.subject}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, subject: e.target.value });
                                                    if (errors.subject) setErrors({ ...errors, subject: "" });
                                                }}
                                            />
                                        </div>
                                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Message</label>
                                        <textarea
                                            rows={6}
                                            placeholder="Type your message here..."
                                            className={`w-full px-4 py-3 bg-white/[0.02] border rounded-lg focus:outline-none text-white placeholder-gray-600 resize-none transition-all ${
                                                errors.message ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                                            }`}
                                            value={formData.message}
                                            onChange={(e) => {
                                                setFormData({ ...formData, message: e.target.value });
                                                if (errors.message) setErrors({ ...errors, message: "" });
                                            }}
                                        />
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            )}
                        </div>
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

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}