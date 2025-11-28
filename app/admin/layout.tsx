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
    QrCode
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
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 fixed h-full z-50">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-warning">
                        <Shield className="fill-warning text-warning" />
                        <span>ADMIN PANEL</span>
                    </Link>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? "bg-warning/10 text-warning font-semibold"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                    <div className="mb-4 px-2">
                        <User
                            name={user?.name || "Admin"}
                            description={user?.email}
                            avatarProps={{
                                src: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`,
                            }}
                        />
                    </div>
                    <Button
                        variant="flat"
                        color="danger"
                        className="w-full justify-start"
                        startContent={<LogOut size={18} />}
                        onPress={() => logout()}
                    >
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
