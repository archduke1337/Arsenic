import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function GET(request: NextRequest) {
    try {
        const user = await account.get();

        return NextResponse.json({
            success: true,
            user: {
                $id: user.$id,
                email: user.email,
                name: user.name,
                emailVerification: user.emailVerification,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            {
                error: "Not authenticated",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 401 }
        );
    }
}
