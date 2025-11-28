"use client";

import { Card, CardBody, Spinner, Button, Chip, Progress } from "@nextui-org/react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { databases, Query } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { TrendingUp, Users, Calendar, FileText, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import Link from "next/link";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

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
            const [events, registrations, team, sponsors] = await Promise.all([
                databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(100)]),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS, [Query.orderDesc("$createdAt"), Query.limit(100)]),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAM_MEMBERS, [Query.limit(100)]),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.SPONSORS, [Query.limit(100)]),
            ]);

            const confirmedRegs = registrations.documents.filter((r: any) => r.status === "confirmed").length;
            const pendingRegs = registrations.documents.filter((r: any) => r.status === "pending").length;
            const checkedIn = registrations.documents.filter((r: any) => r.checkedIn).length;
            const activeEventsCount = events.documents.filter((e: any) => e.isActive).length;

            setStats({
                totalEvents: events.total,
                activeEvents: activeEventsCount,
                totalRegistrations: registrations.total,
                confirmedRegistrations: confirmedRegs,
                pendingRegistrations: pendingRegs,
                totalTeamMembers: team.total,
                totalSponsors: sponsors.total,
                checkedInCount: checkedIn,
            });

            setRecentRegistrations(registrations.documents.slice(0, 5));
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
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-400">Welcome back, {user?.name || "Admin"}!</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Events */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Total Events</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-blue-400">{stats.totalEvents}</p>
                                    <Chip size="sm" color="success" variant="flat">
                                        {stats.activeEvents} Active
                                    </Chip>
                                </div>
                            </div>
                            <Calendar size={32} className="text-blue-400 opacity-40" />
                        </div>
                    </CardBody>
                </Card>

                {/* Registrations */}
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Registrations</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-green-400">{stats.totalRegistrations}</p>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400">Confirmed</span>
                                        <span className="text-green-400 font-semibold">{stats.confirmedRegistrations}</span>
                                    </div>
                                    <Progress 
                                        value={confirmationRate} 
                                        className="h-1" 
                                        classNames={{ indicator: "bg-green-500" }}
                                    />
                                </div>
                            </div>
                            <Users size={32} className="text-green-400 opacity-40" />
                        </div>
                    </CardBody>
                </Card>

                {/* Check-ins */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Check-ins</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-purple-400">{stats.checkedInCount}</p>
                                    <Chip size="sm" variant="flat">
                                        {checkInRate}%
                                    </Chip>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400">Check-in Rate</span>
                                    </div>
                                    <Progress 
                                        value={checkInRate} 
                                        className="h-1" 
                                        classNames={{ indicator: "bg-purple-500" }}
                                    />
                                </div>
                            </div>
                            <CheckCircle size={32} className="text-purple-400 opacity-40" />
                        </div>
                    </CardBody>
                </Card>

                {/* Team & Sponsors */}
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 hover:border-orange-500/40 transition-all">
                    <CardBody className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400 mb-4">Organization</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Team Members</span>
                                        <span className="text-lg font-bold text-orange-400">{stats.totalTeamMembers}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Sponsors</span>
                                        <span className="text-lg font-bold text-orange-400">{stats.totalSponsors}</span>
                                    </div>
                                </div>
                            </div>
                            <BarChart3 size={32} className="text-orange-400 opacity-40" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-2 bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
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
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6">System Status</h2>
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
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Recent Registrations</h2>
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
