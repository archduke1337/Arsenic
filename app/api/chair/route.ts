import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getChairpersonInfo } from '@/lib/server-auth';

/**
 * GET /api/chair
 * Get chair dashboard data and committee info
 */
export async function GET(request: NextRequest) {
  try {
    const chairInfo = await getChairpersonInfo();
    if (!chairInfo) {
      return NextResponse.json({ error: 'Unauthorized - Not a chairperson' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      chair: {
        name: chairInfo.name,
        email: chairInfo.email,
        committeeId: chairInfo.committeeId,
        committeeName: chairInfo.committeeName,
      },
    });
  } catch (error) {
    console.error('Error fetching chair info:', error);
    return NextResponse.json({ error: 'Failed to fetch chair info' }, { status: 500 });
  }
}
