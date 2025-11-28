"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Button, Input, Textarea, Select, SelectItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure, Avatar, Chip
} from "@nextui-org/react";
import { Plus, Edit, Trash2, User, Upload } from "lucide-react";
import { databases, storage } from "@/lib/appwrite";
import { COLLECTIONS, TeamMember } from "@/lib/schema";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";

export default function AdminTeam() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.TEAM_MEMBERS,
                [Query.orderAsc("displayOrder")]
            );
            setTeam(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching team:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        try {
            const response = await storage.createFile(
                BUCKET_ID,
                ID.unique(),
                imageFile
            );
            return storage.getFileView(BUCKET_ID, response.$id).toString();
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let imageUrl = editingMember?.imageUrl || "";
        if (imageFile) {
            const uploadedUrl = await uploadImage();
            if (uploadedUrl) imageUrl = uploadedUrl;
        }

        const teamMemberData = {
            name: formData.get("name") as string,
            role: formData.get("role") as string,
            position: formData.get("position") as string,
            bio: formData.get("bio") as string,
            email: formData.get("email") as string || undefined,
            phone: formData.get("phone") as string || undefined,
            imageUrl,
            socials: {
                linkedin: formData.get("linkedin") as string || undefined,
                twitter: formData.get("twitter") as string || undefined,
                instagram: formData.get("instagram") as string || undefined,
            },
            displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
        };

        try {
            if (editingMember) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.TEAM_MEMBERS,
                    editingMember.$id,
                    teamMemberData
                );
            } else {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.TEAM_MEMBERS,
                    ID.unique(),
                    teamMemberData
                );
            }

            fetchTeam();
            onOpenChange();
            resetForm();
        } catch (error) {
            console.error("Error saving team member:", error);
            alert("Failed to save team member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team member?")) return;

        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.TEAM_MEMBERS, id);
            fetchTeam();
        } catch (error) {
            console.error("Error deleting team member:", error);
            alert("Failed to delete team member");
        }
    };

    const openEdit = (member: any) => {
        setEditingMember(member);
        setImagePreview(member.imageUrl || "");
        onOpen();
    };

    const openCreate = () => {
        setEditingMember(null);
        resetForm();
        onOpen();
    };

    const resetForm = () => {
        setImageFile(null);
        setImagePreview("");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage Team</h1>
                    <p className="text-gray-500">Add and manage team members</p>
                </div>
                <Button color="primary" startContent={<Plus size={20} />} onPress={openCreate}>
                    Add Team Member
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <Card key={member.$id} className="hover:shadow-md transition-shadow">
                        <CardBody className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar
                                    src={member.imageUrl}
                                    name={member.name}
                                    size="lg"
                                    isBordered
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary text-sm">{member.role}</p>
                                    <Chip size="sm" variant="flat" className="mt-1">
                                        {member.position}
                                    </Chip>
                                </div>
                            </div>

                            {member.bio && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>
                            )}

                            <div className="flex gap-2">
                                <Button size="sm" variant="flat" startContent={<Edit size={16} />} onPress={() => openEdit(member)}>
                                    Edit
                                </Button>
                                <Button size="sm" color="danger" variant="flat" startContent={<Trash2 size={16} />} onPress={() => handleDelete(member.$id)}>
                                    Delete
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={handleSave}>
                            <ModalHeader>
                                {editingMember ? "Edit Team Member" : "Add Team Member"}
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Image Upload */}
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium mb-2 block">Profile Image</label>
                                        <div className="flex items-center gap-4">
                                            {imagePreview && (
                                                <Avatar src={imagePreview} size="lg" />
                                            )}
                                            <label className="cursor-pointer">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                                    <Upload size={18} />
                                                    <span className="text-sm">Upload Image</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <Input
                                        name="name"
                                        label="Full Name"
                                        placeholder="John Doe"
                                        defaultValue={editingMember?.name}
                                        isRequired
                                    />

                                    <Input
                                        name="role"
                                        label="Role/Title"
                                        placeholder="Secretary General"
                                        defaultValue={editingMember?.role}
                                        isRequired
                                    />

                                    <Select
                                        name="position"
                                        label="Position"
                                        placeholder="Select position"
                                        defaultSelectedKeys={editingMember ? [editingMember.position] : []}
                                        isRequired
                                    >
                                        <SelectItem key="secretariat" value="secretariat">
                                            Secretariat
                                        </SelectItem>
                                        <SelectItem key="executive_board" value="executive_board">
                                            Executive Board
                                        </SelectItem>
                                        <SelectItem key="organizing_committee" value="organizing_committee">
                                            Organizing Committee
                                        </SelectItem>
                                    </Select>

                                    <Input
                                        name="displayOrder"
                                        label="Display Order"
                                        type="number"
                                        placeholder="0"
                                        defaultValue={editingMember?.displayOrder?.toString()}
                                    />

                                    <Textarea
                                        name="bio"
                                        label="Bio"
                                        placeholder="Brief description..."
                                        defaultValue={editingMember?.bio}
                                        className="md:col-span-2"
                                    />

                                    <Input
                                        name="email"
                                        label="Email (Optional)"
                                        type="email"
                                        placeholder="john@example.com"
                                        defaultValue={editingMember?.email}
                                    />

                                    <Input
                                        name="phone"
                                        label="Phone (Optional)"
                                        placeholder="+91 1234567890"
                                        defaultValue={editingMember?.phone}
                                    />

                                    <Input
                                        name="linkedin"
                                        label="LinkedIn URL"
                                        placeholder="https://linkedin.com/in/..."
                                        defaultValue={editingMember?.socials?.linkedin}
                                    />

                                    <Input
                                        name="twitter"
                                        label="Twitter URL"
                                        placeholder="https://twitter.com/..."
                                        defaultValue={editingMember?.socials?.twitter}
                                    />

                                    <Input
                                        name="instagram"
                                        label="Instagram URL"
                                        placeholder="https://instagram.com/..."
                                        defaultValue={editingMember?.socials?.instagram}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="primary" type="submit">
                                    {editingMember ? "Update" : "Create"}
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
