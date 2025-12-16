import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getChairpersonInfo } from '@/lib/server-auth';
import { Query } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * GET /api/chair/delegates
 * Get delegates for chair's committee
 */
export async function GET(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let queries = [Query.limit(200), Query.orderDesc('$createdAt')];

    // If chair is not admin (all committees), filter by their committee
    if (chairInfo.committeeId !== 'all') {
      queries.push(Query.equal('assignedCommittee', chairInfo.committeeId));
    }

    if (search) {
      queries.push(Query.search('fullName', search));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS, queries);

    return NextResponse.json({
      success: true,
      delegates: response.documents,
      total: response.total,
      committee: {
        id: chairInfo.committeeId,
        name: chairInfo.committeeName,
      },
    });
  } catch (error) {
    console.error('Error fetching delegates:', error);
    return NextResponse.json({ error: 'Failed to fetch delegates' }, { status: 500 });
  }
}
