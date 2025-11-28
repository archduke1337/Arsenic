"use client";

import { Card, CardBody, Spinner } from "@heroui/react";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        totalTeamMembers: 0,
        totalSponsors: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [events, registrations, team, sponsors] = await Promise.all([
                databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.TEAM_MEMBERS),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.SPONSORS),
            ]);

            setStats({
                totalEvents: events.total,
                totalRegistrations: registrations.total,
                totalTeamMembers: team.total,
                totalSponsors: sponsors.total
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Total Events", value: stats.totalEvents.toString(), color: "bg-blue-500" },
        { label: "Registrations", value: stats.totalRegistrations.toString(), color: "bg-green-500" },
        { label: "Team Members", value: stats.totalTeamMembers.toString(), color: "bg-purple-500" },
        { label: "Sponsors", value: stats.totalSponsors.toString(), color: "bg-orange-500" },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <Spinner label="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name || "Admin"}!</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <Card key={stat.label}>
                            <CardBody className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg opacity-20`}></div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="/admin/events"
                                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Events</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Create and edit events</p>
                            </a>
                            <a
                                href="/admin/registrations"
                                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">View Registrations</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">See all registrations</p>
                            </a>
                            <a
                                href="/admin/team"
                                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Team</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Update team members</p>
                            </a>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
