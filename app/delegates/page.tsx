"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardBody, Avatar, Input, Button, Chip, Select, SelectItem, Pagination, Spinner } from "@nextui-org/react";
import { Search, Filter, MapPin, MessageCircle, Linkedin } from "lucide-react";
import { EVENT_TYPES, EVENT_TYPE_LABELS } from "@/lib/schema";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function DelegateDirectory() {
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [delegates, setDelegates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDelegates();
    }, []);

    const fetchDelegates = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.REGISTRATIONS,
                [Query.limit(100)]
            );
            setDelegates(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching delegates:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDelegates = useMemo(() => {
        return delegates.filter(d => {
            const matchesSearch = (d.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
                (d.institution?.toLowerCase().includes(search.toLowerCase()) ?? false);
            const matchesEvent = eventFilter === "all" || d.eventType === eventFilter;
            return matchesSearch && matchesEvent;
        });
    }, [search, eventFilter, delegates]);

    const paginatedDelegates = filteredDelegates.slice((page - 1) * 8, page * 8);

    if (loading) {
        return (
            <div className="min-h-screen py-16 px-6 bg-gray-50 dark:bg-black flex items-center justify-center">
                <Spinner label="Loading delegate directory..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-6 bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 dark:text-white">Delegate Directory</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Connect with fellow participants, find teammates, and build your network before the summit begins.
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-8 sticky top-20 z-30 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
                    <CardBody className="p-4 flex flex-col md:flex-row gap-4">
                        <Input
                            startContent={<Search className="text-gray-400" />}
                            placeholder="Search by name or institution..."
                            value={search}
                            onValueChange={setSearch}
                            className="flex-1"
                            classNames={{ inputWrapper: "dark:bg-zinc-800" }}
                        />
                        <div className="w-full md:w-[250px]">
                            <Select
                                selectedKeys={[eventFilter]}
                                onChange={(e) => setEventFilter(e.target.value)}
                                startContent={<Filter size={16} className="text-gray-400" />}
                                items={[
                                    { key: "all", label: "All Events" },
                                    ...EVENT_TYPES.map(type => ({ key: type, label: EVENT_TYPE_LABELS[type] }))
                                ]}
                                classNames={{ popoverContent: "dark:bg-zinc-900" }}
                            >
                                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                    </CardBody>
                </Card>

                {/* Grid or Empty State */}
                {paginatedDelegates.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {paginatedDelegates.map((delegate) => (
                                <Card key={delegate.$id} className="hover:border-primary dark:border-white/10 border-2 border-transparent transition-all dark:bg-zinc-900">
                                    <CardBody className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <Avatar 
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${delegate.name}`} 
                                                size="lg" 
                                                isBordered 
                                            />
                                        </div>

                                        <h3 className="font-bold text-lg mb-1 dark:text-white">{delegate.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                                            <MapPin size={14} /> {delegate.institution}
                                        </p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Event</span>
                                                <span className="font-medium dark:text-white">{EVENT_TYPE_LABELS[delegate.eventType as keyof typeof EVENT_TYPE_LABELS] || delegate.eventType}</span>
                                            </div>
                                            {delegate.committee && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Committee</span>
                                                    <span className="font-medium dark:text-white">{delegate.committee}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button fullWidth color="primary" variant="flat" startContent={<MessageCircle size={18} />} isDisabled>
                                                Connect
                                            </Button>
                                            <Button isIconOnly variant="light">
                                                <Linkedin size={20} />
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center">
                            <Pagination
                                total={Math.ceil(filteredDelegates.length / 8)}
                                page={page}
                                onChange={setPage}
                                size="lg"
                                showControls
                            />
                        </div>
                    </>
                ) : (
                    <Card className="bg-gray-50 dark:bg-zinc-900 border-0">
                        <CardBody className="p-12 text-center">
                            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No delegates found</p>
                            <p className="text-gray-400 dark:text-gray-500">Try adjusting your filters or search terms</p>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}
