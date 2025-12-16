import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";

export async function POST(request: NextRequest) {
    try {
        const { registrationIds } = await request.json();

        if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
            return NextResponse.json(
                { error: "Valid registration IDs array is required" },
                { status: 400 }
            );
        }

        let checkedInCount = 0;

        // Bulk check-in
        for (const id of registrationIds) {
            try {
                // Get current registration to check if already checked in
                const reg = await databases.getDocument(
                    DATABASE_ID,
                    COLLECTIONS.REGISTRATIONS,
                    id
                );

                if (!reg.checkedIn) {
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTIONS.REGISTRATIONS,
                        id,
                        {
                            checkedIn: true,
                            checkedInAt: new Date().toISOString(),
                        }
                    );
                    checkedInCount++;
                }
            } catch (err) {
                console.error(`Failed to check in registration ${id}:`, err);
                // Continue with next registration
            }
        }

        return NextResponse.json({
            success: true,
            checkedInCount,
            totalProcessed: registrationIds.length,
            message: `Checked in ${checkedInCount} attendees`,
        });
    } catch (error) {
        console.error("Bulk check-in failed:", error);
        return NextResponse.json(
            { error: "Failed to perform bulk check-in" },
            { status: 500 }
        );
    }
}
