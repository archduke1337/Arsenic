"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem, Textarea,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Chip, Switch, Tabs, Tab, Divider
} from "@nextui-org/react";
import { Plus, Edit, Trash2, Calendar, Palette, Copy } from "lucide-react";
import { COLLECTIONS, EVENT_TYPES, EVENT_TYPE_LABELS } from "@/lib/schema";
import ColorPicker from "@/components/admin/ColorPicker";
import FeeCalculator from "@/components/admin/FeeCalculator";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import EventSettingsToggles from "@/components/admin/EventSettingsToggles";
import PaymentGatewayToggles from "@/components/admin/PaymentGatewayToggles";
import { toast, Toaster } from "sonner";

interface EventFormData {
    name: string;
    type: string;
    description: string;
    agenda: string;
    venue: string;
    capacity: number;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    portfolioReleaseDate: string;
    fees: number;
    isActive: boolean;
    // Theme
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    // Images
    bannerUrl: string;
    thumbnailUrl: string;
    imageUrl: string;
    backgroundGuideUrl: string;
    // Fee Structure
    earlyBirdFee: number;
    earlyBirdDeadline: string;
    feeStructure: string;
    // Payment & Settings
    paymentConfig: string;
    settings: string;
}

export default function AdminEvents() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [events, setEvents] = useState<any[]>([]);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<EventFormData>({
        name: "",
        type: "MUN",
        description: "",
        agenda: "",
        venue: "",
        capacity: 0,
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        portfolioReleaseDate: "",
        fees: 0,
        isActive: true,
        primaryColor: "#3B82F6",
        secondaryColor: "#8B5CF6",
        accentColor: "#EC4899",
        bannerUrl: "",
        thumbnailUrl: "",
        imageUrl: "",
        backgroundGuideUrl: "",
        earlyBirdFee: 0,
        earlyBirdDeadline: "",
        feeStructure: JSON.stringify({ baseFee: 0, groupDiscounts: [] }),
        paymentConfig: JSON.stringify({ razorpay: true, easebuzz: false, autoFallback: false }),
        settings: JSON.stringify({
            allowDoubleDelegation: false,
            hybridMode: false,
            internationalDelegates: false,
            merchandiseUpsell: false,
        }),
    });

    // Parsed objects for components
    const [groupDiscounts, setGroupDiscounts] = useState<any[]>([]);
    const [paymentConfig, setPaymentConfig] = useState({ razorpay: true, easebuzz: false, autoFallback: false });
    const [eventSettings, setEventSettings] = useState({
        allowDoubleDelegation: false,
        hybridMode: false,
        internationalDelegates: false,
        merchandiseUpsell: false,
    });
    const [earlyBirdPercentage, setEarlyBirdPercentage] = useState(0);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/admin/events');
            if (!res.ok) throw new Error('Failed to fetch events');
            const data = await res.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        resetForm();
        onOpen();
    };

    const openEditModal = (event: any) => {
        setEditingEvent(event);

        // Parse JSON fields
        const parsedFeeStructure = event.feeStructure ? JSON.parse(event.feeStructure) : { groupDiscounts: [] };
        const parsedPaymentConfig = event.paymentConfig ? JSON.parse(event.paymentConfig) : paymentConfig;
        const parsedSettings = event.settings ? JSON.parse(event.settings) : eventSettings;

        setFormData({
            name: event.name || "",
            type: event.type || "MUN",
            description: event.description || "",
            agenda: event.agenda || "",
            venue: event.venue || "",
            capacity: event.capacity || 0,
            startDate: event.startDate || "",
            endDate: event.endDate || "",
            registrationDeadline: event.registrationDeadline || "",
            portfolioReleaseDate: event.portfolioReleaseDate || "",
            fees: event.fees || 0,
            isActive: event.isActive ?? true,
            primaryColor: event.primaryColor || "#3B82F6",
            secondaryColor: event.secondaryColor || "#8B5CF6",
            accentColor: event.accentColor || "#EC4899",
            bannerUrl: event.bannerUrl || "",
            thumbnailUrl: event.thumbnailUrl || "",
            imageUrl: event.imageUrl || "",
            backgroundGuideUrl: event.backgroundGuideUrl || "",
            earlyBirdFee: event.earlyBirdFee || 0,
            earlyBirdDeadline: event.earlyBirdDeadline || "",
            feeStructure: event.feeStructure || formData.feeStructure,
            paymentConfig: event.paymentConfig || formData.paymentConfig,
            settings: event.settings || formData.settings,
        });

        setGroupDiscounts(parsedFeeStructure.groupDiscounts || []);
        setPaymentConfig(parsedPaymentConfig);
        setEventSettings(parsedSettings);

        if (event.fees && event.earlyBirdFee) {
            const percentage = ((event.fees - event.earlyBirdFee) / event.fees) * 100;
            setEarlyBirdPercentage(percentage);
        }

        onOpen();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            type: "MUN",
            description: "",
            agenda: "",
            venue: "",
            capacity: 0,
            startDate: "",
            endDate: "",
            registrationDeadline: "",
            portfolioReleaseDate: "",
            fees: 0,
            isActive: true,
            primaryColor: "#3B82F6",
            secondaryColor: "#8B5CF6",
            accentColor: "#EC4899",
            bannerUrl: "",
            thumbnailUrl: "",
            imageUrl: "",
            backgroundGuideUrl: "",
            earlyBirdFee: 0,
            earlyBirdDeadline: "",
            feeStructure: JSON.stringify({ baseFee: 0, groupDiscounts: [] }),
            paymentConfig: JSON.stringify({ razorpay: true, easebuzz: false, autoFallback: false }),
            settings: JSON.stringify({
                allowDoubleDelegation: false,
                hybridMode: false,
                internationalDelegates: false,
                merchandiseUpsell: false,
            }),
        });
        setGroupDiscounts([]);
        setEarlyBirdPercentage(0);
        setPaymentConfig({ razorpay: true, easebuzz: false, autoFallback: false });
        setEventSettings({
            allowDoubleDelegation: false,
            hybridMode: false,
            internationalDelegates: false,
            merchandiseUpsell: false,
        });
        setActiveTab("basic");
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                fees: Number(formData.fees),
                capacity: Number(formData.capacity),
                earlyBirdFee: formData.fees - (formData.fees * (earlyBirdPercentage / 100)),
                feeStructure: JSON.stringify({
                    baseFee: formData.fees,
                    earlyBirdPercentage,
                    groupDiscounts,
                }),
                paymentConfig: JSON.stringify(paymentConfig),
                settings: JSON.stringify(eventSettings),
            };

            if (editingEvent) {
                const res = await fetch('/api/admin/events', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingEvent.$id, ...dataToSubmit }),
                });
                if (!res.ok) throw new Error('Failed to update event');
            } else {
                const res = await fetch('/api/admin/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSubmit),
                });
                if (!res.ok) throw new Error('Failed to create event');
            }

            await fetchEvents();
            onOpenChange();
            resetForm();
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("Error saving event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                const res = await fetch(`/api/admin/events?id=${eventId}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete event');
                await fetchEvents();
            } catch (error) {
                console.error("Error deleting event:", error);
            }
        }
    };

    const duplicateEvent = async (event: any) => {
        try {
            const duplicate = { ...event };
            delete duplicate.$id;
            delete duplicate.$createdAt;
            delete duplicate.$updatedAt;
            delete duplicate.$permissions;
            delete duplicate.$databaseId;
            delete duplicate.$collectionId;

            duplicate.name = `${duplicate.name} (Copy)`;
            duplicate.isActive = false;

            const res = await fetch('/api/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(duplicate),
            });
            if (!res.ok) throw new Error('Failed to duplicate event');

            await fetchEvents();
            toast.success("Event duplicated successfully!");
        } catch (error) {
            console.error("Error duplicating event:", error);
            toast.error("Error duplicating event.");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Event Management
                    </h1>
                    <p className="text-gray-400 mt-1">Create and manage summit events</p>
                </div>
                <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                    size="lg"
                >
                    Create Event
                </Button>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <Card
                        key={event.$id}
                        className="bg-zinc-900/50 border border-white/10 hover:border-purple-500/50 transition-all group"
                    >
                        <CardBody className="p-0">
                            {/* Event Banner */}
                            {event.bannerUrl && (
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={event.bannerUrl}
                                        alt={event.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                                        <Chip size="sm" color="secondary" variant="flat">
                                            {EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS]}
                                        </Chip>
                                    </div>
                                    <Chip size="sm" color={event.isActive ? "success" : "default"} variant="dot">
                                        {event.isActive ? "Active" : "Inactive"}
                                    </Chip>
                                </div>

                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                                {/* Color Theme Preview */}
                                {(event.primaryColor || event.secondaryColor || event.accentColor) && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Palette size={14} className="text-gray-500" />
                                        <div className="flex gap-1">
                                            {event.primaryColor && (
                                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: event.primaryColor }} />
                                            )}
                                            {event.secondaryColor && (
                                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: event.secondaryColor }} />
                                            )}
                                            {event.accentColor && (
                                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: event.accentColor }} />
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                        startContent={<Edit size={16} />}
                                        onClick={() => openEditModal(event)}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        isIconOnly
                                        onClick={() => duplicateEvent(event)}
                                        title="Duplicate Event"
                                    >
                                        <Copy size={16} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="flat"
                                        isIconOnly
                                        onClick={() => handleDelete(event.$id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Event Modal */}
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="inside"
                classNames={{
                    base: "bg-zinc-950 border border-white/10",
                    header: "border-b border-white/10",
                    body: "py-6",
                    footer: "border-t border-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h2 className="text-2xl font-bold">
                                    {editingEvent ? "Edit Event" : "Create New Event"}
                                </h2>
                                <p className="text-sm text-gray-400 font-normal">
                                    Configure your event with advanced settings
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <Tabs
                                    selectedKey={activeTab}
                                    onSelectionChange={(key) => setActiveTab(key as string)}
                                    color="primary"
                                    variant="underlined"
                                    classNames={{
                                        tabList: "gap-6",
                                        cursor: "w-full bg-blue-500",
                                        tab: "max-w-fit px-0 h-12",
                                    }}
                                >
                                    {/* Basic Info Tab */}
                                    <Tab key="basic" title="Basic Info">
                                        <div className="space-y-4 py-4">
                                            <Input
                                                label="Event Name"
                                                placeholder="e.g., ARSENIC Summit 2024"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                isRequired
                                            />

                                            <Select
                                                label="Event Type"
                                                selectedKeys={[formData.type]}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                isRequired
                                            >
                                                {EVENT_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {EVENT_TYPE_LABELS[type]}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                            <Textarea
                                                label="Description"
                                                placeholder="Brief description of the event..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                minRows={3}
                                                isRequired
                                            />

                                            <Textarea
                                                label="Agenda"
                                                placeholder="Event agenda or topics..."
                                                value={formData.agenda}
                                                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                                                minRows={3}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    label="Venue"
                                                    placeholder="Event location"
                                                    value={formData.venue}
                                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                                />
                                                <Input
                                                    label="Capacity"
                                                    type="number"
                                                    placeholder="Max delegates"
                                                    value={formData.capacity.toString()}
                                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                                />
                                            </div>

                                            <Switch
                                                isSelected={formData.isActive}
                                                onValueChange={(val) => setFormData({ ...formData, isActive: val })}
                                            >
                                                Event is Active
                                            </Switch>
                                        </div>
                                    </Tab>

                                    {/* Dates Tab */}
                                    <Tab key="dates" title="Dates & Deadlines">
                                        <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    label="Start Date"
                                                    type="datetime-local"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    isRequired
                                                />
                                                <Input
                                                    label="End Date"
                                                    type="datetime-local"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    isRequired
                                                />
                                            </div>

                                            <Input
                                                label="Registration Deadline"
                                                type="datetime-local"
                                                value={formData.registrationDeadline}
                                                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                            />

                                            <Input
                                                label="Portfolio Release Date"
                                                type="datetime-local"
                                                value={formData.portfolioReleaseDate}
                                                onChange={(e) => setFormData({ ...formData, portfolioReleaseDate: e.target.value })}
                                                description="When delegates will receive their committee assignments"
                                            />

                                            <Input
                                                label="Early Bird Deadline"
                                                type="datetime-local"
                                                value={formData.earlyBirdDeadline}
                                                onChange={(e) => setFormData({ ...formData, earlyBirdDeadline: e.target.value })}
                                                description="Last date for early bird pricing"
                                            />
                                        </div>
                                    </Tab>

                                    {/* Theme Tab */}
                                    <Tab key="theme" title="Theme & Media">
                                        <div className="space-y-6 py-4">
                                            <div>
                                                <h4 className="text-sm font-semibold mb-3">Event Colors</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <ColorPicker
                                                        label="Primary Color"
                                                        value={formData.primaryColor}
                                                        onChange={(color) => setFormData({ ...formData, primaryColor: color })}
                                                    />
                                                    <ColorPicker
                                                        label="Secondary Color"
                                                        value={formData.secondaryColor}
                                                        onChange={(color) => setFormData({ ...formData, secondaryColor: color })}
                                                    />
                                                    <ColorPicker
                                                        label="Accent Color"
                                                        value={formData.accentColor}
                                                        onChange={(color) => setFormData({ ...formData, accentColor: color })}
                                                    />
                                                </div>
                                            </div>

                                            <Divider />

                                            <MultiImageUpload
                                                maxFiles={2}
                                                label="Event Images (Banner & Thumbnail)"
                                                existingImages={[formData.bannerUrl, formData.thumbnailUrl].filter(Boolean)}
                                                onUploadComplete={(urls) => {
                                                    setFormData({
                                                        ...formData,
                                                        bannerUrl: urls[0] || "",
                                                        thumbnailUrl: urls[1] || urls[0] || "",
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Tab>

                                    {/* Pricing Tab */}
                                    <Tab key="pricing" title="Pricing">
                                        <div className="py-4">
                                            <FeeCalculator
                                                baseFee={formData.fees}
                                                onBaseFeeChange={(fee) => setFormData({ ...formData, fees: fee })}
                                                earlyBirdPercentage={earlyBirdPercentage}
                                                onEarlyBirdPercentageChange={setEarlyBirdPercentage}
                                                groupDiscounts={groupDiscounts}
                                                onGroupDiscountsChange={setGroupDiscounts}
                                            />
                                        </div>
                                    </Tab>

                                    {/* Payment & Settings Tab */}
                                    <Tab key="settings" title="Payment & Settings">
                                        <div className="space-y-6 py-4">
                                            <PaymentGatewayToggles
                                                config={paymentConfig}
                                                onChange={setPaymentConfig}
                                            />

                                            <EventSettingsToggles
                                                settings={eventSettings}
                                                onChange={setEventSettings}
                                            />
                                        </div>
                                    </Tab>
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSubmit}
                                    isLoading={loading}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                    {editingEvent ? "Update Event" : "Create Event"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
