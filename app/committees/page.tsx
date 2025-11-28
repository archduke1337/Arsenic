"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Chip, Tabs, Tab, Spinner } from "@heroui/react";
import { Globe, Users, Gavel, MapPin, User } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

interface Committee {
    $id: string;
    name: string;
    abbreviation: string;
    type: string;
    description: string;
    agenda?: string;
    chairperson?: string;
    viceChairperson?: string;
    rapporteur?: string;
    portfolios: string[];
    capacity: number;
    imageUrl?: string;
    linkedEventId?: string;
}

export default function CommitteesPage() {
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("all");

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
            setCommittees(response.documents as unknown as Committee[]);
        } catch (error) {
            console.error("Error fetching committees:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCommittees = selectedType === "all"
        ? committees
        : committees.filter(c => c.type.toLowerCase() === selectedType);

    const getTypeIcon = (type: string) => {
        const lower = type.toLowerCase();
        if (lower.includes("international")) return <Globe size={20} />;
        if (lower.includes("national")) return <Gavel size={20} />;
        return <Users size={20} />;
    };

    return (
        <div className="min-h-screen py-16 px-6 bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <Chip color="primary" variant="flat" className="mb-4">
                        Committees
                    </Chip>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">Committees</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Explore our diverse range of committees offering unique opportunities to debate, deliberate, and develop diplomatic skills.
                    </p>
                </div>

                {/* Filter Tabs */}
                <Tabs
                    selectedKey={selectedType}
                    onSelectionChange={(key) => setSelectedType(key as string)}
                    className="mb-8"
                    classNames={{
                        tabList: "w-full max-w-md mx-auto",
                        cursor: "bg-primary",
                        tab: "font-medium",
                    }}
                >
                    <Tab key="all" title="All Committees" />
                    <Tab key="international" title="International" />
                    <Tab key="national" title="National" />
                </Tabs>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" label="Loading committees..." />
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredCommittees.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No committees available yet.</p>
                    </div>
                )}

                {/* Committee Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommittees.map((committee) => (
                        <Card
                            key={committee.$id}
                            className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            <CardBody className="p-0">
                                {/* Committee Image */}
                                {committee.imageUrl && (
                                    <div className="relative h-40 bg-gradient-to-br from-blue-900 to-slate-900">
                                        <img
                                            src={committee.imageUrl}
                                            alt={committee.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Type Badge */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            startContent={getTypeIcon(committee.type)}
                                            color={committee.type.toLowerCase().includes("international") ? "primary" : "success"}
                                        >
                                            {committee.type}
                                        </Chip>
                                        <Chip size="sm" variant="flat" color="warning">
                                            {committee.abbreviation}
                                        </Chip>
                                    </div>

                                    {/* Committee Name */}
                                    <h3 className="text-xl font-bold mb-2">{committee.name}</h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {committee.description}
                                    </p>

                                    {/* Chairperson */}
                                    {committee.chairperson && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <User size={16} />
                                            <span>Chaired by {committee.chairperson}</span>
                                        </div>
                                    )}

                                    {/* Capacity */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <MapPin size={16} />
                                        <span>{committee.capacity} portfolios available</span>
                                    </div>

                                    {/* Portfolios Preview */}
                                    {committee.portfolios.length > 0 && (
                                        <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                            <p className="text-xs text-gray-500 mb-2">Sample Portfolios:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {committee.portfolios.slice(0, 3).map((portfolio, idx) => (
                                                    <Chip key={idx} size="sm" variant="bordered" className="text-xs">
                                                        {portfolio}
                                                    </Chip>
                                                ))}
                                                {committee.portfolios.length > 3 && (
                                                    <Chip size="sm" variant="bordered" className="text-xs">
                                                        +{committee.portfolios.length - 3} more
                                                    </Chip>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
