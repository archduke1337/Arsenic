import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, submitScore } from '@/lib/scoring-service';
import { isAdminOrChair } from '@/lib/server-auth';

/**
 * POST /api/scoring/submit
 * Submit a score (admin or chairperson)
 */
export async function POST(request: NextRequest) {
  try {
    const { isAdmin, isChair, user } = await isAdminOrChair();
    if (!isChair) {
      return NextResponse.json({ error: 'Unauthorized - Admin or Chair access required' }, { status: 403 });
    }

    const body = await request.json();
    const { registrationId, eventId, committeeId, score, feedback } = body;

    if (!registrationId || !eventId || !committeeId || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await submitScore(
      registrationId,
      eventId,
      committeeId,
      score,
      feedback
    );

    return NextResponse.json({ success: true, score: result });
  } catch (error) {
    console.error('Error submitting score:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scoring/leaderboard?eventId=xxx&committeeId=xxx
 * Get leaderboard
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const committeeId = searchParams.get('committeeId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    const leaderboard = await getLeaderboard(eventId, committeeId || undefined);

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
