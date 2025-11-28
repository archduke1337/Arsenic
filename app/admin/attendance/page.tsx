"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import { Download, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminAttendance() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            fetchAttendanceForEvent(selectedEvent);
        }
    }, [selectedEvent, filterStatus]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventsRes, regsRes] = await Promise.all([
                databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(100)]),
                databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS, [Query.limit(500)]),
            ]);
            setEvents(eventsRes.documents);
            setRegistrations(regsRes.documents);
            if (eventsRes.documents.length > 0) {
                setSelectedEvent(eventsRes.documents[0].$id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceForEvent = async (eventId: string) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ATTENDANCE,
                [Query.equal("eventId", eventId), Query.orderDesc("checkedInAt"), Query.limit(500)]
            );
            setAttendance(response.documents);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to load attendance");
        }
    };

    const getRegistrationName = (registrationId: string) => {
        return registrations.find(r => r.$id === registrationId)?.fullName || "Unknown";
    };

    const getRegistrationInstitution = (registrationId: string) => {
        return registrations.find(r => r.$id === registrationId)?.institution || "-";
    };

    const getEventName = (eventId: string) => {
        return events.find(e => e.$id === eventId)?.name || eventId;
    };

    const filteredAttendance = attendance.filter(a => {
        const matchesSearch = getRegistrationName(a.registrationId).toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === "all" || a.attendanceStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const exportCSV = () => {
        try {
            const headers = ["Name", "Institution", "Status", "Check-in Time", "Committee"];
            const rows = filteredAttendance.map(a => [
                getRegistrationName(a.registrationId),
                getRegistrationInstitution(a.registrationId),
                a.attendanceStatus,
                new Date(a.checkedInAt).toLocaleString(),
                a.committeeId || "-"
            ]);

            const csv = [
                headers.join(","),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `attendance_${selectedEvent}_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            toast.success("Attendance exported successfully");
        } catch (error) {
            toast.error("Failed to export attendance");
        }
    };

    const calculateStats = () => {
        return {
            total: filteredAttendance.length,
            present: filteredAttendance.filter(a => a.attendanceStatus === "present").length,
            late: filteredAttendance.filter(a => a.attendanceStatus === "late").length,
            absent: filteredAttendance.filter(a => a.attendanceStatus === "absent").length,
            excused: filteredAttendance.filter(a => a.attendanceStatus === "excused").length,
        };
    };

    const stats = calculateStats();
    const attendancePercentage = stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

    const statusColor = (status: string) => {
        switch (status) {
            case "present": return "success";
            case "late": return "warning";
            case "absent": return "danger";
            case "excused": return "secondary";
            default: return "default";
        }
    };

    const statusIcon = (status: string) => {
        switch (status) {
            case "present": return <CheckCircle size={16} />;
            case "late": return <Clock size={16} />;
            case "absent": return <AlertCircle size={16} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Attendance Management</h1>
                    <p className="text-gray-500">Track and manage event check-ins</p>
                </div>
                <Button
                    color="primary"
                    startContent={<Download size={20} />}
                    onClick={exportCSV}
                    isDisabled={filteredAttendance.length === 0}
                >
                    Export CSV
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Total Attendees</p>
                        <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Present</p>
                        <p className="text-2xl font-bold text-green-500">{stats.present}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Late</p>
                        <p className="text-2xl font-bold text-yellow-500">{stats.late}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Absent</p>
                        <p className="text-2xl font-bold text-red-500">{stats.absent}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Attendance Rate</p>
                        <p className="text-2xl font-bold text-purple-500">{attendancePercentage}%</p>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search by name..."
                    value={searchText}
                    onValueChange={setSearchText}
                    className="max-w-sm"
                />
                <Select
                    label="Filter by status"
                    selectedKeys={[filterStatus]}
                    onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0] as string)}
                    className="max-w-sm"
                >
                    <SelectItem key="all">All Status</SelectItem>
                    <SelectItem key="present">Present</SelectItem>
                    <SelectItem key="late">Late</SelectItem>
                    <SelectItem key="absent">Absent</SelectItem>
                    <SelectItem key="excused">Excused</SelectItem>
                </Select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center p-8">
                    <Spinner />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>INSTITUTION</TableColumn>
                        <TableColumn>COMMITTEE</TableColumn>
                        <TableColumn>CHECK-IN TIME</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>CHECK-OUT</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No attendance records found">
                        {filteredAttendance.map((record) => (
                            <TableRow key={record.$id}>
                                <TableCell>
                                    <div className="font-medium">
                                        {getRegistrationName(record.registrationId)}
                                    </div>
                                </TableCell>
                                <TableCell>{getRegistrationInstitution(record.registrationId)}</TableCell>
                                <TableCell>{record.committeeId || "-"}</TableCell>
                                <TableCell>
                                    {new Date(record.checkedInAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="sm"
                                        color={statusColor(record.attendanceStatus) as any}
                                        startContent={statusIcon(record.attendanceStatus)}
                                        variant="flat"
                                    >
                                        {record.attendanceStatus.toUpperCase()}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    {record.checkOutTime
                                        ? new Date(record.checkOutTime).toLocaleTimeString()
                                        : "-"
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
