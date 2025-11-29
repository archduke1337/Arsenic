"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Card, CardBody, Chip, Button, Spinner, Progress } from "@nextui-org/react";
import { AlertCircle, Download, MapPin, BookOpen, Users, Calendar, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

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
            // Fetch registration data
            const regResponse = await databases.listDocuments(
                DATABASE_ID,
                "Registrations",
                [Query.equal("email", user?.email || "")]
            );

            if (regResponse.documents.length > 0) {
                const reg = regResponse.documents[0];
                setRegistration(reg);

                // Try to fetch allocation if available
                if (reg.committeeId) {
                    const allocationData: AllocationData = {
                        committeeId: reg.committeeId || "",
                        committee: reg.committee || "TBA",
                        portfolio: reg.portfolio || "TBA",
                        event: reg.eventType || "MUN",
                        status: reg.allocationStatus || "pending",
                        daysLeft: 5, // Calculate based on event date
                    };
                    setAllocation(allocationData);
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name?: string): string => {
        if (!name) return "D";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner label="Loading your dashboard..." />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 dark:text-white">
                    Welcome back, {user?.name?.split(" ")[0] || "Delegate"}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Here&apos;s what&apos;s happening with your participation.
                </p>
            </div>

            {/* Allocation Card */}
            {allocation ? (
                <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none shadow-xl">
                    <CardBody className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <Chip className="bg-white/20 text-white border-none mb-4" variant="flat">
                                    {allocation.event}
                                </Chip>
                                <h2 className="text-4xl font-bold mb-2">{allocation.portfolio}</h2>
                                <div className="flex items-center gap-2 text-blue-100 text-lg">
                                    <MapPin size={20} />
                                    <span>{allocation.committee}</span>
                                </div>
                                {allocation.status === "pending" && (
                                    <p className="text-blue-100 text-sm mt-3">
                                        Allocation pending. Check back soon!
                                    </p>
                                )}
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[150px] text-center">
                                <div className="text-3xl font-bold mb-1">{allocation.daysLeft}</div>
                                <div className="text-xs uppercase tracking-wider opacity-80">Days to Event</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-zinc-900 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <CardBody className="p-8 text-center">
                        <Trophy size={48} className="mx-auto mb-4 text-blue-500 opacity-50" />
                        <h2 className="text-2xl font-bold mb-2 dark:text-white">Allocation Coming Soon</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your committee and portfolio allocation will appear here once the organizers assign you.
                            This typically happens after registration closes.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            💡 Tip: Check your email for allocation notifications
                        </p>
                    </CardBody>
                </Card>
            )}

            {/* Registration Status */}
            {registration && (
                <Card className="dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                            <Calendar size={20} className="text-primary" />
                            Registration Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="dark:text-gray-300">Registration Confirmed</span>
                                <Chip size="sm" color="success" variant="flat">
                                    ✓ Complete
                                </Chip>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="dark:text-gray-300">Event: {registration.eventType || "TBA"}</span>
                                <Chip size="sm" color="primary" variant="flat">
                                    Selected
                                </Chip>
                            </div>
                            {registration.paymentStatus === "completed" && (
                                <div className="flex items-center justify-between">
                                    <span className="dark:text-gray-300">Payment Status</span>
                                    <Chip size="sm" color="success" variant="flat">
                                        Paid
                                    </Chip>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Action Items */}
                <Card className="dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                            <AlertCircle size={20} className="text-primary" />
                            Action Items
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="dark:text-gray-300">Registration Complete</span>
                                </div>
                                <Chip size="sm" color="success" variant="flat">
                                    Done
                                </Chip>
                            </div>
                            {!allocation && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                        <span className="dark:text-gray-300">Waiting for Allocation</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="dark:text-gray-300">Review Background Guide</span>
                                </div>
                                <Button size="sm" color="primary" variant="flat">
                                    View
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Resources */}
                <Card className="dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                            <BookOpen size={20} className="text-primary" />
                            Resources
                        </h3>
                        <div className="space-y-3">
                            <a
                                href="/faqs"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <AlertCircle className="text-blue-600 dark:text-blue-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">FAQs</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Common questions answered</p>
                                </div>
                            </a>
                            <a
                                href="/committees"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Users className="text-purple-600 dark:text-purple-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Committees</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Committee details & portfolios</p>
                                </div>
                            </a>
                            <a
                                href="/contact"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Download className="text-green-600 dark:text-green-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Contact Us</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Get help & support</p>
                                </div>
                            </a>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
