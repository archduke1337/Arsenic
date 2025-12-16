"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardBody, Chip, Button, Spinner, Progress } from "@nextui-org/react";
import { AlertCircle, Download, MapPin, BookOpen, Users, Calendar, Trophy, ArrowUpRight, Clock, Fingerprint, RefreshCcw, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AllocationData {
    committeeId: string;
    committee: string;
    portfolio: string;
    event: string;
    status: string;
    daysLeft: number;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [allocation, setAllocation] = useState<AllocationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registration, setRegistration] = useState<any>(null);

    useEffect(() => {
        if (user?.email) {
            fetchUserData();
        }
    }, [user?.email]);

    const fetchUserData = async () => {
        try {
            const res = await fetch("/api/user/dashboard");
            if (!res.ok) {
                if (res.status === 401) {
                    return;
                }
                throw new Error("Failed to fetch dashboard");
            }

            const data = await res.json();
            setRegistration(data.registration);
            setAllocation(data.allocation);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner label="Loading details..." color="primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">Hello, {user?.name?.split(" ")[0] || "Delegate"}!</h1>
                    <p className="text-slate-500 dark:text-gray-400">Explore your allocation and activity for the conference.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Days Left"
                    value={allocation?.daysLeft || "0"}
                    icon={Clock}
                    trend="On Track"
                    color="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    label="Event Status"
                    value={allocation?.status === "confirmed" ? "Active" : "Pending"}
                    icon={Trophy}
                    trend="Verified"
                    color="text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    label="Committee"
                    value={allocation?.committee.split(" ")[0] || "None"}
                    icon={Users}
                    trend="Assigned"
                    color="text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    label="Payment"
                    value={registration?.paymentStatus === 'completed' ? "Paid" : "Due"}
                    icon={RefreshCcw}
                    trend="Secure"
                    color="text-indigo-600 dark:text-indigo-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Delegate Pass / Allocation Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Fingerprint className="text-blue-500" size={20} />
                        Delegate Pass
                    </h2>

                    {/* Glassmorphism Credit Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full aspect-[1.8] md:aspect-[2.2] rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500"
                    >
                        {/* Abstract Background */}
                        <div className="absolute inset-0 bg-slate-900 dark:bg-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-emerald-600/20" />
                            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/20 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative h-full flex flex-col justify-between p-8 md:p-10 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-white/60 text-sm font-medium tracking-wider mb-1">EVENT PASS</div>
                                    <div className="text-2xl font-bold tracking-tight">ARSENIC</div>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Fingerprint size={24} className="text-white/80" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-8 rounded bg-yellow-400/90 shadow-lg" /> {/* Chip */}
                                    {allocation?.status === 'confirmed' && <div className="text-emerald-400 font-mono text-sm flex items-center gap-1">● ACTIVE</div>}
                                </div>

                                <div className="space-y-1">
                                    <div className="text-3xl md:text-4xl font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 shadow-sm">
                                        {allocation?.portfolio || "ALLOCATION PENDING"}
                                    </div>
                                    <div className="text-white/60 font-medium flex items-center gap-2">
                                        <span>{allocation?.committee || "Register for Allocation"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">DELEGATE</div>
                                    <div className="font-medium text-lg">{user?.name?.toUpperCase()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">EXPIRY</div>
                                    <div className="font-mono text-lg">12/25</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Activity Stats for Dashboard */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                            <div className="text-slate-500 dark:text-gray-400 text-sm mb-2">Registration</div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {registration ? "90%" : "0%"}
                                </span>
                                <span className="text-emerald-500 text-xs mb-1 font-medium">+ Updated</span>
                            </div>
                            <Progress
                                value={registration ? 90 : 0}
                                className="mt-3"
                                color={registration ? "success" : "default"}
                                size="sm"
                            />
                        </div>
                        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5">
                            <div className="text-slate-500 dark:text-gray-400 text-sm mb-2">Resources</div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">3</span>
                                <span className="text-blue-500 text-xs mb-1 font-medium">Available</span>
                            </div>
                            <Progress value={60} className="mt-3" color="primary" size="sm" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Feed & Actions */}
                <div className="space-y-8">
                    {/* Action Center */}
                    <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/5">
                        <h3 className="font-bold text-lg mb-6 dark:text-white flex items-center justify-between">
                            <span>Activity</span>
                            <Button size="sm" variant="light" isIconOnly><ArrowUpRight size={18} /></Button>
                        </h3>

                        <div className="space-y-6">
                            <ActivityItem
                                icon={AlertCircle}
                                color="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"
                                title="Registration Payment"
                                desc={registration?.paymentStatus === 'completed' ? "Completed on Oct 24" : "Pending Action"}
                                amount={registration?.paymentStatus === 'completed' ? "Done" : "Due"}
                            />
                            <ActivityItem
                                icon={MapPin}
                                color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                title="Committee Allocation"
                                desc={allocation ? "Assigned" : "Waiting for assignment"}
                                amount={allocation ? "1" : "-"}
                            />
                            <ActivityItem
                                icon={BookOpen}
                                color="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                                title="Background Guide"
                                desc="Study material released"
                                amount="View"
                            />
                        </div>

                        <Button className="w-full mt-6 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold" size="lg">
                            View All Activity
                        </Button>
                    </div>

                    {/* Resources Mini */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Download size={100} />
                        </div>
                        <h3 className="font-bold text-xl mb-2 relative z-10">Need Help?</h3>
                        <p className="text-emerald-100 mb-6 relative z-10 text-sm">Download the delegate handbook and resources before the event.</p>
                        <Button className="bg-white text-emerald-600 font-semibold relative z-10" size="sm">
                            Download Resources
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
    return (
        <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${color.replace('text', 'bg')}/10 ${color}`}>
                    <Icon size={20} />
                </div>
                <Chip size="sm" variant="flat" classNames={{ base: "bg-slate-100 dark:bg-white/10", content: "text-slate-500 dark:text-gray-400 text-xs font-semibold" }}>
                    {trend}
                </Chip>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
            <div className="text-slate-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</div>
        </div>
    )
}

function ActivityItem({ icon: Icon, color, title, desc, amount }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                </div>
                <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{title}</div>
                    <div className="text-slate-500 dark:text-gray-400 text-xs">{desc}</div>
                </div>
            </div>
            <div className="font-medium text-slate-900 dark:text-white text-sm">{amount}</div>
        </div>
    )
}

