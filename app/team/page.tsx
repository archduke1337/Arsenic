"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardBody, Image as NextUIImage, Chip, Spinner } from "@nextui-org/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram, Mail, Github } from "lucide-react";
import Link from "next/link";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

interface TeamMember {
    $id: string;
    name: string;
    role: string;
    position: string;
    imageUrl?: string;
    bio?: string;
    socials?: Record<string, string>;
}

export default function Team() {
    const [secretariat, setSecretariat] = useState<TeamMember[]>([]);
    const [executiveBoard, setExecutiveBoard] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

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

            const members = response.documents as unknown as TeamMember[];
            setSecretariat(members.filter(m => m.position === "secretariat"));
            setExecutiveBoard(members.filter(m => m.position === "executive_board"));
        } catch (error) {
            console.error("Error fetching team:", error);
        } finally {
            setLoading(false);
        }
    };

    const SocialIcon = ({ type, href }: { type: string, href: string }) => {
        const icons = {
            linkedin: Linkedin,
            twitter: Twitter,
            instagram: Instagram,
            mail: Mail,
            github: Github
        };
        const Icon = icons[type as keyof typeof icons];
        return (
            <Link href={href} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                <Icon size={20} />
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <Chip color="primary" variant="dot" className="mb-6 border-white/20">THE MINDS BEHIND THE MAGIC</Chip>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Team</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A team of dedicated individuals working tirelessly to bring you the best parliamentary simulation experience.
                    </p>
                </motion.div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-20">
                    <Spinner size="lg" label="Loading team..." color="primary" />
                </div>
            )}

            {/* Content */}
            {!loading && (
                <div className="max-w-7xl mx-auto px-6 pb-24">
                    {/* Secretariat Section */}
                    {secretariat.length > 0 && (
                        <div className="mb-32">
                            <h2 className="text-3xl font-bold mb-12 text-center">Secretariat</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {secretariat.map((member, index) => (
                                    <motion.div
                                        key={member.$id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <Card className="bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-all h-full group">
                                            <CardBody className="p-0 overflow-hidden relative aspect-[3/4]">
                                                <Image
                                                    alt={member.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                    src={member.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                                                    <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                                                    {member.bio && (
                                                        <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                            {member.bio}
                                                        </p>
                                                    )}
                                                    {member.socials && Object.keys(member.socials).length > 0 && (
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                                            {Object.entries(member.socials).map(([type, href]) => (
                                                                <SocialIcon key={type} type={type} href={href as string} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Executive Board Section */}
                    {executiveBoard.length > 0 && (
                        <div className="mb-20">
                            <h2 className="text-3xl font-bold mb-12 text-center">Executive Board</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {executiveBoard.map((member, index) => (
                                    <motion.div
                                        key={member.$id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="group relative">
                                            <div className="relative overflow-hidden rounded-2xl aspect-square mb-4 border border-white/10">
                                                <Image
                                                    alt={member.name}
                                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    src={member.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{member.name}</h3>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!secretariat.length && !executiveBoard.length && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No team members added yet.</p>
                        </div>
                    )}

                    {/* Join Team CTA */}
                    <div className="mt-32 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 p-12 text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Want to join the team?</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                We are always looking for passionate individuals to join our organizing committee.
                                Applications for the next edition open soon.
                            </p>
                            <Button
                                variant="bordered"
                                className="text-white border-white/20 hover:bg-white/10"
                                size="lg"
                            >
                                View Open Positions
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
