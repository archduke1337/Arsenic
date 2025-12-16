"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input,
    User, Spinner, Tabs, Tab
} from "@nextui-org/react";
import { Save } from "lucide-react";
import { toast, Toaster } from "sonner";

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
            const res = await fetch("/api/chair/delegates");
            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("You are not authorized as a chairperson");
                    return;
                }
                throw new Error("Failed to fetch delegates");
            }

            const data = await res.json();
            setDelegates(data.delegates);
            setCommitteeName(data.committee?.name || "");

            // Initialize scores structure
            const initialScores: Record<string, Record<string, number>> = {};
            data.delegates.forEach((d: any) => {
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
            // Build scores array for API
            const scoresArray = Object.entries(scores).map(([delegateId, criteriaScores]) => {
                const delegate = delegates.find(d => d.$id === delegateId);
                return {
                    registrationId: delegateId,
                    eventId: delegate?.eventId || "",
                    committeeId: delegate?.assignedCommittee || "",
                    criteriaScores,
                    total: calculateTotal(delegateId),
                    remarks: remarks[delegateId] || "",
                };
            });

            const res = await fetch("/api/chair/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scores: scoresArray, session: selectedSession }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to submit scores");
            }

            const result = await res.json();
            toast.success(`Scores submitted for ${result.results.length} delegates`);
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
                                                    name={delegate.fullName || delegate.name}
                                                    description={delegate.assignedPortfolio || "Delegate"}
                                                    avatarProps={{
                                                        name: delegate.fullName || delegate.name,
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
