import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, attendanceSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { Query } from 'node-appwrite';

// GET /api/admin/attendance - List all attendance records
export async function GET(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200');
    const eventId = searchParams.get('eventId');
    const committeeId = searchParams.get('committeeId');

    const queries = [Query.orderDesc('checkedInAt'), Query.limit(limit)];
    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }
    if (committeeId) {
      queries.push(Query.equal('committeeId', committeeId));
    }

    const attendance = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ATTENDANCE,
      queries
    );

    return NextResponse.json({ success: true, attendance: attendance.documents });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

// PUT /api/admin/attendance - Update attendance status
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, attendanceStatus, checkOutTime } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing attendance ID' }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (attendanceStatus) {
      const validStatuses = ['present', 'absent', 'late', 'excused'];
      if (!validStatuses.includes(attendanceStatus)) {
        return NextResponse.json({ error: 'Invalid attendance status' }, { status: 400 });
      }
      updateData.attendanceStatus = attendanceStatus;
    }
    if (checkOutTime) {
      updateData.checkOutTime = checkOutTime;
    }

    const attendance = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ATTENDANCE,
      id,
      updateData
    );

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ error: 'Failed to update attendance' }, { status: 500 });
  }
}
