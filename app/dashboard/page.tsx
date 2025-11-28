
"use client";

import { Card, CardBody, Chip, Button } from "@heroui/react";
import { AlertCircle, Download, MapPin } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();

    // TODO: Fetch from Appwrite
    const allocation: any = null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome back, {user?.name?.split(" ")[0]}!</h1>
                <p className="text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening with your participation.</p>
            </div>

            {/* Allocation Card */}
            {/* Allocation Card */}
            {allocation ? (
                <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none shadow-xl">
                    <CardBody className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <Chip className="bg-white/20 text-white border-none mb-4" variant="flat">
                                    {allocation.event}
                                </Chip>
                                <h2 className="text-4xl font-bold mb-2">{allocation.portfolio}</h2>
                                <div className="flex items-center gap-2 text-blue-100 text-lg">
                                    <MapPin size={20} />
                                    <span>{allocation.committee}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[150px] text-center">
                                <div className="text-3xl font-bold mb-1">{allocation.daysLeft}</div>
                                <div className="text-xs uppercase tracking-wider opacity-80">Days to Go</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Card className="bg-default-100 dark:bg-zinc-900 border-0 shadow-none">
                    <CardBody className="p-8 text-center">
                        <h2 className="text-xl font-bold mb-2 dark:text-white">No Allocation Yet</h2>
                        <p className="text-gray-500 dark:text-gray-400">Your committee and portfolio allocation will appear here once assigned. Check back after the event begins.</p>
                    </CardBody>
                </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Tasks / Status */}
                <Card className="dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white flex items-center gap-2">
                            <AlertCircle size={20} className="text-primary" />
                            Action Items
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="line-through text-gray-500 dark:text-gray-400">Registration Complete</span>
                                </div>
                                <Chip size="sm" color="success" variant="flat">Done</Chip>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-warning" />
                                    <span className="dark:text-white">Prepare for Event</span>
                                </div>
                                <Button size="sm" color="primary" variant="flat">View</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Resources */}
                <Card className="dark:bg-zinc-900">
                    <CardBody className="p-6">
                        <h3 className="font-bold text-lg mb-4 dark:text-white">Resources</h3>
                        <div className="space-y-3">
                            <a href="/faqs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <AlertCircle className="text-blue-600 dark:text-blue-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">FAQs</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Common questions answered</p>
                                </div>
                            </a>
                            <a href="/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <AlertCircle className="text-green-600 dark:text-green-400" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium dark:text-white">Contact Us</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Get support</p>
                                </div>
                            </a>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
