import { NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ email: string }> }
) {
    try {
        const { email } = await params;

        const documents = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("email", email)]
        );

        if (documents.documents.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(documents.documents[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
