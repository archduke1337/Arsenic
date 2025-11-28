"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Spinner, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { LayoutDashboard, Users, ClipboardList, FileText, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ChairLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (!user.labels?.includes("chairperson") && !user.labels?.includes("admin")) {
                router.push("/"); // Redirect unauthorized users
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { name: "Dashboard", href: "/chair", icon: LayoutDashboard },
        { name: "Delegates", href: "/chair/delegates", icon: Users },
        { name: "Scoring", href: "/chair/scoring", icon: ClipboardList },
        { name: "Resources", href: "/chair/resources", icon: FileText },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-white/10 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            Chair Panel
                        </h1>
                        <p className="text-xs text-gray-400">Arsenic Summit 2024</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/20"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Dropdown placement="top-start" className="bg-zinc-900 border border-white/10">
                        <DropdownTrigger>
                            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                                <Avatar
                                    name={user.name}
                                    size="sm"
                                    className="bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400 truncate">Chairperson</p>
                                </div>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions">
                            <DropdownItem key="logout" className="text-danger" color="danger" startContent={<LogOut size={16} />} onClick={logout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30">
                    <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">Chair Panel</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
