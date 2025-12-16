import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const session = await account.createEmailPasswordSession(email, password);

        // Note: Appwrite sets its own session cookie; we return basic info only
        return NextResponse.json({
            success: true,
            message: "Login successful",
            session: {
                $id: session.$id,
                userId: session.userId,
                email: email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                error: "Authentication failed",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 401 }
        );
    }
}
