import { NextRequest, NextResponse } from 'next/server';
import {
  getLeaderboard,
  getCommitteeRankings,
  getScoreStats,
  submitScore,
} from '@/lib/scoring-service';
import { account } from '@/lib/appwrite';

/**
 * POST /api/scoring/submit
 * Submit a score
 */
export async function POST(request: NextRequest) {
  try {
    const user = await account.get();
    
    // Verify user is admin
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!adminEmails.includes(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
