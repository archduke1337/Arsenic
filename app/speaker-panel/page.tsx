"use client";

import { Card, CardBody, Button, User, Chip, Progress, Spinner } from "@nextui-org/react";
import { CheckCircle, Clock, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function SpeakerPanel() {
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
        fetchSessionData();
    }, []);

    const fetchSessionData = async () => {
        try {
            // Fetch active session data from Appwrite
            // Implementation to be completed
            setSessionData(null);
        } catch (error) {
            console.error("Error fetching session data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex items-center justify-center">
                <Spinner label="Loading session..." />
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex items-center justify-center">
                <Card>
                    <CardBody className="p-8">
                        <p className="text-center text-gray-500">No active session. Speaker panel features coming soon.</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="text-primary" />
                            Speaker&apos;s Panel
                        </h1>
                        <p className="text-gray-500">Committee Session Management</p>
                    </div>
                    <div className="flex gap-2">
                        <Button color="danger" variant="flat" isDisabled>End Session</Button>
                        <Button color="primary" isDisabled>Mark Attendance</Button>
                    </div>
                </header>

                <Card>
                    <CardBody className="p-8">
                        <p className="text-center text-gray-500">Speaker panel integration coming soon. Please check back later.</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
