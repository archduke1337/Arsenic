"use client";

import { useState } from "react";
import { Card, CardBody, Button, Input, Tab, Tabs } from "@heroui/react";
import { Upload, FileText, Download, Trash2, Link as LinkIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ResourcesPage() {
    const [resources, setResources] = useState([
        { id: 1, name: "UNSC Study Guide.pdf", type: "pdf", size: "2.4 MB", date: "2024-11-20" },
        { id: 2, name: "Rules of Procedure.pdf", type: "pdf", size: "1.1 MB", date: "2024-11-15" },
    ]);

    const handleUpload = () => {
        toast.success("File uploaded successfully");
        // Implement actual upload logic
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Resources & Documents</h1>
                    <p className="text-gray-400">Share study guides and view delegate submissions</p>
                </div>
                <Button color="primary" startContent={<Upload size={18} />} onClick={handleUpload}>
                    Upload Resource
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chair Resources */}
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-yellow-400" />
                            Shared Documents
                        </h3>
                        <div className="space-y-3">
                            {resources.map((res) => (
                                <div key={res.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded bg-red-500/20 text-red-400">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{res.name}</p>
                                            <p className="text-xs text-gray-500">{res.size} • {res.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button isIconOnly size="sm" variant="flat" title="Download">
                                            <Download size={16} />
                                        </Button>
                                        <Button isIconOnly size="sm" color="danger" variant="flat" title="Delete">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Delegate Submissions */}
                <Card className="bg-zinc-900/50 border border-white/10">
                    <CardBody className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <LinkIcon size={20} className="text-blue-400" />
                            Position Papers
                        </h3>
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                            <FileText size={32} className="mb-2 opacity-50" />
                            <p>No submissions yet</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
