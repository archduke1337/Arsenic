"use client";

import { useAuth } from "@/lib/auth-context";
import { Button, User, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
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

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        // New Management Features
        { icon: TrendingUp, label: "Scores", href: "/admin/scores" },
        { icon: CheckCircle, label: "Attendance", href: "/admin/attendance" },
        { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
        { icon: Users, label: "Alumni", href: "/admin/alumni" },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border-b border-yellow-500/10 sticky top-0 z-40">
                <div className="flex items-center justify-between px-6 py-4">
                    {/* Left: Menu Toggle + Logo (Mobile) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
                            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                                <Shield size={20} className="text-black" />
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-white">ADMIN</span>
                                <span className="text-xs text-gray-400">Panel</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Search (Hidden on Mobile) */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-6">
                        <div className="w-full relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-yellow-500/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/30 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right: Notifications + User */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Settings size={20} />
                        </button>
                        <div className="hidden sm:block w-px h-6 bg-white/10"></div>
                        <button
                            onClick={() => logout()}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`w-72 border-r border-yellow-500/10 bg-gradient-to-b from-zinc-900/80 to-black fixed h-[calc(100vh-73px)] z-50 overflow-y-auto transition-all duration-300 md:relative md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    {/* Navigation */}
                    <div className="py-8 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isActive
                                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-yellow-400 border border-yellow-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <item.icon size={20} className={isActive ? "text-yellow-400" : "group-hover:text-yellow-400 transition-colors"} />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-yellow-400"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Section */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-yellow-500/10 bg-gradient-to-t from-black to-transparent space-y-4">
                        <div className="px-4 py-3 bg-white/5 rounded-xl border border-yellow-500/10">
                            <User
                                name={user?.name || "Admin"}
                                description={user?.email}
                                avatarProps={{
                                    src: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`,
                                    className: "w-10 h-10"
                                }}
                                classNames={{
                                    name: "text-white",
                                    description: "text-gray-400 text-xs"
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 md:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
