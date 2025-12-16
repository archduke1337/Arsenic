import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getChairpersonInfo } from '@/lib/server-auth';
import { Query } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * GET /api/chair/stats
 * Get dashboard statistics for chair's committee
 */
export async function GET(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    // Build queries based on committee assignment
    const regQueries = chairInfo.committeeId === 'all' 
      ? [Query.limit(1000)]
      : [Query.equal('assignedCommittee', chairInfo.committeeId), Query.limit(1000)];

    // Fetch registrations for the committee
    const registrations = await databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS, regQueries);
    const delegates = registrations.documents;

    // Count checked in delegates
    const checkedInCount = delegates.filter((d: any) => d.checkedIn === true).length;

    // Fetch scores
    const scoreQueries = chairInfo.committeeId === 'all'
      ? [Query.limit(1000)]
      : [Query.equal('committeeId', chairInfo.committeeId), Query.limit(1000)];

    const scores = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SCORES, scoreQueries);
    
    // Get unique delegates who have been scored
    const scoredDelegateIds = new Set(scores.documents.map((s: any) => s.registrationId));

    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendanceQueries = [
      Query.greaterThanEqual('checkedInAt', `${today}T00:00:00.000Z`),
      Query.lessThan('checkedInAt', `${today}T23:59:59.999Z`),
      Query.limit(1000),
    ];
    if (chairInfo.committeeId !== 'all') {
      attendanceQueries.push(Query.equal('committeeId', chairInfo.committeeId));
    }

    const attendance = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ATTENDANCE, attendanceQueries);

    return NextResponse.json({
      success: true,
      stats: {
        totalDelegates: delegates.length,
        checkedIn: checkedInCount,
        presentToday: attendance.documents.filter((a: any) => a.attendanceStatus === 'present').length,
        scoredDelegates: scoredDelegateIds.size,
        pendingScores: delegates.length - scoredDelegateIds.size,
      },
      committee: {
        id: chairInfo.committeeId,
        name: chairInfo.committeeName,
      },
    });
  } catch (error) {
    console.error('Error fetching chair stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
