import { NextRequest, NextResponse } from "next/server";
import { Client, Account } from "node-appwrite";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("appwrite-session");
        
        if (sessionCookie?.value) {
            // Try to delete the session on Appwrite side
            try {
                const client = new Client()
                    .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
                    .setProject(process.env.APPWRITE_PROJECT_ID || "");
                
                client.setSession(sessionCookie.value);
                const account = new Account(client);
                await account.deleteSession("current");
            } catch {
                // Session may already be invalid, continue with cookie deletion
            }
        }

        // Delete the session cookie
        cookieStore.delete("appwrite-session");

        return NextResponse.json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            {
                error: "Logout failed",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
