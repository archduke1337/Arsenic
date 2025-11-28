import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { COLLECTIONS, registrationSchema } from "@/lib/schema";
import { ID } from "appwrite";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate with Zod schema
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

        // Generate registration code if not provided
        const code = validData.code || Math.random().toString(36).substring(2, 8).toUpperCase();

        // Create registration in Appwrite
        const registration = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            ID.unique(),
            {
                ...validData,
                code,
                status: validData.status || "confirmed",
                paymentStatus: validData.paymentStatus || "pending",
                checkedIn: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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
