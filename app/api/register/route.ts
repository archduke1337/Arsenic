import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { email, name, role = "delegate" } = await request.json();

        if (!email || !name) {
            return NextResponse.json(
                { message: "Email and name are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUsers = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("email", email)]
        );

        if (existingUsers.documents.length > 0) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Create user document
        const user = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                email,
                name,
                role,
            }
        );

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            userId: user.$id,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
