import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS } from '@/lib/schema';
import type { Score } from '@/lib/schema';
import { ID, Query } from 'node-appwrite';

export interface Leaderboard {
  rank: number;
  participantName: string;
  committee: string;
  score: number;
  totalVotes: number;
  trend: 'up' | 'down' | 'same';
}

/**
 * Submit a score for a participant
 */
export async function submitScore(
  registrationId: string,
  eventId: string,
  committeeId: string,
  score: number,
  feedback?: string
): Promise<Score> {
  if (!DATABASE_ID) throw new Error('Database not configured');

  try {
    const scoreDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SCORES,
      ID.unique(),
      {
        registrationId,
        eventId,
        committeeId,
        score: Math.min(100, Math.max(0, score)), // Clamp between 0-100
        feedback,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    return {
      registrationId: scoreDoc.registrationId,
      eventId: scoreDoc.eventId,
      committeeId: scoreDoc.committeeId,
      score: scoreDoc.score,
      feedback: scoreDoc.feedback,
      rank: scoreDoc.rank,
      createdAt: scoreDoc.createdAt,
      updatedAt: scoreDoc.updatedAt,
    } as Score;
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

/**
 * Update score (judges can modify scores)
 */
export async function updateScore(
  scoreId: string,
  score: number,
  feedback?: string
): Promise<Score> {
  if (!DATABASE_ID) throw new Error('Database not configured');

  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SCORES,
      scoreId,
      {
        score: Math.min(100, Math.max(0, score)),
        feedback,
        updatedAt: new Date().toISOString(),
      }
    );

    return {
      registrationId: updated.registrationId,
      eventId: updated.eventId,
      committeeId: updated.committeeId,
      score: updated.score,
      feedback: updated.feedback,
      rank: updated.rank,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    } as Score;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
}

/**
 * Get leaderboard for event
 */
export async function getLeaderboard(
  eventId: string,
  committeeId?: string,
  limit: number = 50
): Promise<Leaderboard[]> {
  if (!DATABASE_ID) throw new Error('Database not configured');

  try {
    const filters = [Query.equal("eventId", eventId)];
    if (committeeId) filters.push(Query.equal("committeeId", committeeId));

    // Fetch all scores with pagination to avoid truncation
    const scoreDocs: any[] = await fetchAllDocuments(COLLECTIONS.SCORES, filters);

    // Group scores by registration and calculate averages
    const scoresByRegistration: Record<
      string,
      { scores: number[]; committeeId?: string }
    > = {};

    for (const scoreDoc of scoreDocs) {
      const regId = scoreDoc.registrationId;
      if (!scoresByRegistration[regId]) {
        scoresByRegistration[regId] = { scores: [] };
      }
      scoresByRegistration[regId].scores.push(scoreDoc.score);
      scoresByRegistration[regId].committeeId = scoreDoc.committeeId;
    }

    // Fetch registration details for names and committees
    const registrations = await fetchAllDocuments(
      COLLECTIONS.REGISTRATIONS,
      [Query.equal("eventId", eventId)]
    );
    const regMap: Record<string, { name: string; committee?: string }> = {};
    for (const reg of registrations) {
      regMap[reg.$id] = {
        name: reg.fullName || 'Unknown',
        committee: reg.assignedCommittee || reg.committeeId || reg.committee,
      };
    }

    // Fetch committees for human-readable names
    const committees = await fetchAllDocuments(COLLECTIONS.COMMITTEES, []);
    const committeeNameMap: Record<string, string> = {};
    for (const c of committees) {
      committeeNameMap[c.$id] = c.name || c.abbreviation || 'Committee';
    }

    const leaderboard: Leaderboard[] = Object.entries(scoresByRegistration)
      .map(([regId, data]) => {
        const avgScore = data.scores.length
          ? Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10
          : 0;

        const regInfo = regMap[regId];
        const committeeLabel = data.committeeId
          ? committeeNameMap[data.committeeId] || data.committeeId
          : regInfo?.committee || 'Unknown';

        return {
          rank: 0, // set after sorting
          participantName: regInfo?.name || 'Unknown',
          committee: committeeLabel || 'Unknown',
          score: avgScore,
          totalVotes: data.scores.length,
          trend: 'same' as const,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Get ranking for specific participant
 */
export async function getParticipantRanking(
  registrationId: string,
  eventId: string
): Promise<{ rank: number; score: number; outOf: number }> {
  try {
    const leaderboard = await getLeaderboard(eventId);
    const participantName = await getParticipantName(registrationId, eventId);

    const participant = leaderboard.find(
      (item) => item.participantName === participantName
    );

    if (!participant) {
      return { rank: 0, score: 0, outOf: leaderboard.length };
    }

    return {
      rank: participant.rank,
      score: participant.score,
      outOf: leaderboard.length,
    };
  } catch (error) {
    console.error('Error fetching participant ranking:', error);
    throw error;
  }
}

/**
 * Helper: Get participant name
 */
async function getParticipantName(
  registrationId: string,
  eventId: string
): Promise<string> {
  if (!DATABASE_ID) return 'Unknown';

  try {
    const reg = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.REGISTRATIONS,
      registrationId
    );
    return reg.fullName || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * Get committee-wise rankings
 */
export async function getCommitteeRankings(
  eventId: string
): Promise<Record<string, Leaderboard[]>> {
  if (!DATABASE_ID) throw new Error('Database not configured');

  try {
    // Get all committees for event
    const committeesResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMITTEES,
      [Query.limit(100)]
    );
    const rankings: Record<string, Leaderboard[]> = {};

    for (const committee of committeesResponse.documents) {
      const leaderboard = await getLeaderboard(eventId, committee.$id);
      rankings[committee.name] = leaderboard;
    }

    return rankings;
  } catch (error) {
    console.error('Error fetching committee rankings:', error);
    throw error;
  }
}

/**
 * Export scores to CSV
 */
export async function exportScoresToCSV(
  eventId: string
): Promise<string> {
  try {
    const leaderboard = await getLeaderboard(eventId);

    const headers = ['Rank', 'Participant', 'Committee', 'Score', 'Total Votes'];
    const rows = leaderboard.map((item) => [
      item.rank.toString(),
      item.participantName,
      item.committee,
      item.score.toString(),
      item.totalVotes.toString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  } catch (error) {
    console.error('Error exporting scores:', error);
    throw error;
  }
}

/**
 * Get score statistics
 */
export async function getScoreStats(eventId: string): Promise<{
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalScores: number;
  participantsScored: number;
}> {
  if (!DATABASE_ID) {
    throw new Error('Database not configured');
  }

  try {
    const scoreDocs = await fetchAllDocuments(
      COLLECTIONS.SCORES,
      [Query.equal("eventId", eventId)]
    );
    const scores = scoreDocs.map((doc) => doc.score as number);

    return {
      averageScore:
        scores.length > 0
          ? Math.round(
            (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
          ) / 10
          : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      totalScores: scores.length,
      participantsScored: new Set(
        scoreDocs.map((doc) => doc.registrationId)
      ).size,
    };
  } catch (error) {
    console.error('Error fetching score stats:', error);
    throw error;
  }
}

// Helper to fetch all documents with pagination
async function fetchAllDocuments(collectionId: string, filters: any[], pageSize = 100): Promise<any[]> {
  const results: any[] = [];
  let offset = 0;

  while (true) {
    const page = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      [...filters, Query.limit(pageSize), Query.offset(offset)]
    );

    results.push(...page.documents);

    if (page.documents.length < pageSize) break;
    offset += pageSize;
  }

  return results;
}
