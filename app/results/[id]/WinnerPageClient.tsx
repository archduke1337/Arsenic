"use client";

import { getAwardLabel, getAwardTierColor } from "@/lib/award-categories";
import { Button, Card, CardBody } from "@nextui-org/react";
import { Trophy, Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import WinnerCertificateDownload from "@/components/results/WinnerCertificateDownload";
import SocialShareButtons from "@/components/results/SocialShareButtons";
import { Models } from "appwrite";

interface AwardDocument extends Models.Document {
    category: string;
    eventType?: string;
    awardedAt?: string;
    registration?: {
        name?: string;
        school?: string;
        committee?: string;
    };
}

interface WinnerPageClientProps {
    award: AwardDocument | null;
}

export default function WinnerPageClient({ award }: WinnerPageClientProps) {
    if (!award) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white flex flex-col items-center justify-center p-4">
                <Trophy className="w-16 h-16 text-gray-600 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Award Not Found</h1>
                <p className="text-gray-400 mb-6">The award you are looking for does not exist or has been removed.</p>
                <Link href="/results">
                    <Button color="primary" variant="flat">Back to Results</Button>
                </Link>
            </div>
        );
    }

    const colors = getAwardTierColor(award.category);
    const awardLabel = getAwardLabel(award.category);
    const eventName = award.eventType?.replace(/_/g, ' ');

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white p-6 md:p-12 flex items-center justify-center">
            <div className="max-w-4xl w-full space-y-8">

                {/* Back Link */}
                <Link href="/results" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Hall of Fame
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Column - Visual */}
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity duration-500`}></div>
                        <Card className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
                            <CardBody className="p-12 flex flex-col items-center text-center space-y-6">
                                <div className={`p-6 rounded-full bg-gradient-to-br ${colors.gradient} bg-opacity-20 shadow-lg shadow-${colors.text}/20`}>
                                    <Trophy className="w-16 h-16 text-white" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">{award.registration?.name}</h2>
                                    <p className="text-xl text-gray-400">{award.registration?.school || 'Independent Delegate'}</p>
                                </div>

                                <div className={`px-6 py-2 rounded-full text-lg font-bold ${colors.bg} ${colors.text}`}>
                                    {awardLabel}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column - Details & Actions */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Congratulations!
                            </h1>
                            <p className="text-gray-400 text-lg">
                                For an outstanding performance at Arsenic Summit 2024.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                    <Trophy size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Event</p>
                                    <p className="font-semibold">{eventName}</p>
                                </div>
                            </div>

                            {award.registration?.committee && (
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Committee/Constituency</p>
                                        <p className="font-semibold">{award.registration.committee}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Date Awarded</p>
                                    <p className="font-semibold">
                                        {new Date(award.awardedAt || award.$createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <WinnerCertificateDownload award={award} />

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-400 mb-3">Share achievement</p>
                                <SocialShareButtons
                                    title={`I won ${awardLabel} at Arsenic Summit 2024!`}
                                    url={`https://arsenicsummit.com/results/${award.$id}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
