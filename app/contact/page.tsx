"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Send, CheckCircle2, ArrowUpRight, Smile } from "lucide-react";
import { toast } from "sonner";

export default function ModernContact() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Required";
        if (!formData.email.trim()) newErrors.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.message.trim()) newErrors.message = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Mapping company to subject for API compatibility
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.company || "General Inquiry",
                    message: formData.message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setSubmitSuccess(true);
            setFormData({ name: "", company: "", email: "", message: "" });
            toast.success("Message sent successfully!");

            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 flex items-center justify-center p-6 md:p-12 pt-24 md:pt-32 relative overflow-hidden">
            {/* Subtle background glow to keep it not too flat, but close to reference */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl w-full relative z-10">
                {/* Header */}
                <div className="mb-8 md:mb-12 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <ArrowUpRight className="text-white w-4 h-4" />
                        </div>
                        <span className="font-semibold text-base tracking-tight">Contact Us</span>
                    </div>

                    <div className="hidden md:block text-right text-gray-500 text-sm max-w-xs">
                        Let's start a conversation! Fill out our contact form, and we'll get back to you as soon as possible.
                    </div>
                </div>

                {submitSuccess ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center animate-fadeInUp">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Message Received!</h2>
                        <p className="text-lg text-gray-400 max-w-lg">
                            Thanks for reaching out. We'll get back to you shortly.
                        </p>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="mt-8 px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 md:space-y-6">
                        <div className="text-4xl md:text-6xl font-bold flex items-center gap-3">
                            Hello <Smile className="w-10 h-10 md:w-16 md:h-16 text-white" />
                        </div>

                        {/* Conversational Form */}
                        <div className="space-y-6 md:space-y-8 text-xl md:text-3xl leading-relaxed font-medium text-gray-500">

                            {/* Name Input */}
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <span className="text-white">My name is</span>
                                <div className="relative flex-1 min-w-[200px] group">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-white text-white py-1 focus:outline-none placeholder:text-gray-700 transition-colors"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: "" });
                                        }}
                                    />
                                    {errors.name && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.name}</span>}
                                </div>
                            </div>

                            {/* Company Input (Mapped to Subject) */}
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <span className="text-white">I'm from</span>
                                <div className="relative flex-1 min-w-[200px]">
                                    <input
                                        type="text"
                                        placeholder="Enter your company name"
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-white text-white py-1 focus:outline-none placeholder:text-gray-700 transition-colors"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <span className="text-white">Here is my email</span>
                                <div className="relative flex-1 min-w-[200px]">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-white text-white py-1 focus:outline-none placeholder:text-gray-700 transition-colors"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: "" });
                                        }}
                                    />
                                    {errors.email && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.email}</span>}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <span className="text-white">And message</span>
                                <div className="relative flex-1 min-w-[200px] w-full">
                                    <input
                                        type="text"
                                        placeholder="Enter your message"
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-white text-white py-1 focus:outline-none placeholder:text-gray-700 transition-colors"
                                        value={formData.message}
                                        onChange={(e) => {
                                            setFormData({ ...formData, message: e.target.value });
                                            if (errors.message) setErrors({ ...errors, message: "" });
                                        }}
                                    />
                                    {errors.message && <span className="absolute -bottom-5 left-0 text-xs text-red-500">{errors.message}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 md:pt-12">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="group w-full md:h-20 h-16 bg-[#9381ff] hover:bg-[#806bf9] rounded-full flex items-center justify-between px-4 md:px-10 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="text-2xl md:text-4xl font-medium text-black ml-4">Submit</span>
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}