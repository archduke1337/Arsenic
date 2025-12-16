import { NextRequest, NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Create a new client for this request
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
            .setProject(process.env.APPWRITE_PROJECT_ID || "");
        
        const account = new Account(client);
        
        // Create email password session
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

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
