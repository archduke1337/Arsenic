"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";
import { Building2 } from "lucide-react";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

const SPONSOR_TIERS = ['TITLE', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'] as const;

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.SPONSORS,
                [Query.orderAsc("displayOrder")]
            );
            setSponsors(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching sponsors:", error);
        } finally {
            setLoading(false);
        }
    };

    const sponsorsByTier = SPONSOR_TIERS.reduce((acc, tier) => {
        acc[tier] = sponsors.filter(s => s.tier === tier);
        return acc;
    }, {} as Record<string, any[]>);

    const tierInfo: Record<string, { gradient: string; size: string }> = {
        TITLE: { gradient: 'from-purple-500 to-pink-500', size: 'h-32' },
        PLATINUM: { gradient: 'from-gray-300 to-gray-400', size: 'h-28' },
        GOLD: { gradient: 'from-yellow-400 to-yellow-600', size: 'h-24' },
        SILVER: { gradient: 'from-gray-400 to-gray-500', size: 'h-20' },
        BRONZE: { gradient: 'from-orange-600 to-orange-700', size: 'h-16' },
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading sponsors...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white">
            {/* Header */}
            <div className="relative overflow-hidden py-20 bg-gradient-to-b from-purple-900/20 to-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative max-w-7xl mx-auto px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                        Our Sponsors
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We're grateful to our partners who make this event possible
                    </p>
                </div>
            </div>

            {/* Sponsors by Tier */}
            <div className="max-w-7xl mx-auto px-8 py-16 space-y-16">
                {SPONSOR_TIERS.map((tier) => {
                    const tierSponsors = sponsorsByTier[tier];
                    if (tierSponsors.length === 0) return null;

                    const info = tierInfo[tier];

                    return (
                        <div key={tier} className="space-y-8">
                            <div className="text-center">
                                <Chip
                                    size="lg"
                                    className={`bg-gradient-to-r ${info.gradient} text-white font-bold px-6 py-2 text-lg`}
                                >
                                    {tier} SPONSORS
                                </Chip>
                            </div>

                            <div className={`grid gap-8 ${tier === 'TITLE' ? 'grid-cols-1 md:grid-cols-2' : tier === 'PLATINUM' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                                {tierSponsors.map((sponsor) => (
                                    <Card
                                        key={sponsor.$id}
                                        className="bg-zinc-900/50 border border-white/10 hover:border-white/30 transition-all group cursor-pointer"
                                        isPressable
                                        onPress={() => sponsor.website && window.open(sponsor.website, '_blank')}
                                    >
                                        <CardBody className="p-8">
                                            <div className={`${info.size} flex items-center justify-center mb-4`}>
                                                {sponsor.logoUrl ? (
                                                    <img
                                                        src={sponsor.logoUrl}
                                                        alt={sponsor.name}
                                                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                                                    />
                                                ) : (
                                                    <Building2 size={48} className="text-gray-600" />
                                                )}
                                            </div>
                                            <h3 className="text-center font-semibold text-lg mb-2">{sponsor.name}</h3>
                                            {sponsor.description && (
                                                <p className="text-center text-sm text-gray-400 line-clamp-2">
                                                    {sponsor.description}
                                                </p>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {sponsors.length === 0 && (
                    <div className="text-center py-20">
                        <Building2 size={64} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-300">No sponsors yet</h3>
                        <p className="text-gray-500">Check back soon for our amazing partners!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
