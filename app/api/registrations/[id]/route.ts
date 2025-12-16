import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    const registrationId = params.id;

    if (!registrationId) {
        return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    if (!DATABASE_ID) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const registration = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            registrationId
        );

        let latestPayment = null;

        try {
            const payments = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PAYMENTS,
                [Query.equal("registrationId", registrationId), Query.orderDesc("$createdAt"), Query.limit(1)]
            );
            latestPayment = payments.documents[0] || null;
        } catch (payErr) {
            console.error("Failed to fetch payments for registration", payErr);
        }

        return NextResponse.json({ registration, latestPayment });
    } catch (error) {
        console.error("Fetch registration failed", error);
        const status = (error as any)?.code === 404 ? 404 : 500;
        return NextResponse.json({ error: "Registration not found" }, { status });
    }
}
