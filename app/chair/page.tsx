"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Chip, Progress } from "@nextui-org/react";
import { Users, ClipboardCheck, Trophy, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { toast, Toaster } from "sonner";

export default function ChairDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDelegates: 0,
        presentToday: 0,
        markedScores: 0,
        pendingScores: 0
    });
    const [loading, setLoading] = useState(true);
    const [committeeName, setCommitteeName] = useState("");

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/chair/stats");
            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("You are not authorized as a chairperson");
                    return;
                }
                throw new Error("Failed to fetch stats");
            }

            const data = await res.json();
            setStats({
                totalDelegates: data.stats.totalDelegates,
                presentToday: data.stats.presentToday,
                markedScores: data.stats.scoredDelegates,
                pendingScores: data.stats.pendingScores
            });
            setCommitteeName(data.committee.name);

        } catch (error) {
            console.error("Error fetching dashboard:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
                <CardSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Here's what's happening in <span className="text-yellow-400 font-semibold">{committeeName}</span> today.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-white/10">
                    <Clock size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Delegates"
                    value={stats.totalDelegates}
                    icon={Users}
                    color="blue"
                    trend="+2 new"
                />
                <StatCard
                    title="Present Today"
                    value={stats.presentToday}
                    icon={ClipboardCheck}
                    color="green"
                    subtext={`${Math.round((stats.presentToday / (stats.totalDelegates || 1)) * 100)}% attendance`}
                />
                <StatCard
                    title="Scores Marked"
                    value={stats.markedScores}
                    icon={Trophy}
                    color="purple"
                    subtext={`${stats.pendingScores} pending`}
                />
                <StatCard
                    title="Session Day"
                    value="Day 1"
                    icon={Calendar}
                    color="orange"
                    subtext="Session 2 in progress"
                />
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Progress Section */}
                <Card className="bg-zinc-900/50 border border-white/10 lg:col-span-2">
                    <CardBody className="p-6 space-y-6">
                        <h3 className="text-xl font-bold">Committee Progress</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Attendance Marking</span>
                                    <span className="text-green-400">80%</span>
                                </div>
                                <Progress value={80} color="success" className="h-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Scoring Submission</span>
                                    <span className="text-purple-400">40%</span>
                                </div>
                                <Progress value={40} color="secondary" className="h-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Session Time Elapsed</span>
                                    <span className="text-yellow-400">65%</span>
                                </div>
                                <Progress value={65} color="warning" className="h-2" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Next Session Info */}
                <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10">
                    <CardBody className="p-6 flex flex-col justify-between h-full space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Next Session</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Topic</p>
                                    <p className="font-medium">Global Economic Crisis & Recovery</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-400">Start Time</p>
                                        <p className="font-bold text-lg">14:00 PM</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Duration</p>
                                        <p className="font-bold text-lg">2h 30m</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Chip color="warning" variant="flat" className="w-full justify-center">
                            Moderated Caucus
                        </Chip>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, subtext, trend }: any) {
    const colors: any = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colors[color]}`}>
                        <Icon size={20} />
                    </div>
                    {trend && (
                        <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                            {trend}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h4 className="text-2xl font-bold mt-1">{value}</h4>
                    {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
                </div>
            </CardBody>
        </Card>
    );
}
