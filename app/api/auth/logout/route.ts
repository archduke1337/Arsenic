import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function POST(request: NextRequest) {
    try {
        await account.deleteSession("current");

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
