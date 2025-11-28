"use client";

import { useAuth } from "@/lib/auth-context";
import { Button, User } from "@nextui-org/react";
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
    Ticket
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, logout, isAdmin } = useAuth();
    const pathname = usePathname();

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="text-center">
                    <Shield size={64} className="mx-auto text-danger mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
                    <p className="text-gray-500 mb-6">You do not have permission to view this page.</p>
                    <Button as={Link} href="/" color="primary">Go Home</Button>
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
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-72 hidden md:flex flex-col border-r border-yellow-500/10 bg-gradient-to-b from-zinc-900 to-black fixed h-full z-50 overflow-y-auto">
                {/* Logo Section */}
                <div className="p-6 border-b border-yellow-500/10 sticky top-0 bg-gradient-to-b from-zinc-900 to-black/80">
                    <Link href="/admin" className="flex items-center gap-3 font-bold text-xl hover:text-yellow-400 transition-colors group">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all">
                            <Shield size={24} className="text-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white">ADMIN</span>
                            <span className="text-xs text-gray-400 font-normal">Control Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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
                <div className="p-4 border-t border-yellow-500/10 space-y-4">
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
                    <Button
                        fullWidth
                        variant="flat"
                        color="danger"
                        className="justify-start"
                        startContent={<LogOut size={18} />}
                        onPress={() => logout()}
                    >
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
