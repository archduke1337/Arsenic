"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
    Progress
} from "@nextui-org/react";
import { Download, Edit, Trash2, TrendingUp } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AdminScores() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [scores, setScores] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [committees, setCommittees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [selectedCommittee, setSelectedCommittee] = useState("all");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            fetchScoresForEvent(selectedEvent);
        }
    }, [selectedEvent]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventsRes, regsRes, comRes] = await Promise.all([
                fetch('/api/admin/events').then(r => r.json()),
                fetch('/api/admin/registrations').then(r => r.json()),
                fetch('/api/admin/committees').then(r => r.json()),
            ]);
            const eventsData = eventsRes.documents || eventsRes;
            const regsData = regsRes.documents || regsRes;
            const comData = comRes.documents || comRes;
            setEvents(eventsData);
            setRegistrations(regsData);
            setCommittees(comData);
            if (eventsData.length > 0) {
                setSelectedEvent(eventsData[0].$id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchScoresForEvent = async (eventId: string) => {
        try {
            const response = await fetch(`/api/admin/scores?eventId=${eventId}`);
            if (!response.ok) throw new Error('Failed to fetch scores');
            const data = await response.json();
            setScores(data.documents || data);
        } catch (error) {
            console.error("Error fetching scores:", error);
            toast.error("Failed to load scores");
        }
    };

    const getRegistrationName = (registrationId: string) => {
        return registrations.find(r => r.$id === registrationId)?.fullName || "Unknown";
    };

    const getCommitteeName = (committeeId: string) => {
        return committees.find(c => c.$id === committeeId)?.name || committeeId;
    };

    const getEventName = (eventId: string) => {
        return events.find(e => e.$id === eventId)?.name || eventId;
    };

    const deleteScore = async (scoreId: string) => {
        if (!confirm("Are you sure you want to delete this score?")) return;
        try {
            const response = await fetch(`/api/admin/scores?id=${scoreId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            toast.success("Score deleted");
            if (selectedEvent) fetchScoresForEvent(selectedEvent);
        } catch (error) {
            toast.error("Failed to delete score");
        }
    };

    const exportScoresCSV = () => {
        try {
            const headers = ["Rank", "Participant", "Committee", "Score", "Feedback"];
            const rankedScores = filteredScores.map((score, idx) => [
                idx + 1,
                getRegistrationName(score.registrationId),
                getCommitteeName(score.committeeId),
                score.score,
                score.feedback || ""
            ]);

            const csv = [
                headers.join(","),
                ...rankedScores.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `leaderboard_${selectedEvent}_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            toast.success("Leaderboard exported successfully");
        } catch (error) {
            toast.error("Failed to export");
        }
    };

    const filteredScores = scores.filter(score => {
        const matchesSearch = getRegistrationName(score.registrationId).toLowerCase().includes(searchText.toLowerCase());
        const matchesCommittee = selectedCommittee === "all" || score.committeeId === selectedCommittee;
        return matchesSearch && matchesCommittee;
    });

    const getLeaderboardRank = (index: number) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `${index + 1}`;
    };

    const calculateStats = () => {
        if (filteredScores.length === 0) return { avg: 0, max: 0, min: 0, total: 0 };
        const scores_arr = filteredScores.map(s => s.score);
        return {
            avg: Math.round(scores_arr.reduce((a, b) => a + b, 0) / scores_arr.length * 10) / 10,
            max: Math.max(...scores_arr),
            min: Math.min(...scores_arr),
            total: scores_arr.length
        };
    };

    const stats = calculateStats();

    return (
        <div className="space-y-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Scoring Dashboard</h1>
                    <p className="text-gray-500">Manage participant scores and leaderboards</p>
                </div>
                <Button
                    color="primary"
                    startContent={<Download size={20} />}
                    onClick={exportScoresCSV}
                    isDisabled={filteredScores.length === 0}
                >
                    Export Leaderboard
                </Button>
            </div>

            {/* Event Selection */}
            <Select
                label="Select Event"
                selectedKeys={[selectedEvent]}
                onSelectionChange={(keys) => setSelectedEvent(Array.from(keys)[0] as string)}
                className="max-w-sm"
            >
                {events.map((event) => (
                    <SelectItem key={event.$id} value={event.$id}>
                        {event.name}
                    </SelectItem>
                ))}
            </Select>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Total Participants Scored</p>
                        <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Average Score</p>
                        <p className="text-2xl font-bold text-green-500">{stats.avg}/100</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Highest Score</p>
                        <p className="text-2xl font-bold text-purple-500">{stats.max}/100</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Lowest Score</p>
                        <p className="text-2xl font-bold text-red-500">{stats.min}/100</p>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search by participant name..."
                    value={searchText}
                    onValueChange={setSearchText}
                    className="max-w-sm"
                />
                <Select
                    label="Filter by committee"
                    selectedKeys={[selectedCommittee]}
                    onSelectionChange={(keys) => setSelectedCommittee(Array.from(keys)[0] as string)}
                    className="max-w-sm"
                >
                    {(() => {
                        const items: any[] = [{ $id: "all", name: "All Committees" }];
                        return [...items, ...committees].map((committee) => (
                            <SelectItem key={committee.$id} value={committee.$id}>
                                {committee.name}
                            </SelectItem>
                        ));
                    })()}
                </Select>
            </div>

            {/* Leaderboard Table */}
            {loading ? (
                <div className="flex justify-center p-8">
                    <Spinner />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableColumn>RANK</TableColumn>
                        <TableColumn>PARTICIPANT</TableColumn>
                        <TableColumn>COMMITTEE</TableColumn>
                        <TableColumn>SCORE</TableColumn>
                        <TableColumn>SCORE VISUAL</TableColumn>
                        <TableColumn>FEEDBACK</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No scores found">
                        {filteredScores.map((score, idx) => (
                            <TableRow key={score.$id}>
                                <TableCell>
                                    <span className="text-xl font-bold">{getLeaderboardRank(idx)}</span>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {getRegistrationName(score.registrationId)}
                                </TableCell>
                                <TableCell>{getCommitteeName(score.committeeId)}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        color={score.score >= 80 ? "success" : score.score >= 60 ? "warning" : "danger"}
                                        variant="flat"
                                    >
                                        {score.score}/100
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="w-32">
                                        <Progress
                                            value={score.score}
                                            className="w-full"
                                            color={score.score >= 80 ? "success" : score.score >= 60 ? "warning" : "danger"}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">
                                        {score.feedback?.substring(0, 30)}...
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onClick={() => toast.info(`Feedback: ${score.feedback || "No feedback"}`)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onClick={() => deleteScore(score.$id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
