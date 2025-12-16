"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input,
    User, Spinner, Tabs, Tab
} from "@nextui-org/react";
import { Save } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query, ID } from "appwrite";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

// Scoring criteria based on committee type (could be dynamic)
const CRITERIA = [
    { id: "research", label: "Research & Content", max: 10 },
    { id: "oratory", label: "Oratory & Delivery", max: 10 },
    { id: "conduct", label: "Conduct & Diplomatic Courtesy", max: 10 },
    { id: "rebuttal", label: "Rebuttal & Answers", max: 10 },
];

export default function ScoringSheet() {
    const [delegates, setDelegates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [selectedSession, setSelectedSession] = useState("session1");
    const [committeeName, setCommitteeName] = useState<string>("");

    useEffect(() => {
        fetchDelegates();
    }, []);

    const fetchDelegates = async () => {
        try {
            // Get chair's assigned committee from user profile
            // TODO: Fetch actual committee assignment
            
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.REGISTRATIONS,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            
            // Filter by chair's committee when assignment is available
            setDelegates(response.documents);

            // Initialize scores structure
            const initialScores: any = {};
            response.documents.forEach(d => {
                initialScores[d.$id] = {};
                CRITERIA.forEach(c => {
                    initialScores[d.$id][c.id] = 0;
                });
            });
            setScores(initialScores);

        } catch (error) {
            console.error("Error fetching delegates:", error);
            toast.error("Failed to fetch delegates");
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (delegateId: string, criteriaId: string, value: number) => {
        setScores(prev => ({
            ...prev,
            [delegateId]: {
                ...prev[delegateId],
                [criteriaId]: value
            }
        }));
    };

    const calculateTotal = (delegateId: string) => {
        if (!scores[delegateId]) return 0;
        return Object.values(scores[delegateId]).reduce((a, b) => a + b, 0);
    };

    const saveScores = async () => {
        setSaving(true);
        try {
            // In production, save to SCORES collection
            // const promises = Object.entries(scores).map(([delegateId, scoreData]) => {
            //     return databases.createDocument(DATABASE_ID, COLLECTIONS.SCORES, ID.unique(), {
            //         delegate: delegateId,
            //         session: selectedSession,
            //         scores: JSON.stringify(scoreData),
            //         total: calculateTotal(delegateId),
            //         remarks: remarks[delegateId]
            //     });
            // });
            // await Promise.all(promises);

            const submissions = Object.entries(scores).map(async ([delegateId, scoreData]) => {
                const total = calculateTotal(delegateId);
                const delegate = delegates.find(d => d.$id === delegateId);

                if (!delegate) return;

                const payload = {
                    registrationId: delegateId,
                    eventId: delegate.eventId,
                    committeeId: delegate.assignedCommittee || delegate.committeeId || delegate.committee || "general",
                    score: total,
                    feedback: remarks[delegateId] || "",
                };

                const res = await fetch("/api/scoring/leaderboard", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Failed to submit score");
                }
            });

            await Promise.all(submissions);
            toast.success("Scores submitted successfully");
        } catch (error) {
            console.error("Error saving scores:", error);
            toast.error("Failed to submit scores");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Spinner color="warning" /></div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Scoring Sheet</h1>
                    <p className="text-gray-400">Evaluate delegates for {committeeName}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Tabs
                        selectedKey={selectedSession}
                        onSelectionChange={(k) => setSelectedSession(k as string)}
                        color="warning"
                        variant="bordered"
                    >
                        <Tab key="session1" title="Session 1" />
                        <Tab key="session2" title="Session 2" />
                        <Tab key="session3" title="Session 3" />
                    </Tabs>
                    <Button
                        color="primary"
                        startContent={<Save size={18} />}
                        onClick={saveScores}
                        isLoading={saving}
                    >
                        Submit Scores
                    </Button>
                </div>
            </div>

            <Card className="bg-zinc-900/50 border border-white/10">
                <CardBody className="p-0 overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-zinc-800/50">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-gray-300">DELEGATE</th>
                                {CRITERIA.map(c => (
                                    <th key={c.id} className="text-center p-4 text-sm font-semibold text-gray-300">
                                        {c.label.toUpperCase()}
                                    </th>
                                ))}
                                <th className="text-center p-4 text-sm font-semibold text-gray-300">TOTAL</th>
                                <th className="text-left p-4 text-sm font-semibold text-gray-300">REMARKS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {delegates.length === 0 ? (
                                <tr>
                                    <td colSpan={CRITERIA.length + 3} className="text-center p-8 text-gray-500">
                                        No delegates found
                                    </td>
                                </tr>
                            ) : (
                                delegates.map((delegate) => (
                                    <tr key={delegate.$id} className="border-t border-white/10 hover:bg-white/5">
                                        <td className="p-4">
                                            <div className="min-w-[200px]">
                                                <User
                                                    name={delegate.name}
                                                    description={delegate.portfolio || "Delegate"}
                                                    avatarProps={{
                                                        name: delegate.name,
                                                        size: "sm",
                                                        className: "bg-zinc-800 text-white"
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        {CRITERIA.map(c => (
                                            <td key={c.id} className="p-4">
                                                <div className="w-24 mx-auto">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={c.max}
                                                        size="sm"
                                                        value={scores[delegate.$id]?.[c.id]?.toString() || "0"}
                                                        onChange={(e) => {
                                                            const val = Math.min(Math.max(0, Number(e.target.value)), c.max);
                                                            handleScoreChange(delegate.$id, c.id, val);
                                                        }}
                                                        classNames={{ input: "text-center" }}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-4">
                                            <div className="text-center font-bold text-lg text-yellow-400">
                                                {calculateTotal(delegate.$id)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Input
                                                placeholder="Notes..."
                                                size="sm"
                                                value={remarks[delegate.$id] || ""}
                                                onChange={(e) => setRemarks(prev => ({ ...prev, [delegate.$id]: e.target.value }))}
                                                className="min-w-[150px]"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}
