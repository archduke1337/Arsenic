"use client";

import { useState, useEffect } from "react";
import {
    Card, CardBody, Input, Button, Spinner, Chip
} from "@nextui-org/react";
import { CheckCircle, XCircle, Search, Trophy, Calendar, MapPin, User } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";
import { getAwardLabel, getAwardTierColor } from "@/lib/award-categories";
import Link from "next/link";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export default function VerifyCertificatePage({ params }: { params: { certificateId: string } }) {
    const [certificateId, setCertificateId] = useState(params.certificateId || "");
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    // Auto-verify if ID is in URL
    useEffect(() => {
        if (params.certificateId) {
            handleVerify(params.certificateId);
        }
    }, [params.certificateId]);

    const handleVerify = async (id: string) => {
        if (!id) return;

        setVerifying(true);
        setError("");
        setResult(null);

        try {
            // Verify certificate by ID
            // The certificate ID is generated during award creation and stored in the award document
            
            let award;
            try {
                // Try to fetch by award ID directly
                award = await databases.getDocument(DATABASE_ID, COLLECTIONS.AWARDS, id);
            } catch (e) {
                // If not found by direct ID, search by certificateId field
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.AWARDS,
                    [Query.equal('certificateId', id)]
                );
                if (response.documents.length > 0) {
                    award = response.documents[0];
                } else {
                    throw new Error('Certificate not found');
                }
            }

            if (award) {
                setResult(award);
            } else {
                setError("Certificate not found. Please check the ID and try again.");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setError("An error occurred during verification.");
        } finally {
            setVerifying(false);
        }
    };

    const colors = result ? getAwardTierColor(result.category) : null;

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-md w-full z-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Certificate Verification
                    </h1>
                    <p className="text-gray-400">Verify the authenticity of an Arsenic Summit certificate</p>
                </div>

                <Card className="bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
                    <CardBody className="p-6 space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter Certificate or Award ID"
                                value={certificateId}
                                onChange={(e) => setCertificateId(e.target.value)}
                                startContent={<Search size={18} className="text-gray-400" />}
                                classNames={{ inputWrapper: "bg-black/50 border border-white/10" }}
                            />
                            <Button
                                color="primary"
                                isLoading={verifying}
                                onClick={() => handleVerify(certificateId)}
                            >
                                Verify
                            </Button>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                                <XCircle size={20} />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {result && colors && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
                                    <CheckCircle size={20} />
                                    <div>
                                        <p className="font-bold">Valid Certificate</p>
                                        <p className="text-xs opacity-80">Verified by Arsenic Summit System</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-center space-y-2">
                                        <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${colors.gradient} bg-opacity-20 mb-2`}>
                                            <Trophy className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold">{result.registration?.name}</h3>
                                        <p className="text-gray-400">{result.registration?.school || 'Independent Delegate'}</p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Award</span>
                                            <Chip size="sm" className={`${colors.bg} ${colors.text} border-none`}>
                                                {getAwardLabel(result.category)}
                                            </Chip>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Event</span>
                                            <span className="text-sm font-medium">{result.eventType?.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Date</span>
                                            <span className="text-sm font-medium">
                                                {new Date(result.awardedAt || result.$createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href={`/results/${result.$id}`} className="block">
                                        <Button className="w-full" variant="flat" color="primary">
                                            View Full Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <div className="text-center text-xs text-gray-500">
                    &copy; 2024 Arsenic Summit. All rights reserved.
                </div>
            </div>
        </div>
    );
}
