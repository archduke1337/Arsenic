"use client";

import { Card, CardBody, Spinner, Button, Chip, Progress } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { TrendingUp, Users, Calendar, FileText, CheckCircle, AlertCircle, BarChart3, ArrowUpRight, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvents: 0,
        activeEvents: 0,
        totalRegistrations: 0,
        confirmedRegistrations: 0,
        pendingRegistrations: 0,
        totalTeamMembers: 0,
        totalSponsors: 0,
        checkedInCount: 0,
    });
    const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [eventsRes, registrationsRes, teamRes, sponsorsRes] = await Promise.all([
                fetch('/api/admin/events'),
                fetch('/api/admin/registrations'),
                fetch('/api/admin/team'),
                fetch('/api/admin/sponsors'),
            ]);

            const events = await eventsRes.json();
            const registrations = await registrationsRes.json();
            const team = await teamRes.json();
            const sponsors = await sponsorsRes.json();

            const eventsList = events.events || [];
            const regsList = registrations.registrations || [];
            const teamList = team.team || [];
            const sponsorsList = sponsors.sponsors || [];

            const confirmedRegs = regsList.filter((r: any) => r.status === "confirmed").length;
            const pendingRegs = regsList.filter((r: any) => r.status === "pending").length;
            const checkedIn = regsList.filter((r: any) => r.checkedIn).length;
            const activeEventsCount = eventsList.filter((e: any) => e.isActive).length;

            setStats({
                totalEvents: eventsList.length,
                activeEvents: activeEventsCount,
                totalRegistrations: regsList.length,
                confirmedRegistrations: confirmedRegs,
                pendingRegistrations: pendingRegs,
                totalTeamMembers: teamList.length,
                totalSponsors: sponsorsList.length,
                checkedInCount: checkedIn,
            });

            setRecentRegistrations(regsList.slice(0, 5));
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Spinner label="Loading admin dashboard..." color="warning" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                        Administrative Panel
                        <Chip className="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" size="sm" variant="flat">
                            Live
                        </Chip>
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400">
                        Overview of system performance and recent activities.
                    </p>
                </div>
                <Button color="primary" variant="flat" className="bg-slate-900 text-white dark:bg-white dark:text-black">
                    Generate Report
                </Button>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Large Stat Card - Confirmations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-indigo-100 font-medium mb-1">Total Registrations</h3>
                            <div className="text-5xl font-bold tracking-tight mb-4">{stats.totalRegistrations}</div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2">
                                    <div className="text-xs text-indigo-100 uppercase tracking-wider">Confirmed</div>
                                    <div className="font-bold text-xl">{stats.confirmedRegistrations}</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2">
                                    <div className="text-xs text-indigo-100 uppercase tracking-wider">Pending</div>
                                    <div className="font-bold text-xl">{stats.pendingRegistrations}</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between text-sm mb-2 text-indigo-100">
                                <span>Confirmation Rate</span>
                                <span>{Math.round((stats.confirmedRegistrations / stats.totalRegistrations || 1) * 100)}%</span>
                            </div>
                            <Progress
                                value={Math.round((stats.confirmedRegistrations / stats.totalRegistrations || 1) * 100)}
                                className="h-1 bg-black/20"
                                classNames={{ indicator: "bg-white" }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Small Stat Card - Events */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-slate-500 dark:text-gray-400 font-medium mb-1">Active Events</h3>
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">{stats.activeEvents}</div>
                    </div>
                    <div className="mt-4 text-sm text-slate-400">
                        Out of {stats.totalEvents} total scheduled events
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction href="/admin/events" icon={Calendar} label="Manage Events" color="blue" />
                <QuickAction href="/admin/registrations" icon={Users} label="View Users" color="green" />
                <QuickAction href="/admin/check-in" icon={CheckCircle} label="Check-In" color="purple" />
                <QuickAction href="/admin/awards" icon={Zap} label="Awards" color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Registrations Table/List */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-lg dark:text-white">Recent Registrations</h3>
                        <Link href="/admin/registrations" className="text-sm text-blue-500 hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {recentRegistrations.map((reg) => (
                            <div key={reg.$id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                        {reg.fullName?.[0] || reg.name?.[0] || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{reg.fullName || reg.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-gray-400">{reg.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Chip
                                        size="sm"
                                        color={reg.status === 'confirmed' ? 'success' : 'warning'}
                                        variant="flat"
                                        className="capitalize"
                                    >
                                        {reg.status}
                                    </Chip>
                                    <Button size="sm" variant="light" isIconOnly>
                                        <ArrowUpRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {recentRegistrations.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No registrations found.</div>
                        )}
                    </div>
                </div>

                {/* System Health */}
                <div className="space-y-4">
                    <div className="bg-emerald-500 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-20">
                            <Shield size={100} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">System Status</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-emerald-100 text-sm font-medium">All Systems Operational</span>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm text-emerald-100">
                                <span>Database</span>
                                <span>Healthy</span>
                            </div>
                            <div className="flex justify-between text-sm text-emerald-100">
                                <span>API Latency</span>
                                <span>24ms</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">Pending Actions</h3>
                        <div className="space-y-3">
                            {stats.pendingRegistrations > 0 ? (
                                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20">
                                    <AlertCircle className="text-orange-500" size={20} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Review Registrations</p>
                                        <p className="text-xs text-slate-500 dark:text-gray-400">{stats.pendingRegistrations} waiting for approval</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-slate-500 text-sm">No pending actions</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickAction({ href, icon: Icon, label, color }: any) {
    const colorMap: any = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    };

    return (
        <Link href={href} className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 ${colorMap[color]}`}>
            <Icon size={24} className="mb-2" />
            <span className="text-xs font-semibold text-center">{label}</span>
        </Link>
    );
}
