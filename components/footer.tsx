"use client";

import { Link } from "@nextui-org/react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4">Arsenic Summit</h2>
                        <p className="text-gray-400 mb-4">
                            Empowering the next generation of leaders through diplomacy, debate, and parliamentary simulations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
                            <li><Link href="/team" className="text-gray-400 hover:text-white">Team</Link></li>
                            <li><Link href="/gallery" className="text-gray-400 hover:text-white">Gallery</Link></li>
                            <li><Link href="/alumni" className="text-gray-400 hover:text-white">Alumni</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@arsenicsummit.com</li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Form</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    <p>© {currentYear} Arsenic Summit Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
