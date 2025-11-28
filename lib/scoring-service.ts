import { databases, ID } from '@/lib/appwrite';

export interface Score {
  registrationId: string;
  eventId: string;
  committeeId: string;
  score: number;
  feedback?: string;
  rank?: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const scoreDoc = await databases.createDocument(
      databaseId,
      'scores',
      ID.unique(),
      {
        registrationId,
        eventId,
        committeeId,
        score: Math.min(100, Math.max(0, score)), // Clamp between 0-100
        feedback,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    return {
      registrationId: scoreDoc.registrationId,
      eventId: scoreDoc.eventId,
      committeeId: scoreDoc.committeeId,
      score: scoreDoc.score,
      feedback: scoreDoc.feedback,
      rank: scoreDoc.rank,
      createdAt: new Date(scoreDoc.createdAt),
      updatedAt: new Date(scoreDoc.updatedAt),
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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const updated = await databases.updateDocument(
      databaseId,
      'scores',
      scoreId,
      {
        score: Math.min(100, Math.max(0, score)),
        feedback,
        updatedAt: new Date(),
      }
    );

    return {
      registrationId: updated.registrationId,
      eventId: updated.eventId,
      committeeId: updated.committeeId,
      score: updated.score,
      feedback: updated.feedback,
      rank: updated.rank,
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt),
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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    // Build query filters
    const filters = [`eventId == "${eventId}"`];
    if (committeeId) {
      filters.push(`committeeId == "${committeeId}"`);
    }

    // Fetch all scores
    const scoresResponse = await databases.listDocuments(
      databaseId,
      'scores',
      filters
    );

    // Group scores by registration and calculate averages
    const scoresByRegistration: Record<
      string,
      { scores: number[]; committee?: string; name?: string }
    > = {};

    for (const scoreDoc of scoresResponse.documents) {
      const regId = scoreDoc.registrationId;
      if (!scoresByRegistration[regId]) {
        scoresByRegistration[regId] = { scores: [] };
      }
      scoresByRegistration[regId].scores.push(scoreDoc.score);
      scoresByRegistration[regId].committee = scoreDoc.committeeId;
    }

    // Fetch registration details for names
    const registrationsResponse = await databases.listDocuments(
      databaseId,
      'registrations',
      [`eventId == "${eventId}"`]
    );

    for (const reg of registrationsResponse.documents) {
      if (scoresByRegistration[reg.$id]) {
        scoresByRegistration[reg.$id].name = reg.fullName;
      }
    }

    // Calculate final scores and ranks
    const leaderboard: Leaderboard[] = Object.entries(scoresByRegistration)
      .map(([regId, data]) => {
        const avgScore = data.scores.length
          ? Math.round(
            (data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10
          ) / 10
          : 0;

        return {
          rank: 0, // Will be set after sorting
          participantName: data.name || 'Unknown',
          committee: data.committee || 'Unknown',
          score: avgScore,
          totalVotes: data.scores.length,
          trend: 'same' as const,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) return 'Unknown';

  try {
    const reg = await databases.getDocument(
      databaseId,
      'registrations',
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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    // Get all committees for event
    // Get all committees for event
    const committeesResponse = await databases.listDocuments(
      databaseId,
      'committees',
      [`eventType == "MUN"`] // Adjust as needed
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
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const scoresResponse = await databases.listDocuments(
      databaseId,
      'scores',
      [`eventId == "${eventId}"`]
    );
    const scores = scoresResponse.documents.map((doc) => doc.score);

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
        scoresResponse.documents.map((doc) => doc.registrationId)
      ).size,
    };
  } catch (error) {
    console.error('Error fetching score stats:', error);
    throw error;
  }
}
