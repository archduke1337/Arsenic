import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Arsenic Summit API is running",
        timestamp: new Date().toISOString()
    });
}
