"use client";

import { Card, CardBody, Spinner, Button, Chip, Progress } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { COLLECTIONS } from "@/lib/schema";
import { TrendingUp, Users, Calendar, FileText, CheckCircle, AlertCircle, BarChart3, Home, Zap, Activity } from "lucide-react";
import Link from "next/link";

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

    const checkInRate = stats.totalRegistrations > 0 
        ? Math.round((stats.checkedInCount / stats.totalRegistrations) * 100) 
        : 0;

    const confirmationRate = stats.totalRegistrations > 0 
        ? Math.round((stats.confirmedRegistrations / stats.totalRegistrations) * 100) 
        : 0;

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <Spinner label="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <FileText size={16} />
                    Home
                </Link>
                <span className="text-gray-600">/</span>
                <span className="text-yellow-400 font-medium">Dashboard</span>
            </div>

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-gray-400 text-lg">Welcome back, <span className="text-yellow-400 font-semibold">{user?.name || "Admin"}</span>! Here's your event overview.</p>
            </div>

            {/* Executive Summary Card */}
            <Card className="bg-gradient-to-r from-yellow-900/30 via-orange-900/20 to-red-900/30 border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
                <CardBody className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                                <Users size={32} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Registrations</p>
                                <p className="text-3xl font-bold text-blue-400">{stats.totalRegistrations}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                                <CheckCircle size={32} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Confirmed</p>
                                <p className="text-3xl font-bold text-green-400">{stats.confirmedRegistrations}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-xl">
                                <Activity size={32} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Checked In</p>
                                <p className="text-3xl font-bold text-purple-400">{stats.checkedInCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl">
                                <Calendar size={32} className="text-orange-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Active Events</p>
                                <p className="text-3xl font-bold text-orange-400">{stats.activeEvents}/{stats.totalEvents}</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Events */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-300" />
                    <Card className="relative bg-black border border-blue-500/50 hover:border-blue-400 transition-all">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400 mb-1">Total Events</p>
                                    <p className="text-4xl font-black text-blue-400">{stats.totalEvents}</p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                                    <Calendar size={28} className="text-blue-400" />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10">
                                <Chip size="sm" color="success" className="bg-green-500/20 text-green-300">
                                    {stats.activeEvents} Active
                                </Chip>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Registrations */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-300" />
                    <Card className="relative bg-black border border-green-500/50 hover:border-green-400 transition-all">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400 mb-1">Registrations</p>
                                    <p className="text-4xl font-black text-green-400">{stats.totalRegistrations}</p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                                    <Users size={28} className="text-green-400" />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Confirmation Rate</span>
                                    <span className="text-green-400 font-bold">{confirmationRate}%</span>
                                </div>
                                <Progress 
                                    value={confirmationRate} 
                                    className="h-2" 
                                    classNames={{ indicator: "bg-gradient-to-r from-green-500 to-green-400" }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Check-ins */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-300" />
                    <Card className="relative bg-black border border-purple-500/50 hover:border-purple-400 transition-all">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400 mb-1">Check-ins</p>
                                    <p className="text-4xl font-black text-purple-400">{stats.checkedInCount}</p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                                    <CheckCircle size={28} className="text-purple-400" />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-white/10 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Check-in Rate</span>
                                    <span className="text-purple-400 font-bold">{checkInRate}%</span>
                                </div>
                                <Progress 
                                    value={checkInRate} 
                                    className="h-2" 
                                    classNames={{ indicator: "bg-gradient-to-r from-purple-500 to-purple-400" }}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Team & Sponsors */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-300" />
                    <Card className="relative bg-black border border-orange-500/50 hover:border-orange-400 transition-all">
                        <CardBody className="p-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400 mb-1">Organization</p>
                                    <div className="flex gap-4 mt-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Team</p>
                                            <p className="text-2xl font-bold text-orange-400">{stats.totalTeamMembers}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Sponsors</p>
                                            <p className="text-2xl font-bold text-orange-300">{stats.totalSponsors}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                                    <TrendingUp size={28} className="text-orange-400" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-white/20 transition-all">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-yellow-400">⚡ Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/admin/events">
                                <Button
                                    fullWidth
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-20 text-lg font-semibold"
                                    startContent={<Calendar size={20} />}
                                >
                                    Manage Events
                                </Button>
                            </Link>
                            <Link href="/admin/registrations">
                                <Button
                                    fullWidth
                                    className="bg-gradient-to-r from-green-600 to-green-700 h-20 text-lg font-semibold"
                                    startContent={<Users size={20} />}
                                >
                                    View Registrations
                                </Button>
                            </Link>
                            <Link href="/admin/check-in">
                                <Button
                                    fullWidth
                                    className="bg-gradient-to-r from-purple-600 to-purple-700 h-20 text-lg font-semibold"
                                    startContent={<CheckCircle size={20} />}
                                >
                                    Check-In Station
                                </Button>
                            </Link>
                            <Link href="/admin/awards">
                                <Button
                                    fullWidth
                                    className="bg-gradient-to-r from-orange-600 to-orange-700 h-20 text-lg font-semibold"
                                    startContent={<TrendingUp size={20} />}
                                >
                                    Manage Awards
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>

                {/* Pending Items */}
                <Card className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-white/20 transition-all">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-yellow-400">📊 System Status</h2>
                        <div className="space-y-4">
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">Pending Confirmations</p>
                                        <p className="text-2xl font-bold text-yellow-400">{stats.pendingRegistrations}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <FileText size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">Active Events</p>
                                        <p className="text-2xl font-bold text-blue-400">{stats.activeEvents}/{stats.totalEvents}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Recent Registrations */}
            {recentRegistrations.length > 0 && (
                <Card className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/10 hover:border-white/20 transition-all">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-yellow-400">🔔 Recent Registrations</h2>
                        <div className="space-y-3">
                            {recentRegistrations.map((reg) => (
                                <div key={reg.$id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold">{reg.fullName || reg.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-400">{reg.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Chip 
                                                size="sm" 
                                                color={reg.status === 'confirmed' ? 'success' : reg.status === 'pending' ? 'warning' : 'default'}
                                                variant="flat"
                                            >
                                                {reg.status}
                                            </Chip>
                                            {reg.paymentStatus === 'paid' && (
                                                <Chip size="sm" color="success" variant="flat">
                                                    Paid
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
