"use client";

import { useAuth } from "@/lib/auth-context";
import { Avatar, Button, Input, User } from "@nextui-org/react";
import { LayoutDashboard, FileText, Users, Download, LogOut, Search, Bell, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: FileText, label: "Documents", href: "/dashboard/documents" },
        { icon: Users, label: "Networking", href: "/dashboard/networking" },
        { icon: Download, label: "Resources", href: "/dashboard/resources" },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] flex selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-white">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] fixed h-full z-50 transition-all duration-300 ease-in-out`}
            >
                <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <motion.div
                        layout
                        className="shrink-0"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20">
                            {/* Using the logo.png as requested, falling back to styled A if needed */}
                            <img
                                src="/logo.png"
                                alt="Arsenic Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="font-bold text-xl tracking-tight text-slate-900 dark:text-white"
                            >
                                ARSENIC
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex-1 py-6 px-3 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-900/10 dark:shadow-white/5"
                                    : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <div className="shrink-0">
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={() => logout()}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Log Out</span>}
                    </button>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mt-4 w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <Menu size={16} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 min-h-screen flex flex-col`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <div className="relative w-full hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search resources, committees..."
                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 hidden md:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Delegate</div>
                            </div>
                            <Avatar
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                                className="w-10 h-10 ring-2 ring-white dark:ring-[#0a0a0a] shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

