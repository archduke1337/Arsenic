"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Textarea, Avatar,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner
} from "@nextui-org/react";
import { Plus, Edit, Trash2, Award } from "lucide-react";
import { toast, Toaster } from "sonner";

interface AlumniFormData {
    name: string;
    email: string;
    institution: string;
    graduationYear: string;
    bio: string;
    profileImageUrl: string;
    linkedinUrl: string;
    achievements: string;
    isActive: boolean;
}

export default function AdminAlumni() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [alumni, setAlumni] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingAlumni, setEditingAlumni] = useState<any>(null);
    const [searchText, setSearchText] = useState("");

    const [formData, setFormData] = useState<AlumniFormData>({
        name: "",
        email: "",
        institution: "",
        graduationYear: "",
        bio: "",
        profileImageUrl: "",
        linkedinUrl: "",
        achievements: "",
        isActive: true,
    });

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/alumni');
            if (!response.ok) throw new Error('Failed to fetch alumni');
            const data = await response.json();
            setAlumni(data.documents || data);
        } catch (error) {
            console.error("Error fetching alumni:", error);
            toast.error("Failed to load alumni");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingAlumni(null);
        setFormData({
            name: "",
            email: "",
            institution: "",
            graduationYear: "",
            bio: "",
            profileImageUrl: "",
            linkedinUrl: "",
            achievements: "",
            isActive: true,
        });
        onOpen();
    };

    const handleOpenEdit = (alumnus: any) => {
        setEditingAlumni(alumnus);
        setFormData({
            name: alumnus.name,
            email: alumnus.email,
            institution: alumnus.institution || "",
            graduationYear: alumnus.graduationYear || "",
            bio: alumnus.bio || "",
            profileImageUrl: alumnus.profileImageUrl || "",
            linkedinUrl: alumnus.linkedinUrl || "",
            achievements: (alumnus.achievements || []).join(", "),
            isActive: alumnus.isActive ?? true,
        });
        onOpen();
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Name and email are required");
            return;
        }

        setSaving(true);
        try {
            const alumniData = {
                name: formData.name,
                email: formData.email,
                institution: formData.institution,
                graduationYear: formData.graduationYear,
                bio: formData.bio,
                profileImageUrl: formData.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
                linkedinUrl: formData.linkedinUrl,
                achievements: formData.achievements.split(",").map(a => a.trim()).filter(a => a),
                isActive: formData.isActive,
                joinedAt: editingAlumni ? editingAlumni.joinedAt : new Date().toISOString(),
            };

            if (editingAlumni) {
                const response = await fetch('/api/admin/alumni', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingAlumni.$id, ...alumniData })
                });
                if (!response.ok) throw new Error('Update failed');
                toast.success("Alumni updated successfully");
            } else {
                const response = await fetch('/api/admin/alumni', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alumniData)
                });
                if (!response.ok) throw new Error('Create failed');
                toast.success("Alumni added successfully");
            }

            fetchAlumni();
            onOpenChange();
        } catch (error) {
            console.error("Error saving alumni:", error);
            toast.error("Failed to save alumni");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this alumni record?")) return;

        try {
            const response = await fetch(`/api/admin/alumni?id=${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            toast.success("Alumni deleted");
            fetchAlumni();
        } catch (error) {
            console.error("Error deleting alumni:", error);
            toast.error("Failed to delete alumni");
        }
    };

    const filteredAlumni = alumni.filter(a =>
        a.name.toLowerCase().includes(searchText.toLowerCase()) ||
        a.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Alumni Management</h1>
                    <p className="text-gray-500">Manage past participants and alumni network</p>
                </div>
                <Button color="primary" startContent={<Plus size={20} />} size="lg" onPress={handleOpenCreate}>
                    Add Alumni
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Total Alumni</p>
                        <p className="text-2xl font-bold text-blue-500">{alumni.length}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">Active Profiles</p>
                        <p className="text-2xl font-bold text-green-500">{alumni.filter(a => a.isActive).length}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4">
                        <p className="text-sm text-gray-500">With Achievements</p>
                        <p className="text-2xl font-bold text-purple-500">{alumni.filter(a => a.achievements?.length > 0).length}</p>
                    </CardBody>
                </Card>
            </div>

            {/* Search */}
            <Input
                placeholder="Search by name or email..."
                value={searchText}
                onValueChange={setSearchText}
                className="max-w-sm"
            />

            {/* Table */}
            {loading ? (
                <div className="flex justify-center p-8">
                    <Spinner />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>EMAIL</TableColumn>
                        <TableColumn>INSTITUTION</TableColumn>
                        <TableColumn>YEAR</TableColumn>
                        <TableColumn>ACHIEVEMENTS</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No alumni found">
                        {filteredAlumni.map((alumnus) => (
                            <TableRow key={alumnus.$id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            size="sm"
                                            src={alumnus.profileImageUrl}
                                            name={alumnus.name}
                                        />
                                        <span className="font-medium">{alumnus.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{alumnus.email}</TableCell>
                                <TableCell>{alumnus.institution || "-"}</TableCell>
                                <TableCell>{alumnus.graduationYear || "-"}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {alumnus.achievements?.slice(0, 2).map((achievement: string, idx: number) => (
                                            <Chip key={idx} size="sm" startContent={<Award size={14} />} variant="flat">
                                                {achievement}
                                            </Chip>
                                        ))}
                                        {(alumnus.achievements?.length || 0) > 2 && (
                                            <Chip size="sm" variant="flat">
                                                +{alumnus.achievements.length - 2}
                                            </Chip>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {alumnus.isActive ? (
                                        <Chip size="sm" color="success" variant="flat">
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
                                            onClick={() => handleOpenEdit(alumnus)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onClick={() => handleDelete(alumnus.$id)}
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
                                {editingAlumni ? "Edit Alumni" : "Add New Alumni"}
                            </ModalHeader>
                            <ModalBody className="gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Name"
                                        placeholder="Full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Institution"
                                        placeholder="e.g., Harvard University"
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    />
                                    <Input
                                        label="Graduation Year"
                                        placeholder="2024"
                                        value={formData.graduationYear}
                                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                    />
                                </div>
                                <Textarea
                                    label="Bio"
                                    placeholder="Professional bio and achievements..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    minRows={3}
                                />
                                <Input
                                    label="Achievements (comma separated)"
                                    placeholder="Best Speaker 2023, Policy Analyst, etc."
                                    value={formData.achievements}
                                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="LinkedIn URL"
                                        placeholder="https://linkedin.com/in/..."
                                        value={formData.linkedinUrl}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    />
                                    <Input
                                        label="Profile Image URL"
                                        placeholder="https://..."
                                        value={formData.profileImageUrl}
                                        onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleSave} isLoading={saving}>
                                    {editingAlumni ? "Update" : "Add"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
