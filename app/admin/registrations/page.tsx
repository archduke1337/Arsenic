"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Button, Pagination, Spinner, Checkbox
} from "@heroui/react";
import { Search, Eye, CheckCircle, QrCode, Users, DollarSign, Clock } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPES } from "@/lib/schema";
import { Query } from "appwrite";
import RegistrationFilters from "@/components/admin/registrations/RegistrationFilters";
import ExportMenu from "@/components/admin/registrations/ExportMenu";
import QRCodeDisplay from "@/components/admin/registrations/QRCodeDisplay";
import RegistrationDetailModal from "@/components/admin/registrations/RegistrationDetailModal";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filters
    const [selectedEvent, setSelectedEvent] = useState("ALL");
    const [paymentStatus, setPaymentStatus] = useState("ALL");
    const [checkInStatus, setCheckInStatus] = useState("ALL");
    const [schoolSearch, setSchoolSearch] = useState("");
    const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);

    // Table state
    const [page, setPage] = useState(1);
    const rowsPerPage = 20;

    // Modal state
    const [viewingQR, setViewingQR] = useState<any>(null);
    const [viewingDetail, setViewingDetail] = useState<any>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.REGISTRATIONS,
                [Query.orderDesc("$createdAt"), Query.limit(1000)]
            );
            setRegistrations(response.documents as any);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            toast.error("Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    // Filter and search logic
    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg => {
            // Search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const matches =
                    reg.name?.toLowerCase().includes(searchLower) ||
                    reg.email?.toLowerCase().includes(searchLower) ||
                    reg.phone?.toLowerCase().includes(searchLower) ||
                    reg.school?.toLowerCase().includes(searchLower);
                if (!matches) return false;
            }

            // Event filter
            if (selectedEvent !== 'ALL' && reg.eventType !== selectedEvent) return false;

            // Payment status filter
            if (paymentStatus !== 'ALL' && reg.paymentStatus !== paymentStatus) return false;

            // Check-in filter
            if (checkInStatus === 'CHECKED_IN' && !reg.checkedIn) return false;
            if (checkInStatus === 'NOT_CHECKED_IN' && reg.checkedIn) return false;

            // School filter
            if (schoolSearch && !reg.school?.toLowerCase().includes(schoolSearch.toLowerCase())) return false;

            // Amount range filter
            const amount = reg.amount || 0;
            if (amount < amountRange[0] || amount > amountRange[1]) return false;

            return true;
        });
    }, [searchQuery, selectedEvent, paymentStatus, checkInStatus, schoolSearch, amountRange]);

    // Pagination
    const paginatedRegistrations = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredRegistrations.slice(start, end);
    }, [filteredRegistrations, page]);

    const totalPages = Math.ceil(filteredRegistrations.length / rowsPerPage);

    // Statistics
    const stats = useMemo(() => {
        const total = registrations.length;
        const revenue = registrations.reduce((sum, reg) => sum + (reg.amount || 0), 0);
        const checkedIn = registrations.filter(r => r.checkedIn).length;
        const pending = registrations.filter(r => r.paymentStatus === 'PENDING').length;

        return { total, revenue, checkedIn, pending };
    }, [registrations]);

    const handleClearFilters = () => {
        setSelectedEvent("ALL");
        setPaymentStatus("ALL");
        setCheckInStatus("ALL");
        setSchoolSearch("");
        setAmountRange([0, 100000]);
        setSearchQuery("");
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedRegistrations.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedRegistrations.map(r => r.$id)));
        }
    };

    const handleBulkCheckIn = async () => {
        if (selectedIds.size === 0) {
            toast.error("No registrations selected");
            return;
        }

        if (confirm(`Check in ${selectedIds.size} attendees?`)) {
            setLoading(true);
            try {
                let checkedInCount = 0;
                for (const id of selectedIds) {
                    const reg = registrations.find(r => r.$id === id);
                    if (!reg?.checkedIn) {
                        await databases.updateDocument(
                            DATABASE_ID,
                            COLLECTIONS.REGISTRATIONS,
                            id,
                            {
                                checkedIn: true,
                                checkedInAt: new Date().toISOString(),
                            }
                        );
                        checkedInCount++;
                    }
                }
                toast.success(`Checked in ${checkedInCount} attendees`);
                setSelectedIds(new Set());
                await fetchRegistrations();
            } catch (error) {
                console.error("Bulk check-in error:", error);
                toast.error("Failed to check in some attendees");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSingleCheckIn = async (id: string) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.REGISTRATIONS,
                id,
                {
                    checkedIn: true,
                    checkedInAt: new Date().toISOString(),
                }
            );
            toast.success("Attendee checked in");
            await fetchRegistrations();
            setViewingDetail(null);
        } catch (error) {
            console.error("Check-in error:", error);
            toast.error("Failed to check in attendee");
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'danger';
            case 'REFUNDED': return 'default';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Registration Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage and track all event registrations</p>
                </div>
                <ExportMenu
                    registrations={filteredRegistrations}
                    selectedIds={Array.from(selectedIds)}
                />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <Users size={24} className="text-blue-400" />
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-gray-400">Total Registrations</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <DollarSign size={24} className="text-green-400" />
                            <div>
                                <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-400">Total Revenue</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={24} className="text-purple-400" />
                            <div>
                                <p className="text-2xl font-bold">{stats.checkedIn}</p>
                                <p className="text-xs text-gray-400">Checked In</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <Clock size={24} className="text-yellow-400" />
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-xs text-gray-400">Pending Payment</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-zinc-900/50 border border-white/10 mb-6">
                <CardBody className="p-6">
                    <RegistrationFilters
                        events={[...EVENT_TYPES]}
                        selectedEvent={selectedEvent}
                        onEventChange={setSelectedEvent}
                        paymentStatus={paymentStatus}
                        onPaymentStatusChange={setPaymentStatus}
                        checkInStatus={checkInStatus}
                        onCheckInStatusChange={setCheckInStatus}
                        schoolSearch={schoolSearch}
                        onSchoolSearchChange={setSchoolSearch}
                        amountRange={amountRange}
                        onAmountRangeChange={setAmountRange}
                        onClearAll={handleClearFilters}
                    />
                </CardBody>
            </Card>

            {/* Search Bar */}
            <Card className="bg-zinc-900/50 border border-white/10 mb-6">
                <CardBody className="p-4">
                    <Input
                        placeholder="Search by name, email, phone, or school..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<Search size={16} />}
                        classNames={{
                            inputWrapper: "bg-black/50 border border-white/10",
                        }}
                        size="lg"
                    />
                </CardBody>
            </Card>

            {/* Results & Selection Info */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">
                    Showing {paginatedRegistrations.length} of {filteredRegistrations.length} registrations
                    {selectedIds.size > 0 && ` • ${selectedIds.size} selected`}
                </p>
                {selectedIds.size > 0 && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<CheckCircle size={14} />}
                            onClick={handleBulkCheckIn}
                        >
                            Check In Selected
                        </Button>
                        <Button size="sm" variant="flat" onClick={() => setSelectedIds(new Set())}>
                            Clear Selection
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            <Card className="bg-zinc-900/50 border border-white/10">
                <CardBody className="p-0">
                    <Table
                        aria-label="Registrations table"
                        classNames={{
                            wrapper: "bg-transparent",
                            th: "bg-zinc-800/50",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>
                                <Checkbox
                                    isSelected={selectedIds.size === paginatedRegistrations.length && paginatedRegistrations.length > 0}
                                    onValueChange={toggleSelectAll}
                                />
                            </TableColumn>
                            <TableColumn>NAME</TableColumn>
                            <TableColumn>EMAIL</TableColumn>
                            <TableColumn>SCHOOL</TableColumn>
                            <TableColumn>EVENT</TableColumn>
                            <TableColumn>AMOUNT</TableColumn>
                            <TableColumn>PAYMENT</TableColumn>
                            <TableColumn>CHECK-IN</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {paginatedRegistrations.map((reg) => (
                                <TableRow key={reg.$id}>
                                    <TableCell>
                                        <Checkbox
                                            isSelected={selectedIds.has(reg.$id)}
                                            onValueChange={() => toggleSelection(reg.$id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold">{reg.name}</TableCell>
                                    <TableCell className="text-sm text-gray-400">{reg.email}</TableCell>
                                    <TableCell className="text-sm">{reg.school || '—'}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat" color="primary">
                                            {reg.eventType?.replace(/_/g, ' ') || 'Event'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="font-mono">₹{reg.amount?.toLocaleString('en-IN') || 0}</TableCell>
                                    <TableCell>
                                        <Chip size="sm" color={getPaymentStatusColor(reg.paymentStatus as any)}>
                                            {reg.paymentStatus || 'PENDING'}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        {reg.checkedIn ? (
                                            <CheckCircle size={16} className="text-green-400" />
                                        ) : (
                                            <span className="text-gray-600">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                isIconOnly
                                                onClick={() => setViewingDetail(reg)}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                isIconOnly
                                                onClick={() => setViewingQR(reg)}
                                                title="View QR Code"
                                            >
                                                <QrCode size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredRegistrations.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No registrations found matching your filters
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        showControls
                    />
                </div>
            )}

            {/* QR Code Modal */}
            {viewingQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setViewingQR(null)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <QRCodeDisplay
                            registrationId={viewingQR.$id}
                            attendeeName={viewingQR.name}
                            eventType={viewingQR.eventType}
                        />
                    </div>
                </div>
            )}

            {/* Registration Detail Modal */}
            <RegistrationDetailModal
                isOpen={!!viewingDetail}
                onClose={() => setViewingDetail(null)}
                registration={viewingDetail}
                onCheckIn={handleSingleCheckIn}
            />
        </div>
    );
}
