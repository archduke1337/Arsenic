"use client";

import { Link, Button, Input } from "@nextui-org/react";
import { Mail, MapPin, Phone, Send, Instagram, Twitter, Linkedin, Youtube, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const quickLinks = [
        { name: "About Us", href: "/about" },
        { name: "Events", href: "/events" },
        { name: "Committees", href: "/committees" },
        { name: "Gallery", href: "/gallery" },
    ];

    const resources = [
        { name: "Team", href: "/team" },
        { name: "Alumni", href: "/alumni" },
        { name: "Contact", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
    ];

    const events = [
        { name: "Model UN", href: "/mun" },
        { name: "Lok Sabha", href: "/lok-sabha" },
        { name: "Rajya Sabha", href: "/rajya-sabha" },
        { name: "Debates", href: "/debate" },
    ];

    const socialLinks = [
        { icon: <Instagram size={20} />, href: "#", label: "Instagram", color: "hover:text-pink-500" },
        { icon: <Twitter size={20} />, href: "#", label: "Twitter", color: "hover:text-blue-400" },
        { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
        { icon: <Youtube size={20} />, href: "#", label: "YouTube", color: "hover:text-red-500" },
    ];

    return (
        <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-300 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative w-12 h-12"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="ARSENIC Summit"
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                            </motion.div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    ARSENIC
                                </span>
                                <span className="text-xs uppercase tracking-widest text-gray-400 font-medium -mt-1">
                                    Summit 2024
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            Empowering the next generation of leaders through diplomacy, debate, and parliamentary simulations. Join us in shaping tomorrow's changemakers.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-3">
                            <h4 className="text-white font-semibold text-sm">Stay Updated</h4>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    classNames={{
                                        input: "bg-gray-800/50 text-white",
                                        inputWrapper: "bg-gray-800/50 border border-gray-700 hover:border-gray-600 group-data-[focus=true]:bg-gray-800/70",
                                    }}
                                    size="sm"
                                />
                                <Button
                                    isIconOnly
                                    color="primary"
                                    variant="shadow"
                                    size="sm"
                                    className="min-w-10 bg-gradient-to-r from-blue-600 to-cyan-500"
                                >
                                    <Send size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                                Explore
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Events */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                                Events
                            </h3>
                            <ul className="space-y-3">
                                {events.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                                Resources
                            </h3>
                            <ul className="space-y-3">
                                {resources.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                                Contact
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2 text-gray-400">
                                    <Mail size={16} className="mt-0.5 flex-shrink-0" />
                                    <a href="mailto:info@arsenicsummit.com" className="hover:text-white transition-colors">
                                        info@arsenicsummit.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-2 text-gray-400">
                                    <Phone size={16} className="mt-0.5 flex-shrink-0" />
                                    <a href="tel:+1234567890" className="hover:text-white transition-colors">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="flex items-start gap-2 text-gray-400">
                                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                    <span>Mumbai, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800/50" />

                {/* Bottom Section */}
                <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        © {currentYear} <span className="text-gray-400 font-semibold">ARSENIC Summit</span>. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                                aria-label={social.label}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>

                    {/* Legal Links */}
                    <div className="flex items-center gap-4 text-sm">
                        <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-700">•</span>
                        <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-blue-500/50 transition-all z-50"
                aria-label="Scroll to top"
            >
                <ArrowUp size={20} />
            </motion.button>
        </footer>
    );
}