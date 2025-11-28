"use client";

import { useAuth } from "@/lib/auth-context";
import { Button, User } from "@nextui-org/react";
import { LayoutDashboard, FileText, Users, Download, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: FileText, label: "Submit Documents", href: "/dashboard/documents" },
        { icon: Users, label: "Networking", href: "/dashboard/networking" },
        { icon: Download, label: "Resources", href: "/dashboard/resources" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 fixed h-full z-50">
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                            AS
                        </div>
                        <span>ARSENIC</span>
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
                                    ? "bg-primary/10 text-primary font-semibold"
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
                            name={user?.name || "Delegate"}
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
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
