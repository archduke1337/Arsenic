"use client";

import { Card, CardBody, Button, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { databases, Query } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Trash2, Mail, Clock } from "lucide-react";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function AdminContact() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CONTACT_SUBMISSIONS,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            setSubmissions(response.documents as any);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            toast.error("Failed to fetch contact submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (submissionId: string, newStatus: string) => {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.CONTACT_SUBMISSIONS,
                submissionId,
                { status: newStatus }
            );
            toast.success("Status updated");
            await fetchSubmissions();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (submissionId: string) => {
        if (confirm("Delete this submission permanently?")) {
            try {
                await databases.deleteDocument(
                    DATABASE_ID,
                    COLLECTIONS.CONTACT_SUBMISSIONS,
                    submissionId
                );
                toast.success("Submission deleted");
                await fetchSubmissions();
            } catch (error) {
                console.error("Error deleting submission:", error);
                toast.error("Failed to delete submission");
            }
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        if (filterStatus !== "ALL" && sub.status !== filterStatus) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                sub.name?.toLowerCase().includes(query) ||
                sub.email?.toLowerCase().includes(query) ||
                sub.subject?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <Toaster />
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Contact Submissions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filteredSubmissions.length} of {submissions.length} submissions
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8">
                    <Input
                        placeholder="Search by name, email, or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                        startContent={<Mail size={18} />}
                    />
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-48"
                        label="Status"
                    >
                        <SelectItem key="ALL" value="ALL">All Statuses</SelectItem>
                        <SelectItem key="new" value="new">New</SelectItem>
                        <SelectItem key="read" value="read">Read</SelectItem>
                        <SelectItem key="replied" value="replied">Replied</SelectItem>
                        <SelectItem key="archived" value="archived">Archived</SelectItem>
                    </Select>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                    {filteredSubmissions.length === 0 ? (
                        <Card className="bg-white/5 border border-white/10">
                            <CardBody className="p-12 text-center">
                                <p className="text-gray-400">No submissions found</p>
                            </CardBody>
                        </Card>
                    ) : (
                        filteredSubmissions.map((submission) => (
                            <Card key={submission.$id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                                <CardBody className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">
                                                    {submission.subject}
                                                </h3>
                                                <Chip
                                                    size="sm"
                                                    color={submission.status === "new" ? "warning" : submission.status === "replied" ? "success" : "default"}
                                                    variant="flat"
                                                >
                                                    {submission.status}
                                                </Chip>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span>{submission.name} ({submission.email})</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Date(submission.$createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Select
                                                size="sm"
                                                value={submission.status}
                                                onChange={(e) => handleStatusChange(submission.$id, e.target.value)}
                                                className="w-32"
                                            >
                                                <SelectItem key="new" value="new">New</SelectItem>
                                                <SelectItem key="read" value="read">Read</SelectItem>
                                                <SelectItem key="replied" value="replied">Replied</SelectItem>
                                                <SelectItem key="archived" value="archived">Archived</SelectItem>
                                            </Select>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                color="danger"
                                                variant="flat"
                                                onClick={() => handleDelete(submission.$id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                                        {submission.message}
                                    </p>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
