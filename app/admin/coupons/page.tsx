"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem, Textarea,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner, Switch
} from "@nextui-org/react";
import { Plus, Edit, Trash2, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, couponSchema } from "@/lib/schema";
import { ID, Query } from "appwrite";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

interface CouponFormData {
    code: string;
    eventId: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxUses: number;
    currentUses: number;
    expiryDate: string;
    isActive: boolean;
}

export default function AdminCoupons() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [formData, setFormData] = useState<CouponFormData>({
        code: "",
        eventId: "",
        discountType: "percentage",
        discountValue: 0,
        maxUses: 0,
        currentUses: 0,
        expiryDate: "",
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
        fetchEvents();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.COUPONS,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            setCoupons(response.documents);
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.EVENTS,
                [Query.limit(100)]
            );
            setEvents(response.documents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const handleOpenCreate = () => {
        setEditingCoupon(null);
        setFormData({
            code: "",
            eventId: "",
            discountType: "percentage",
            discountValue: 0,
            maxUses: 0,
            currentUses: 0,
            expiryDate: "",
            isActive: true,
        });
        onOpen();
    };

    const handleOpenEdit = (coupon: any) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            eventId: coupon.eventId,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxUses: coupon.maxUses || 0,
            currentUses: coupon.currentUses || 0,
            expiryDate: coupon.expiryDate || "",
            isActive: coupon.isActive ?? true,
        });
        onOpen();
    };

    const handleSave = async () => {
        if (!formData.code || !formData.eventId || formData.discountValue <= 0) {
            toast.error("Please fill all required fields");
            return;
        }

        setSaving(true);
        try {
            const couponData = {
                code: formData.code.toUpperCase(),
                eventId: formData.eventId,
                discountType: formData.discountType,
                discountValue: formData.discountValue,
                maxUses: formData.maxUses,
                currentUses: formData.currentUses,
                expiryDate: formData.expiryDate,
                isActive: formData.isActive,
                createdBy: "admin@arsenic.com",
                createdAt: editingCoupon ? editingCoupon.createdAt : new Date().toISOString(),
            };

            if (editingCoupon) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.COUPONS,
                    editingCoupon.$id,
                    couponData
                );
                toast.success("Coupon updated successfully");
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.COUPONS,
                    ID.unique(),
                    couponData
                );
                toast.success("Coupon created successfully");
            }

            fetchCoupons();
            onOpenChange();
        } catch (error) {
            console.error("Error saving coupon:", error);
            toast.error("Failed to save coupon");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.COUPONS,
                id
            );
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggleActive = async (coupon: any) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.COUPONS,
                coupon.$id,
                { isActive: !coupon.isActive }
            );
            toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}`);
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to update coupon status");
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Code copied to clipboard");
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = filterStatus === "all" || 
            (filterStatus === "active" && coupon.isActive) ||
            (filterStatus === "inactive" && !coupon.isActive) ||
            (filterStatus === "expired" && coupon.expiryDate && new Date(coupon.expiryDate) < new Date());
        return matchesSearch && matchesStatus;
    });

    const isExpired = (expiryDate: string) => {
        return expiryDate && new Date(expiryDate) < new Date();
    };

    const getEventName = (eventId: string) => {
        return events.find(e => e.$id === eventId)?.name || eventId;
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Coupon Management</h1>
                    <p className="text-gray-500">Create and manage discount codes</p>
                </div>
                <Button color="primary" startContent={<Plus size={20} />} size="lg" onPress={handleOpenCreate}>
                    New Coupon
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Total Coupons</p>
                        <p className="text-2xl font-bold text-blue-500">{coupons.length}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-2xl font-bold text-green-500">{coupons.filter(c => c.isActive && !isExpired(c.expiryDate)).length}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Inactive</p>
                        <p className="text-2xl font-bold text-red-500">{coupons.filter(c => !c.isActive).length}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Total Usage</p>
                        <p className="text-2xl font-bold text-purple-500">{coupons.reduce((sum, c) => sum + (c.currentUses || 0), 0)}</p>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search coupon code..."
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
                    <SelectItem key="all">All Coupons</SelectItem>
                    <SelectItem key="active">Active</SelectItem>
                    <SelectItem key="inactive">Inactive</SelectItem>
                    <SelectItem key="expired">Expired</SelectItem>
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
                        <TableColumn>CODE</TableColumn>
                        <TableColumn>EVENT</TableColumn>
                        <TableColumn>DISCOUNT</TableColumn>
                        <TableColumn>USAGE</TableColumn>
                        <TableColumn>EXPIRY</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No coupons found">
                        {filteredCoupons.map((coupon) => (
                            <TableRow key={coupon.$id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <code className="font-mono font-bold text-primary">{coupon.code}</code>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onClick={() => handleCopyCode(coupon.code)}
                                        >
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{getEventName(coupon.eventId)}</TableCell>
                                <TableCell>
                                    {coupon.discountType === "percentage" ? (
                                        <Chip size="sm" color="success" variant="flat">
                                            {coupon.discountValue}% OFF
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" color="success" variant="flat">
                                            ₹{coupon.discountValue} OFF
                                        </Chip>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip size="sm" variant="flat">
                                        {coupon.currentUses || 0}/{coupon.maxUses || "∞"}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    {coupon.expiryDate ? (
                                        <span className={isExpired(coupon.expiryDate) ? "text-red-500" : ""}>
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        "No expiry"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isExpired(coupon.expiryDate) ? (
                                        <Chip size="sm" color="danger" startContent={<AlertCircle size={14} />}>
                                            Expired
                                        </Chip>
                                    ) : coupon.isActive ? (
                                        <Chip size="sm" color="success" startContent={<CheckCircle size={14} />}>
                                            Active
                                        </Chip>
                                    ) : (
                                        <Chip size="sm" color="warning" variant="flat">
                                            Inactive
                                        </Chip>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            onClick={() => handleOpenEdit(coupon)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onClick={() => handleDelete(coupon.$id)}
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

            {/* Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                            </ModalHeader>
                            <ModalBody className="gap-4">
                                <Input
                                    label="Coupon Code"
                                    placeholder="e.g., ARSENIC50"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                />
                                <Select
                                    label="Event"
                                    selectedKeys={[formData.eventId]}
                                    onSelectionChange={(keys) => setFormData({ ...formData, eventId: Array.from(keys)[0] as string })}
                                >
                                    {events.map((event) => (
                                        <SelectItem key={event.$id} value={event.$id}>
                                            {event.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Discount Type"
                                        selectedKeys={[formData.discountType]}
                                        onSelectionChange={(keys) => setFormData({ ...formData, discountType: Array.from(keys)[0] as "percentage" | "fixed" })}
                                    >
                                        <SelectItem key="percentage">Percentage (%)</SelectItem>
                                        <SelectItem key="fixed">Fixed Amount (₹)</SelectItem>
                                    </Select>
                                    <Input
                                        label="Discount Value"
                                        type="number"
                                        placeholder="50"
                                        value={formData.discountValue.toString()}
                                        onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Max Uses (0 = unlimited)"
                                        type="number"
                                        placeholder="100"
                                        value={formData.maxUses.toString()}
                                        onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                                    />
                                    <Input
                                        label="Expiry Date"
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                >
                                    Active
                                </Switch>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleSave} isLoading={saving}>
                                    {editingCoupon ? "Update" : "Create"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
