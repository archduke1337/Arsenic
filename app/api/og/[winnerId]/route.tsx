import { ImageResponse } from 'next/og';
import { COLLECTIONS } from "@/lib/schema";
import { getAwardLabel } from "@/lib/award-categories";

export const runtime = 'edge';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
const ENDPOINT = "https://tor.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ winnerId: string }> }
) {
    try {
        const { winnerId } = await params;
        
        // Fetch award data directly from Appwrite REST API since SDK might have issues in Edge
        const response = await fetch(
            `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTIONS.AWARDS}/documents/${winnerId}`,
            {
                headers: {
                    'X-Appwrite-Project': PROJECT_ID,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch award');
        }

        const award = await response.json();
        const winnerName = award.registration?.name || "Winner";
        const awardLabel = getAwardLabel(award.category);
        const eventName = award.eventType?.replace(/_/g, ' ');
        const school = award.registration?.school || "Arsenic Summit 2024";

        // Determine colors based on tier
        const isGold = awardLabel.toLowerCase().includes('best') || awardLabel.toLowerCase().includes('winner');
        const accentColor = isGold ? '#FBBF24' : '#A78BFA';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000000',
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Background Glow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '600px',
                            height: '600px',
                            backgroundImage: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                            filter: 'blur(40px)',
                        }}
                    />

                    {/* Content Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            padding: '40px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Event Name */}
                        <div
                            style={{
                                fontSize: 24,
                                color: '#9CA3AF',
                                marginBottom: 20,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}
                        >
                            Arsenic Summit 2024
                        </div>

                        {/* Winner Name */}
                        <div
                            style={{
                                fontSize: 64,
                                fontWeight: 'bold',
                                color: 'white',
                                marginBottom: 10,
                                textAlign: 'center',
                                lineHeight: 1.1,
                            }}
                        >
                            {winnerName}
                        </div>

                        {/* School */}
                        <div
                            style={{
                                fontSize: 24,
                                color: '#D1D5DB',
                                marginBottom: 40,
                            }}
                        >
                            {school}
                        </div>

                        {/* Award Badge */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '15px 40px',
                                backgroundColor: accentColor,
                                borderRadius: '50px',
                                fontSize: 32,
                                fontWeight: 'bold',
                                color: 'black',
                                boxShadow: `0 0 20px ${accentColor}60`,
                            }}
                        >
                            🏆 {awardLabel}
                        </div>

                        {/* Event Type */}
                        <div
                            style={{
                                marginTop: 30,
                                fontSize: 20,
                                color: '#9CA3AF',
                            }}
                        >
                            in {eventName}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        console.log(message);
        return new Response('Failed to generate the image', {
            status: 500,
        });
    }
}
