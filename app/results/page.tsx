"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Input, Select, SelectItem, Button,
    Chip, Avatar, Spinner, Pagination
} from "@heroui/react";
import { Search, Trophy, Medal, ChevronRight } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPES } from "@/lib/schema";
import { Query } from "appwrite";
import { getAwardLabel, getAwardTierColor } from "@/lib/award-categories";
import Link from "next/link";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function ResultsPage() {
    const [awards, setAwards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("ALL");
    const [page, setPage] = useState(1);

    const itemsPerPage = 12;

    useEffect(() => {
        const fetchAwards = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    [
                        Query.equal("published", true),
                        Query.orderDesc("$createdAt"),
                        Query.limit(100)
                    ]
                );
                setAwards(response.documents as unknown as any[]);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAwards();
    }, []);

    const filteredAwards = useMemo(() => {
        return awards.filter(award => {
            // Event filter
            if (selectedEvent !== "ALL" && award.eventType !== selectedEvent) return false;

            // Search filter
            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                const name = award.registration?.name?.toLowerCase() || "";
                const school = award.registration?.school?.toLowerCase() || "";
                const category = getAwardLabel(award.category).toLowerCase();

                return name.includes(searchLower) ||
                    school.includes(searchLower) ||
                    category.includes(searchLower);
            }

            return true;
        });
    }, [awards, selectedEvent, searchQuery]);

    const paginatedAwards = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredAwards.slice(start, start + itemsPerPage);
    }, [filteredAwards, page]);

    const totalPages = Math.ceil(filteredAwards.length / itemsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                        Hall of Fame
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Celebrating the exceptional talent and achievements of Arsenic Summit 2024.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                    <Input
                        placeholder="Search winners, schools, or awards..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<Search className="text-gray-400" />}
                        classNames={{
                            inputWrapper: "bg-zinc-900 border border-white/10 h-12",
                        }}
                        className="flex-grow"
                    />
                    <Select
                        placeholder="Filter by Event"
                        selectedKeys={[selectedEvent]}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        classNames={{
                            trigger: "bg-zinc-900 border border-white/10 h-12",
                        }}
                        className="w-full md:w-64"
                    >
                        {["ALL", ...EVENT_TYPES].map((event) => (
                            <SelectItem key={event} value={event}>
                                {event === "ALL" ? "All Events" : event.replace(/_/g, ' ')}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Results Grid */}
                {filteredAwards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedAwards.map((award) => {
                            const colors = getAwardTierColor(award.category);

                            return (
                                <Link href={`/results/${award.$id}`} key={award.$id}>
                                    <Card className="bg-zinc-900/50 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 group h-full">
                                        <CardBody className="p-6 space-y-6">
                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors.gradient} bg-opacity-10`}>
                                                    <Trophy className="text-white w-6 h-6" />
                                                </div>
                                                <Chip size="sm" variant="flat" className="bg-white/5">
                                                    {award.eventType?.replace(/_/g, ' ')}
                                                </Chip>
                                            </div>

                                            {/* Winner Info */}
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold group-hover:text-yellow-400 transition-colors">
                                                    {award.registration?.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {award.registration?.school || 'Independent'}
                                                </p>
                                            </div>

                                            {/* Award Badge */}
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                                                <Medal size={14} />
                                                {getAwardLabel(award.category)}
                                            </div>

                                            {/* Footer */}
                                            <div className="pt-4 border-t border-white/5 flex justify-between items-center text-sm text-gray-500">
                                                <span>View Certificate</span>
                                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
                        <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">No results found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <Pagination
                            total={totalPages}
                            page={page}
                            onChange={setPage}
                            color="warning"
                            size="lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
