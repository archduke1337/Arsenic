"use client";

import { Button, Card, CardBody, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID } from "appwrite";
import { toast, Toaster } from "sonner";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CONTACT_SUBMISSIONS,
                ID.unique(),
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    status: 'new'
                }
            );
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["University Campus,", "New Delhi, India 110001"],
            color: "text-blue-500"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["contact@arsenic.com", "support@arsenic.com"],
            color: "text-purple-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: ["+91 98765 43210", "+91 12345 67890"],
            color: "text-pink-500"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden py-24 px-6">
            <Toaster position="top-right" richColors />
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                            Have questions about the summit? We're here to help. Reach out to us and we'll get back to you as soon as possible.
                        </p>

                        <div className="space-y-8">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-start gap-6 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors ${info.color}`}>
                                        <info.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-gray-400">{detail}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl p-8">
                            <CardBody>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Name"
                                            placeholder="Enter your name"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500",
                                                label: "text-gray-400",
                                                input: "text-white"
                                            }}
                                            value={formData.name}
                                            onValueChange={(v) => setFormData({ ...formData, name: v })}
                                        />
                                        <Input
                                            label="Email"
                                            placeholder="Enter your email"
                                            type="email"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500",
                                                label: "text-gray-400",
                                                input: "text-white"
                                            }}
                                            value={formData.email}
                                            onValueChange={(v) => setFormData({ ...formData, email: v })}
                                        />
                                    </div>
                                    <Input
                                        label="Subject"
                                        placeholder="What is this regarding?"
                                        variant="bordered"
                                        classNames={{
                                            inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500",
                                            label: "text-gray-400",
                                            input: "text-white"
                                        }}
                                        startContent={<MessageSquare size={18} className="text-gray-500" />}
                                        value={formData.subject}
                                        onValueChange={(v) => setFormData({ ...formData, subject: v })}
                                    />
                                    <Textarea
                                        label="Message"
                                        placeholder="Type your message here..."
                                        variant="bordered"
                                        minRows={6}
                                        classNames={{
                                            inputWrapper: "border-white/20 hover:border-white/40 focus-within:!border-blue-500",
                                            label: "text-gray-400",
                                            input: "text-white"
                                        }}
                                        value={formData.message}
                                        onValueChange={(v) => setFormData({ ...formData, message: v })}
                                    />
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-lg shadow-blue-500/25"
                                        endContent={<Send size={18} />}
                                        type="submit"
                                        isLoading={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
