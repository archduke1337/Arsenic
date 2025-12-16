import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getChairpersonInfo } from '@/lib/server-auth';
import { Query, ID } from 'node-appwrite';
import { COLLECTIONS, attendanceSchema } from '@/lib/schema';

/**
 * GET /api/chair/attendance
 * Get today's attendance for chair's committee
 */
export async function GET(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    let queries = [
      Query.greaterThanEqual('checkedInAt', `${date}T00:00:00.000Z`),
      Query.lessThan('checkedInAt', `${date}T23:59:59.999Z`),
      Query.limit(500),
    ];

    if (chairInfo.committeeId !== 'all') {
      queries.push(Query.equal('committeeId', chairInfo.committeeId));
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ATTENDANCE, queries);

    return NextResponse.json({
      success: true,
      attendance: response.documents,
      total: response.total,
      date,
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

/**
 * POST /api/chair/attendance
 * Mark attendance for delegates
 */
export async function POST(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    const body = await request.json();
    const { registrationIds, eventId, status = 'present' } = body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json({ error: 'Missing registrationIds array' }, { status: 400 });
    }

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const results = [];

    for (const registrationId of registrationIds) {
      try {
        // Check if attendance already exists for today
        const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ATTENDANCE, [
          Query.equal('registrationId', registrationId),
          Query.greaterThanEqual('checkedInAt', `${now.split('T')[0]}T00:00:00.000Z`),
          Query.lessThan('checkedInAt', `${now.split('T')[0]}T23:59:59.999Z`),
        ]);

        if (existing.documents.length > 0) {
          // Update existing attendance
          const doc = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.ATTENDANCE,
            existing.documents[0].$id,
            {
              attendanceStatus: status,
              checkedInBy: chairInfo.userId,
            }
          );
          results.push({ registrationId, action: 'updated', id: doc.$id });
        } else {
          // Create new attendance record
          const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.ATTENDANCE, ID.unique(), {
            registrationId,
            eventId,
            committeeId: chairInfo.committeeId === 'all' ? undefined : chairInfo.committeeId,
            checkedInAt: now,
            checkedInBy: chairInfo.userId,
            attendanceStatus: status,
          });
          results.push({ registrationId, action: 'created', id: doc.$id });
        }
      } catch (err) {
        console.error(`Error marking attendance for ${registrationId}:`, err);
        results.push({ registrationId, action: 'error', error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      markedBy: chairInfo.name,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
