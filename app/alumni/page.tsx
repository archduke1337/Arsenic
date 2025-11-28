"use client";

import { Card, CardBody, Avatar, Chip, Button, Input, Spinner } from "@nextui-org/react";
import { Twitter, Linkedin, Globe, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function Alumni() {
    const [alumni, setAlumni] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ALUMNI,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            setAlumni(response.documents as any[]);
        } catch (error) {
            console.error("Error fetching alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-6 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <Chip color="warning" variant="flat" className="mb-4">Legacy of Excellence</Chip>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Arsenic Alumni Network
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Our graduates are making waves across the globe in policy, law, technology, and leadership.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button size="lg" color="warning" variant="shadow">
                            Join Alumni Network
                        </Button>
                        <Button size="lg" variant="bordered" className="border-white/20">
                            View Success Stories
                        </Button>
                    </div>
                </div>

                {/* Alumni Grid */}
                {alumni.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {alumni.map((person) => (
                            <Card key={person.$id} className="bg-zinc-900/50 border border-white/10 hover:scale-105 transition-transform duration-300">
                                <CardBody className="p-6 text-center">
                                    <div className="relative inline-block mb-4">
                                        <Avatar
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                                            className="w-24 h-24 mx-auto"
                                            isBordered
                                            color="warning"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-amber-100/20 dark:bg-amber-900/50 p-1.5 rounded-full border-2 border-zinc-900">
                                            <Award size={16} className="text-amber-400" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                                    <p className="text-yellow-400 text-sm font-medium mb-2">{person.institution || 'Alumni'}</p>
                                    <p className="text-gray-300 text-sm mb-4 h-10">{person.bio || 'Member'}</p>

                                    {person.achievements && person.achievements.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            {person.achievements.slice(0, 2).map((achievement: string, i: number) => (
                                                <Chip key={i} size="sm" variant="flat" className="bg-amber-900/30 text-amber-300">
                                                    {achievement}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-3">
                                        {person.linkedinUrl && (
                                            <Button isIconOnly size="sm" variant="light" as="a" href={person.linkedinUrl} target="_blank">
                                                <Linkedin size={18} />
                                            </Button>
                                        )}
                                        <Button isIconOnly size="sm" variant="light"><Twitter size={18} /></Button>
                                        <Button isIconOnly size="sm" variant="light"><Globe size={18} /></Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 mb-20">
                        <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">No alumni yet</h3>
                        <p className="text-gray-500 mt-2">Alumni network coming soon</p>
                    </div>
                )}

                {/* Newsletter Section */}
                <div className="bg-gradient-to-r from-yellow-900/40 via-orange-900/40 to-red-900/40 rounded-3xl p-12 text-center relative overflow-hidden border border-yellow-500/20">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
                        <p className="text-yellow-200/80 mb-8">
                            Subscribe to our alumni newsletter for exclusive updates, mentorship opportunities, and reunion events.
                        </p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <Input
                                placeholder="Enter your email"
                                classNames={{ inputWrapper: "bg-white/10 border-white/20 text-white" }}
                            />
                            <Button color="warning" className="font-bold">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
