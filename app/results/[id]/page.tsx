import { Metadata } from "next";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { getAwardLabel } from "@/lib/award-categories";
import WinnerPageClient from "./WinnerPageClient";
import { Models } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

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

// Fetch award data
async function getAward(id: string): Promise<AwardDocument | null> {
    try {
        const award = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.AWARDS,
            id
        ) as AwardDocument;
        return award;
    } catch {
        return null;
    }
}

// Generate metadata for social sharing
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const award = await getAward(id);

    if (!award) {
        return {
            title: "Award Not Found | Arsenic Summit 2024",
        };
    }

    const winnerName = award.registration?.name || "Winner";
    const awardLabel = getAwardLabel(award.category);
    const eventName = award.eventType?.replace(/_/g, ' ');

    return {
        title: `${winnerName} - ${awardLabel} | Arsenic Summit 2024`,
        description: `Congratulations to ${winnerName} for winning ${awardLabel} in ${eventName} at Arsenic Summit 2024!`,
        openGraph: {
            title: `${winnerName} - ${awardLabel}`,
            description: `Congratulations to ${winnerName} for winning ${awardLabel} in ${eventName} at Arsenic Summit 2024!`,
            images: [`/api/og/${id}`],
        },
        twitter: {
            card: "summary_large_image",
            title: `${winnerName} - ${awardLabel}`,
            description: `Congratulations to ${winnerName} for winning ${awardLabel} in ${eventName} at Arsenic Summit 2024!`,
            images: [`/api/og/${id}`],
        },
    };
}

export default async function WinnerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const award = await getAward(id);

    return <WinnerPageClient award={award} />;
}
