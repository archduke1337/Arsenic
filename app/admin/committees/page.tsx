"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem, Textarea,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Chip, Tabs, Tab
} from "@heroui/react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPES } from "@/lib/schema";
import { ID, Query } from "appwrite";
import MUNDataEditor from "@/components/admin/committees/MUNDataEditor";
import LokSabhaDataEditor from "@/components/admin/committees/LokSabhaDataEditor";
import RajyaSabhaDataEditor from "@/components/admin/committees/RajyaSabhaDataEditor";
import DebateDataEditor from "@/components/admin/committees/DebateDataEditor";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminCommittees() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [committees, setCommittees] = useState<any[]>([]);
    const [editingCommittee, setEditingCommittee] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    // Basic form state
    const [formData, setFormData] = useState({
        name: "",
        abbreviation: "",
        type: "",
        eventType: "MUN" as any,
        description: "",
        agenda: "",
        chairperson: "",
        viceChairperson: "",
        rapporteur: "",
        capacity: 0,
    });

    // Format-specific data
    const [munData, setMunData] = useState<any>({ countries: [], difficultyTag: undefined });
    const [lokSabhaData, setLokSabhaData] = useState<any>({ state: "", reservationType: "General", parties: [], portfolios: [] });
    const [rajyaSabhaData, setRajyaSabhaData] = useState<any>({ stateUT: "", seatsAvailable: 0, partyAllocation: [], nominatedMembers: [] });
    const [debateData, setDebateData] = useState<any>({ type: "PD", topics: [], formatRules: "", adjudicators: [] });

    useEffect(() => {
        fetchCommittees();
    }, []);

    const fetchCommittees = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.COMMITTEES,
                [Query.orderDesc("$createdAt")]
            );
            setCommittees(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching committees:", error);
            toast.error("Failed to fetch committees");
        }
    };

    const openCreateModal = () => {
        setEditingCommittee(null);
        resetForm();
        onOpen();
    };

    const openEditModal = (committee: any) => {
        setEditingCommittee(committee);
        setFormData({
            name: committee.name || "",
            abbreviation: committee.abbreviation || "",
            type: committee.type || "",
            eventType: committee.eventType || "MUN",
            description: committee.description || "",
            agenda: committee.agenda || "",
            chairperson: committee.chairperson || "",
            viceChairperson: committee.viceChairperson || "",
            rapporteur: committee.rapporteur || "",
            capacity: committee.capacity || 0,
        });

        // Parse format-specific data
        if (committee.munData) {
            setMunData(JSON.parse(committee.munData));
        }
        if (committee.lokSabhaData) {
            setLokSabhaData(JSON.parse(committee.lokSabhaData));
        }
        if (committee.rajyaSabhaData) {
            setRajyaSabhaData(JSON.parse(committee.rajyaSabhaData));
        }
        if (committee.debateData) {
            setDebateData(JSON.parse(committee.debateData));
        }

        onOpen();
    };

    const resetForm = () => {
        setFormData({
            name: "",
            abbreviation: "",
            type: "",
            eventType: "MUN",
            description: "",
            agenda: "",
            chairperson: "",
            viceChairperson: "",
            rapporteur: "",
            capacity: 0,
        });
        setMunData({ countries: [], difficultyTag: undefined });
        setLokSabhaData({ state: "", reservationType: "General", parties: [], portfolios: [] });
        setRajyaSabhaData({ stateUT: "", seatsAvailable: 0, partyAllocation: [], nominatedMembers: [] });
        setDebateData({ type: "PD", topics: [], formatRules: "", adjudicators: [] });
        setActiveTab("basic");
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                capacity: Number(formData.capacity),
                munData: formData.eventType === "MUN" ? JSON.stringify(munData) : undefined,
                lokSabhaData: formData.eventType === "LOK_SABHA" ? JSON.stringify(lokSabhaData) : undefined,
                rajyaSabhaData: formData.eventType === "RAJYA_SABHA" ? JSON.stringify(rajyaSabhaData) : undefined,
                debateData: formData.eventType === "DEBATE" ? JSON.stringify(debateData) : undefined,
            };

            if (editingCommittee) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.COMMITTEES,
                    editingCommittee.$id,
                    dataToSubmit
                );
                toast.success("Committee updated successfully!");
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.COMMITTEES,
                    ID.unique(),
                    dataToSubmit
                );
                toast.success("Committee created successfully!");
            }

            await fetchCommittees();
            onOpenChange();
            resetForm();
        } catch (error) {
            console.error("Error saving committee:", error);
            toast.error("Failed to save committee");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (committeeId: string) => {
        if (confirm("Are you sure you want to delete this committee?")) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTIONS.COMMITTEES, committeeId);
                await fetchCommittees();
                toast.success("Committee deleted successfully!");
            } catch (error) {
                console.error("Error deleting committee:", error);
                toast.error("Failed to delete committee");
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Committee Management
                    </h1>
                    <p className="text-gray-400 mt-1">Manage committees with format-aware configuration</p>
                </div>
                <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    onClick={openCreateModal}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                    size="lg"
                >
                    Create Committee
                </Button>
            </div>

            {/* Committees Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {committees.map((committee) => (
                    <Card
                        key={committee.$id}
                        className="bg-zinc-900/50 border border-white/10 hover:border-purple-500/50 transition-all group"
                    >
                        <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{committee.name}</h3>
                                    <p className="text-sm text-gray-400">{committee.abbreviation}</p>
                                </div>
                                <Chip size="sm" color="secondary" variant="flat">
                                    {committee.eventType}
                                </Chip>
                            </div>

                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{committee.description}</p>

                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                                <Users size={14} />
                                <span>Capacity: {committee.capacity}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    startContent={<Edit size={16} />}
                                    onClick={() => openEditModal(committee)}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    isIconOnly
                                    onClick={() => handleDelete(committee.$id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Committee Modal */}
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
                                    {editingCommittee ? "Edit Committee" : "Create New Committee"}
                                </h2>
                                <p className="text-sm text-gray-400 font-normal">
                                    Configure committee with format-specific data
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <Tabs
                                    selectedKey={activeTab}
                                    onSelectionChange={(key) => setActiveTab(key as string)}
                                    color="primary"
                                    variant="underlined"
                                >
                                    {/* Basic Info Tab */}
                                    <Tab key="basic" title="Basic Info">
                                        <div className="space-y-4 py-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    label="Committee Name"
                                                    placeholder="e.g., United Nations Security Council"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    isRequired
                                                />
                                                <Input
                                                    label="Abbreviation"
                                                    placeholder="e.g., UNSC"
                                                    value={formData.abbreviation}
                                                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                                                    isRequired
                                                />
                                            </div>

                                            <Select
                                                label="Event Type"
                                                selectedKeys={[formData.eventType]}
                                                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                                description="This determines which configuration fields are shown"
                                                isRequired
                                            >
                                                {EVENT_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.replace(/_/g, ' ')}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                            <Textarea
                                                label="Description"
                                                placeholder="Brief description of the committee..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                minRows={3}
                                                isRequired
                                            />

                                            <Textarea
                                                label="Agenda"
                                                placeholder="Committee agenda or topics..."
                                                value={formData.agenda}
                                                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                                                minRows={3}
                                            />

                                            <div className="grid grid-cols-3 gap-4">
                                                <Input
                                                    label="Chairperson"
                                                    placeholder="Name"
                                                    value={formData.chairperson}
                                                    onChange={(e) => setFormData({ ...formData, chairperson: e.target.value })}
                                                />
                                                <Input
                                                    label="Vice-Chairperson"
                                                    placeholder="Name"
                                                    value={formData.viceChairperson}
                                                    onChange={(e) => setFormData({ ...formData, viceChairperson: e.target.value })}
                                                />
                                                <Input
                                                    label="Rapporteur"
                                                    placeholder="Name"
                                                    value={formData.rapporteur}
                                                    onChange={(e) => setFormData({ ...formData, rapporteur: e.target.value })}
                                                />
                                            </div>

                                            <Input
                                                label="Capacity"
                                                type="number"
                                                placeholder="Max delegates/participants"
                                                value={formData.capacity.toString()}
                                                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                                min="0"
                                                isRequired
                                            />
                                        </div>
                                    </Tab>

                                    {/* Format-Specific Configuration Tab */}
                                    <Tab key="config" title={`${formData.eventType} Configuration`}>
                                        <div className="py-4">
                                            {formData.eventType === "MUN" && (
                                                <MUNDataEditor
                                                    countries={munData.countries}
                                                    onChange={(countries) => setMunData({ ...munData, countries })}
                                                    difficultyTag={munData.difficultyTag}
                                                    onDifficultyChange={(tag) => setMunData({ ...munData, difficultyTag: tag })}
                                                />
                                            )}

                                            {formData.eventType === "LOK_SABHA" && (
                                                <LokSabhaDataEditor
                                                    state={lokSabhaData.state}
                                                    onStateChange={(state) => setLokSabhaData({ ...lokSabhaData, state })}
                                                    reservationType={lokSabhaData.reservationType}
                                                    onReservationChange={(type) => setLokSabhaData({ ...lokSabhaData, reservationType: type })}
                                                    parties={lokSabhaData.parties}
                                                    onPartiesChange={(parties) => setLokSabhaData({ ...lokSabhaData, parties })}
                                                    portfolios={lokSabhaData.portfolios}
                                                    onPortfoliosChange={(portfolios) => setLokSabhaData({ ...lokSabhaData, portfolios })}
                                                />
                                            )}

                                            {formData.eventType === "RAJYA_SABHA" && (
                                                <RajyaSabhaDataEditor
                                                    stateUT={rajyaSabhaData.stateUT}
                                                    onStateUTChange={(state) => setRajyaSabhaData({ ...rajyaSabhaData, stateUT: state })}
                                                    seatsAvailable={rajyaSabhaData.seatsAvailable}
                                                    onSeatsChange={(seats) => setRajyaSabhaData({ ...rajyaSabhaData, seatsAvailable: seats })}
                                                    partyAllocation={rajyaSabhaData.partyAllocation}
                                                    onPartyAllocationChange={(allocation) => setRajyaSabhaData({ ...rajyaSabhaData, partyAllocation: allocation })}
                                                    nominatedMembers={rajyaSabhaData.nominatedMembers}
                                                    onNominatedMembersChange={(members) => setRajyaSabhaData({ ...rajyaSabhaData, nominatedMembers: members })}
                                                />
                                            )}

                                            {formData.eventType === "DEBATE" && (
                                                <DebateDataEditor
                                                    type={debateData.type}
                                                    onTypeChange={(type) => setDebateData({ ...debateData, type })}
                                                    topics={debateData.topics}
                                                    onTopicsChange={(topics) => setDebateData({ ...debateData, topics })}
                                                    formatRules={debateData.formatRules}
                                                    onFormatRulesChange={(rules) => setDebateData({ ...debateData, formatRules: rules })}
                                                    adjudicators={debateData.adjudicators}
                                                    onAdjudicatorsChange={(adjudicators) => setDebateData({ ...debateData, adjudicators })}
                                                />
                                            )}

                                            {formData.eventType === "YOUTH_PARLIAMENT" && (
                                                <Card className="bg-zinc-900/50 border border-white/10">
                                                    <CardBody className="p-6 text-center">
                                                        <p className="text-gray-400">
                                                            Youth Parliament uses a similar configuration to Lok Sabha
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            )}
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
                                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                                >
                                    {editingCommittee ? "Update Committee" : "Create Committee"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
