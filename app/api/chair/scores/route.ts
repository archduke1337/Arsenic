import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getChairpersonInfo, isAdminOrChair } from '@/lib/server-auth';
import { Query, ID } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * GET /api/chair/scores
 * Get scores for chair's committee delegates
 */
export async function GET(request: NextRequest) {
  try {
    const { isAdmin, isChair, committeeId } = await isAdminOrChair();
    if (!isChair) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const session = searchParams.get('session');

    let queries = [Query.limit(500), Query.orderDesc('$createdAt')];

    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }

    if (committeeId && committeeId !== 'all') {
      queries.push(Query.equal('committeeId', committeeId));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SCORES, queries);

    return NextResponse.json({
      success: true,
      scores: response.documents,
      total: response.total,
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

/**
 * POST /api/chair/scores
 * Submit scores for delegates (alternative to /api/scoring/leaderboard)
 */
export async function POST(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    const body = await request.json();
    const { scores, session = 'session1' } = body;

    if (!scores || !Array.isArray(scores)) {
      return NextResponse.json({ error: 'Missing scores array' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const results = [];

    for (const scoreEntry of scores) {
      const { registrationId, eventId, criteriaScores, total, remarks } = scoreEntry;

      if (!registrationId || !eventId || total === undefined) {
        results.push({ registrationId, action: 'error', error: 'Missing required fields' });
        continue;
      }

      try {
        // Check if score already exists for this delegate and session
        const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SCORES, [
          Query.equal('registrationId', registrationId),
          Query.equal('eventId', eventId),
        ]);

        if (existing.documents.length > 0) {
          // Update existing score
          const doc = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.SCORES,
            existing.documents[0].$id,
            {
              score: total,
              feedback: remarks || '',
              updatedAt: now,
            }
          );
          results.push({ registrationId, action: 'updated', id: doc.$id });
        } else {
          // Create new score
          const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.SCORES, ID.unique(), {
            registrationId,
            eventId,
            committeeId: chairInfo.committeeId === 'all' ? scoreEntry.committeeId : chairInfo.committeeId,
            score: total,
            feedback: remarks || '',
            createdAt: now,
            updatedAt: now,
          });
          results.push({ registrationId, action: 'created', id: doc.$id });
        }
      } catch (err) {
        console.error(`Error saving score for ${registrationId}:`, err);
        results.push({ registrationId, action: 'error', error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      submittedBy: chairInfo.name,
    });
  } catch (error) {
    console.error('Error saving scores:', error);
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 });
  }
}
