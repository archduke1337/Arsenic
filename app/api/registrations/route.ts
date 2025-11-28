import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID } from "appwrite";
import { z } from "zod";

const registrationSchema = z.object({
    userId: z.string().min(1),
    eventId: z.string().min(1),
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    institution: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validationResult = registrationSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const validData = validationResult.data;

        // Generate registration code
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create registration in Appwrite
        const registration = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            ID.unique(),
            {
                ...validData,
                code,
                status: "confirmed",
                paymentStatus: "pending",
                createdAt: new Date().toISOString(),
            }
        );

        return NextResponse.json(
            {
                message: "Registration successful",
                code,
                registrationId: registration.$id,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                error: "Failed to create registration",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
