"use client";

export const dynamic = 'force-dynamic';

import { useAuth } from "@/lib/auth-context";
import { Button, User, Avatar } from "@nextui-org/react";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Image as ImageIcon,
    MessageSquare,
    LogOut,
    Shield,
    Layers,
    Award,
    HelpCircle,
    Building2,
    QrCode,
    CheckCircle,
    TrendingUp,
    Ticket,
    Menu,
    X,
    Bell,
    Settings,
    Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-6">
                    <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20 w-fit mx-auto">
                        <Shield size={64} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-gray-400 mb-6">You do not have permission to view this page.</p>
                    </div>
                    <Button as={Link} href="/" color="warning">Go Home</Button>
                </div>
            </div>
        );
    }

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Calendar, label: "Events", href: "/admin/events" },
        { icon: Layers, label: "Committees", href: "/admin/committees" },
        { icon: Users, label: "Registrations", href: "/admin/registrations" },
        { icon: QrCode, label: "Check-In", href: "/admin/check-in" },
        { icon: Award, label: "Awards", href: "/admin/awards" },
        { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
        { icon: Users, label: "Team", href: "/admin/team" },
        { icon: Building2, label: "Sponsors", href: "/admin/sponsors" },
        { icon: HelpCircle, label: "FAQs", href: "/admin/faqs" },
        { icon: MessageSquare, label: "Contact", href: "/admin/contact" },
        { icon: TrendingUp, label: "Scores", href: "/admin/scores" },
        { icon: CheckCircle, label: "Attendance", href: "/admin/attendance" },
        { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
        { icon: Users, label: "Alumni", href: "/admin/alumni" },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0a0a0a] flex selection:bg-yellow-100 dark:selection:bg-yellow-900 selection:text-yellow-900 dark:selection:text-white">
            {/* Desktop Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] fixed h-full z-50 transition-all duration-300 ease-in-out`}
            >
                <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <motion.div
                        layout
                        className="shrink-0"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white">
                            <Shield size={20} />
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col"
                            >
                                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">ADMIN</span>
                                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Panel</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? "bg-gradient-to-r from-yellow-500/10 to-orange-600/10 text-orange-600 dark:text-yellow-400 font-medium"
                                        : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <div className="shrink-0">
                                    <item.icon size={20} className={isActive ? "text-orange-600 dark:text-yellow-400" : ""} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
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
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-50 dark:bg-white/5 rounded-lg"
                    >
                        <Menu size={16} />
                    </button>

                    <button
                        onClick={() => logout()}
                        className={`mt-2 w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar Overlay */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-gray-300">
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                            <Shield size={16} />
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">Admin</span>
                    </div>
                </div>
                <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    className="w-8 h-8"
                />
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 20 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#0f0f0f] z-[70] md:hidden flex flex-col border-r border-gray-200 dark:border-white/5"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white">
                                        <Shield size={16} />
                                    </div>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">Admin Panel</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                                                    ? "bg-yellow-50 dark:bg-yellow-500/10 text-orange-600 dark:text-yellow-400 font-medium"
                                                    : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5"
                                                }`}
                                        >
                                            <item.icon size={20} />
                                            <span className="text-sm">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium text-sm">Log Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300 min-h-screen flex flex-col pt-16 md:pt-0`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-8 py-4 hidden md:flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full max-w-xl">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-500/20 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Admin</div>
                            </div>
                            <Avatar
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                                className="w-10 h-10 ring-2 ring-white dark:ring-[#0a0a0a] shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
