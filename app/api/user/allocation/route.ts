import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";
import { account } from "@/lib/appwrite";

export async function GET(request: NextRequest) {
    try {
        // Get current user
        const user = await account.get();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        // Fetch user's registrations
        const registrations = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            [Query.equal("userId", user.$id)]
        );

        if (registrations.documents.length === 0) {
            return NextResponse.json({
                success: true,
                allocation: null,
                message: "No allocation found",
            });
        }

        const registration = registrations.documents[0];

        // If not allocated, return registration info
        if (!registration.assignedCommittee) {
            return NextResponse.json({
                success: true,
                allocation: null,
                registration: {
                    status: registration.status,
                    paymentStatus: registration.paymentStatus,
                    code: registration.code,
                },
            });
        }

        // Fetch committee details
        const committee = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.COMMITTEES,
            registration.assignedCommittee
        );

        return NextResponse.json({
            success: true,
            allocation: {
                committee: committee.name,
                portfolio: registration.assignedPortfolio,
                event: "Arsenic Summit 2024",
                daysLeft: calculateDaysLeft(),
                registration: {
                    status: registration.status,
                    checkedIn: registration.checkedIn,
                },
            },
        });
    } catch (error) {
        console.error("Get allocation error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch allocation",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

function calculateDaysLeft(): number {
    const eventDate = new Date("2025-02-01"); // Update with actual event date
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
}
