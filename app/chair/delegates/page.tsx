"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    User, Chip
} from "@nextui-org/react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { toast, Toaster } from "sonner";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";

export default function DelegateList() {
    const [delegates, setDelegates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);
    const [committeeName, setCommitteeName] = useState<string>("");
    const [eventId, setEventId] = useState<string>("");

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
            
            // Get eventId from first delegate if available
            if (data.delegates.length > 0) {
                setEventId(data.delegates[0].eventId || "");
            }

            // Initialize attendance from checkedIn status
            const initialAttendance: Record<string, boolean> = {};
            data.delegates.forEach((d: any) => {
                initialAttendance[d.$id] = d.checkedIn === true;
            });
            setAttendance(initialAttendance);
        } catch (error) {
            console.error("Error fetching delegates:", error);
            toast.error("Failed to load delegates");
        } finally {
            setLoading(false);
        }
    };

    const filteredDelegates = useMemo(() => {
        return delegates.filter(d =>
            d.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.assignedPortfolio?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [delegates, searchQuery]);

    const toggleAttendance = (id: string) => {
        setAttendance(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const saveAttendance = async () => {
        setSaving(true);
        try {
            // Get list of present delegates
            const presentIds = Object.entries(attendance)
                .filter(([_, isPresent]) => isPresent)
                .map(([id]) => id);

            const res = await fetch("/api/chair/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationIds: presentIds,
                    eventId: eventId,
                    status: "present"
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to save attendance");
            }

            const result = await res.json();
            toast.success(`Attendance saved for ${result.results.length} delegates`);
        } catch (error) {
            console.error("Error saving attendance:", error);
            toast.error("Failed to save attendance");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto">
                <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse mb-4"></div>
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Delegate Management</h1>
                    <p className="text-gray-400">Manage attendance and view profiles for {committeeName}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={<CheckCircle size={18} />}
                        onClick={saveAttendance}
                        isLoading={saving}
                    >
                        Save Attendance
                    </Button>
                </div>
            </div>

            <Card className="bg-zinc-900/50 border border-white/10">
                <CardBody className="p-4 space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search delegates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<Search size={16} className="text-gray-400" />}
                            className="max-w-md"
                        />
                    </div>

                    <Table
                        aria-label="Delegates table"
                        classNames={{ wrapper: "bg-transparent", th: "bg-zinc-800/50" }}
                    >
                        <TableHeader>
                            <TableColumn>DELEGATE</TableColumn>
                            <TableColumn>PORTFOLIO</TableColumn>
                            <TableColumn>SCHOOL</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>ATTENDANCE</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No delegates found">
                            {filteredDelegates.map((delegate) => (
                                <TableRow key={delegate.$id}>
                                    <TableCell>
                                        <User
                                            name={delegate.fullName || delegate.name}
                                            description={delegate.email}
                                            avatarProps={{
                                                name: delegate.fullName || delegate.name,
                                                className: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{delegate.assignedPortfolio || "Delegate"}</div>
                                    </TableCell>
                                    <TableCell>{delegate.institution || "Independent"}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={delegate.status === "confirmed" ? "success" : "warning"} variant="flat">
                                            {delegate.status || "Pending"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant={attendance[delegate.$id] ? "solid" : "flat"}
                                            color={attendance[delegate.$id] ? "success" : "default"}
                                            startContent={attendance[delegate.$id] ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            onClick={() => toggleAttendance(delegate.$id)}
                                        >
                                            {attendance[delegate.$id] ? "Present" : "Absent"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
