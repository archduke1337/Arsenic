import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // We can't easily check Appwrite auth in middleware without the session cookie
    // For now, we'll rely on client-side protection for the MVP
    // But we can add basic path protection logic here if needed

    // Example: Redirect /admin to /login if no session cookie exists (basic check)
    // const session = request.cookies.get('a_session_id'); // Appwrite cookie name varies

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
        '/speaker-panel/:path*',
    ],
};
