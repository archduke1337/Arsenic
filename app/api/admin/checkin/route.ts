import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";

export async function POST(request: NextRequest) {
    try {
        const { registrationId } = await request.json();

        if (!registrationId) {
            return NextResponse.json(
                { error: "Registration ID is required" },
                { status: 400 }
            );
        }

        // Check-in single registration
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            registrationId,
            {
                checkedIn: true,
                checkedInAt: new Date().toISOString(),
            }
        );

        return NextResponse.json({
            success: true,
            message: "Attendee checked in successfully",
        });
    } catch (error) {
        console.error("Check-in failed:", error);
        return NextResponse.json(
            { error: "Failed to check in attendee" },
            { status: 500 }
        );
    }
}
