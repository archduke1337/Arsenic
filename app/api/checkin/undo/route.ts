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

        // Update registration to mark as not checked in
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            registrationId,
            {
                checkedIn: false,
                checkedInAt: null,
            }
        );

        return NextResponse.json({
            success: true,
            message: "Check-in undone successfully",
        });
    } catch (error) {
        console.error("Undo check-in failed:", error);
        return NextResponse.json(
            { error: "Failed to undo check-in" },
            { status: 500 }
        );
    }
}
