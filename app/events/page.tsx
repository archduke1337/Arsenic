"use client";

export const dynamic = 'force-dynamic';

import { Button, Card, CardBody, CardFooter, Chip, Input, Tab, Tabs, Spinner } from "@nextui-org/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS, EVENT_TYPE_LABELS } from "@/lib/schema";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

interface EventDoc {
    $id: string;
    id?: string;
    name: string;
    type: string;
    description: string;
    date?: string;
    venue?: string;
    image?: string;
    category?: string;
    title?: string;
    delegates?: number;
}

export default function Events() {
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [events, setEvents] = useState<EventDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.EVENTS,
                [Query.equal("isActive", true), Query.orderDesc("$createdAt")]
            );
            setEvents(response.documents as unknown as EventDoc[]);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === "all" || event.type === filter;
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Chip color="secondary" variant="flat" className="mb-4">2024 EDITION</Chip>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Committees</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Explore the diverse range of committees and simulations designed to challenge and inspire.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter & Search Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Tabs
                        aria-label="Filter Events"
                        color="secondary"
                        variant="light"
                        selectedKey={filter}
                        onSelectionChange={(key) => setFilter(key.toString())}
                        classNames={{
                            tabList: "bg-transparent",
                            cursor: "bg-white/10",
                            tab: "text-gray-400 data-[selected=true]:text-white"
                        }}
                    >
                        <Tab key="all" title="All Events" />
                        <Tab key="international" title="International" />
                        <Tab key="national" title="National" />
                        <Tab key="debate" title="Debate" />
                    </Tabs>

                    <Input
                        classNames={{
                            base: "max-w-xs",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                        }}
                        placeholder="Search committees..."
                        size="sm"
                        startContent={<Search size={18} />}
                        type="search"
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" color="secondary" label="Loading events..." />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event) => (
                            <motion.div
                                key={event.$id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-zinc-900 border border-white/10 hover:border-purple-500/50 transition-all h-full group">
                                    <div className="relative h-48 overflow-hidden">
                                        {event.image && (
                                            <Image
                                                alt={event.title || "Event image"}
                                                className="z-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                src={event.image}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                        <Chip
                                            className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/20 text-white"
                                            size="sm"
                                        >
                                            {event.category?.toUpperCase()}
                                        </Chip>
                                    </div>
                                    <CardBody className="p-6">
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{event.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <div className="space-y-3 text-sm text-gray-300">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={16} className="text-purple-500" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={16} className="text-purple-500" />
                                                {event.venue}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users size={16} className="text-purple-500" />
                                                {event.delegates} Delegates
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter className="p-6 pt-0">
                                        <Button
                                            as={Link}
                                            href={`/register?event=${event.$id}`}
                                            className="w-full bg-white/5 hover:bg-purple-600 hover:text-white text-white border border-white/10 transition-all"
                                            endContent={<ArrowRight size={16} />}
                                        >
                                            Register Now
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                )}

                {!loading && filteredEvents.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No committees found matching your criteria.</p>
                        <Button
                            variant="light"
                            color="secondary"
                            className="mt-4"
                            onClick={() => { setFilter("all"); setSearchQuery(""); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div >
    );
}
