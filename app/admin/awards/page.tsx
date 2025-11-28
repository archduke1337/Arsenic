"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Button, Input, Select, SelectItem,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Autocomplete, AutocompleteItem, Avatar
} from "@nextui-org/react";
import { Trophy, Search, Plus, Download, Trash2, Edit, Award, Share2 } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPES } from "@/lib/schema";
import { Query, ID } from "appwrite";
import { toast, Toaster } from "sonner";
import {
    getAwardCategoriesForEvent,
    getAwardLabel,
    getAwardTierColor,
    AWARD_TIER_COLORS
} from "@/lib/award-categories";
import { generateCertificate, generateBatchCertificates, CertificateTemplate } from "@/lib/certificate-generator";
import { downloadBlob } from "@/lib/export-utils";
import CertificatePreviewModal from "@/components/admin/awards/CertificatePreviewModal";
import Papa from "papaparse";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminAwards() {
    const [awards, setAwards] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAward, setEditingAward] = useState<any>(null);
    const [selectedEvent, setSelectedEvent] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedWinner, setSelectedWinner] = useState<string>("");
    const [remarks, setRemarks] = useState("");

    // Certificate state
    const [generatingCert, setGeneratingCert] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>('modern');
    const [previewData, setPreviewData] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [awardsRes, registrationsRes] = await Promise.all([
                databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    [Query.orderDesc("$createdAt")]
                ),
                databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.REGISTRATIONS,
                    [Query.limit(1000)] // Fetch enough for autocomplete
                )
            ]);

            setAwards(awardsRes.documents);
            setRegistrations(registrationsRes.documents);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch awards data");
        } finally {
            setLoading(false);
        }
    };

    const filteredAwards = useMemo(() => {
        return awards.filter(award => {
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const winnerName = award.registration?.name?.toLowerCase() || '';
                const category = award.category?.toLowerCase() || '';
                const event = award.eventType?.toLowerCase() || '';

                return winnerName.includes(searchLower) ||
                    category.includes(searchLower) ||
                    event.includes(searchLower);
            }
            return true;
        });
    }, [awards, searchQuery]);

    // Filter registrations based on selected event type for the modal
    const eligibleRegistrations = useMemo(() => {
        if (!selectedEvent) return [];
        return registrations.filter(r => r.eventType === selectedEvent);
    }, [registrations, selectedEvent]);

    const handleSaveAward = async () => {
        if (!selectedEvent || !selectedCategory || !selectedWinner) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const payload = {
                eventType: selectedEvent,
                category: selectedCategory,
                registration: selectedWinner,
                remarks: remarks,
                published: true, // Auto-publish for now
                awardedAt: new Date().toISOString(),
            };

            if (editingAward) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    editingAward.$id,
                    payload
                );
                toast.success("Award updated successfully");
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    ID.unique(),
                    payload
                );
                toast.success("Award assigned successfully");
            }

            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error saving award:", error);
            toast.error("Failed to save award");
        }
    };

    const handleDeleteAward = async (id: string) => {
        if (confirm("Are you sure you want to delete this award?")) {
            try {
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    id
                );
                toast.success("Award deleted");
                fetchData();
            } catch (error) {
                console.error("Error deleting award:", error);
                toast.error("Failed to delete award");
            }
        }
    };

    const handleDownloadCertificate = async (award: any) => {
        setGeneratingCert(true);
        try {
            // Prepare certificate data
            const certData = {
                $id: award.$id,
                name: award.registration?.name || 'Winner',
                school: award.registration?.school,
                eventType: award.eventType,
                awardCategory: award.category,
                committee: award.registration?.committee,
                eventDate: 'November 2024', // Could be dynamic
                eventLocation: 'Arsenic Summit'
            };

            const blob = await generateCertificate(certData, selectedTemplate);
            downloadBlob(blob, `certificate-${award.registration?.name || 'winner'}.pdf`);
            toast.success("Certificate downloaded");
        } catch (error) {
            console.error("Certificate generation error:", error);
            toast.error("Failed to generate certificate");
        } finally {
            setGeneratingCert(false);
        }
    };

    const handleBatchDownload = async () => {
        if (filteredAwards.length === 0) return;

        setGeneratingCert(true);
        toast.loading("Generating batch certificates...");

        try {
            const certsData = filteredAwards.map(award => ({
                $id: award.$id,
                name: award.registration?.name || 'Winner',
                school: award.registration?.school,
                eventType: award.eventType,
                awardCategory: award.category,
                committee: award.registration?.committee,
                eventDate: 'November 2024',
                eventLocation: 'Arsenic Summit'
            }));

            const blob = await generateBatchCertificates(certsData, selectedTemplate);
            downloadBlob(blob, `certificates-batch-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success("Batch certificates downloaded");
        } catch (error) {
            console.error("Batch generation error:", error);
            toast.error("Failed to generate batch certificates");
        } finally {
            setGeneratingCert(false);
        }
    };

    const handlePreview = (award: any) => {
        setPreviewData(award);
        setIsPreviewOpen(true);
    };

    const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                try {
                    let successCount = 0;
                    const rows = results.data as any[];

                    for (const row of rows) {
                        // Expected CSV format: email, eventType, category, remarks
                        if (!row.email || !row.eventType || !row.category) continue;

                        // Find registration by email
                        const reg = registrations.find(r => r.email?.toLowerCase() === row.email.toLowerCase());
                        if (!reg) continue;

                        await databases.createDocument(
                            DATABASE_ID,
                            COLLECTIONS.AWARDS,
                            ID.unique(),
                            {
                                eventType: row.eventType,
                                category: row.category,
                                registration: reg.$id,
                                remarks: row.remarks || "",
                                published: true,
                                awardedAt: new Date().toISOString(),
                            }
                        );
                        successCount++;
                    }

                    toast.success(`Successfully imported ${successCount} awards`);
                    fetchData();
                } catch (error) {
                    console.error("Import error:", error);
                    toast.error("Failed to import awards");
                } finally {
                    setImporting(false);
                    // Reset file input
                    event.target.value = '';
                }
            },
            error: (error) => {
                console.error("CSV Parse error:", error);
                toast.error("Failed to parse CSV file");
                setImporting(false);
            }
        });
    };

    const resetForm = () => {
        setEditingAward(null);
        setSelectedEvent("");
        setSelectedCategory("");
        setSelectedWinner("");
        setRemarks("");
    };

    const openEditModal = (award: any) => {
        setEditingAward(award);
        setSelectedEvent(award.eventType);
        setSelectedCategory(award.category);
        setSelectedWinner(award.registration?.$id);
        setRemarks(award.remarks || "");
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        Awards & Recognition
                    </h1>
                    <p className="text-gray-400 mt-1">Manage winners and generate certificates</p>
                </div>
                <div className="flex gap-3">
                    <Select
                        size="sm"
                        label="Template"
                        className="w-40"
                        selectedKeys={[selectedTemplate]}
                        onChange={(e) => setSelectedTemplate(e.target.value as CertificateTemplate)}
                    >
                        <SelectItem key="modern" value="modern">Modern</SelectItem>
                        <SelectItem key="classic" value="classic">Classic</SelectItem>
                        <SelectItem key="formal" value="formal">Formal</SelectItem>
                    </Select>

                    <Button
                        variant="flat"
                        startContent={<Download size={18} />}
                        onClick={handleBatchDownload}
                        isLoading={generatingCert}
                        isDisabled={filteredAwards.length === 0}
                    >
                        Download All
                    </Button>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleCSVImport}
                            disabled={importing}
                        />
                        <Button
                            variant="flat"
                            color="secondary"
                            startContent={<Share2 size={18} />}
                            isLoading={importing}
                        >
                            Import CSV
                        </Button>
                    </div>

                    <Button
                        color="primary"
                        startContent={<Plus size={18} />}
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                    >
                        Assign Award
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card className="bg-zinc-900/50 border border-white/10 mb-6">
                <CardBody className="p-4">
                    <Input
                        placeholder="Search winners, categories, or events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<Search size={16} />}
                        classNames={{ inputWrapper: "bg-black/50 border border-white/10" }}
                        size="lg"
                    />
                </CardBody>
            </Card>

            {/* Awards Table */}
            <Card className="bg-zinc-900/50 border border-white/10">
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-4">
                            <TableSkeleton />
                        </div>
                    ) : (
                        <Table
                            aria-label="Awards table"
                            classNames={{ wrapper: "bg-transparent", th: "bg-zinc-800/50" }}
                        >
                            <TableHeader>
                                <TableColumn>WINNER</TableColumn>
                                <TableColumn>EVENT</TableColumn>
                                <TableColumn>AWARD</TableColumn>
                                <TableColumn>SCHOOL</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent="No awards assigned yet">
                                {filteredAwards.map((award) => (
                                    <TableRow key={award.$id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    name={award.registration?.name}
                                                    className="w-8 h-8 text-tiny"
                                                />
                                                <div>
                                                    <p className="font-semibold">{award.registration?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{award.registration?.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="sm" variant="flat" color="primary">
                                                {award.eventType?.replace(/_/g, ' ')}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getAwardTierColor(award.category).bg} ${getAwardTierColor(award.category).text}`}>
                                                <Trophy size={12} />
                                                {getAwardLabel(award.category)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{award.registration?.school || '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    isIconOnly
                                                    onClick={() => handlePreview(award)}
                                                    title="Preview Certificate"
                                                >
                                                    <Award size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    isIconOnly
                                                    onClick={() => handleDownloadCertificate(award)}
                                                    title="Download Certificate"
                                                >
                                                    <Download size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    isIconOnly
                                                    onClick={() => openEditModal(award)}
                                                    title="Edit Award"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    isIconOnly
                                                    onClick={() => handleDeleteAward(award.$id)}
                                                    title="Delete Award"
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
                </CardBody>
            </Card>

            {/* Award Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <ModalContent>
                    <ModalHeader>
                        {editingAward ? 'Edit Award' : 'Assign New Award'}
                    </ModalHeader>
                    <ModalBody className="py-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Event Type"
                                    placeholder="Select event"
                                    selectedKeys={selectedEvent ? [selectedEvent] : []}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    isDisabled={!selectedEvent}
                                >
                                    {getAwardCategoriesForEvent(selectedEvent).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {getAwardLabel(category)}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <Autocomplete
                                label="Winner"
                                placeholder="Search for attendee"
                                defaultItems={eligibleRegistrations}
                                selectedKey={selectedWinner}
                                onSelectionChange={(key) => setSelectedWinner(key as string)}
                                isDisabled={!selectedEvent}
                            >
                                {(item) => (
                                    <AutocompleteItem key={item.$id} textValue={item.name}>
                                        <div className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <span className="text-tiny text-gray-400">{item.school}</span>
                                        </div>
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>

                            <Input
                                label="Remarks (Optional)"
                                placeholder="Any special notes or comments"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleSaveAward}>
                            Save Award
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Certificate Preview Modal */}
            <CertificatePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={previewData}
            />
        </div >
    );
}
