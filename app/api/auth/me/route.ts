import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                $id: user.$id,
                email: user.email,
                name: user.name,
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
