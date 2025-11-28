import { NextRequest, NextResponse } from 'next/server';
import { decodeQRCode, validateQRCode } from '@/lib/qrcode-generator';
import { databases, account } from '@/lib/appwrite';
import { ID } from 'appwrite';

/**
 * POST /api/checkin/scan
 * Process QR code scan and mark attendance
 */
export async function POST(request: NextRequest) {
  try {
    const user = await account.get();
    
    // Only admins can check in participants
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!adminEmails.includes(user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { qrData, eventId } = body;

    if (!qrData || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Decode QR code
    let qrContent;
    try {
      qrContent = decodeQRCode(qrData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 400 }
      );
    }

    // Validate QR code
    if (!validateQRCode(qrContent)) {
      return NextResponse.json(
        { error: 'QR code expired or invalid' },
        { status: 400 }
      );
    }

    // Verify registration
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [
        `code == "${qrContent.code}"`,
        `eventId == "${eventId}"`,
      ]
    );

    if (registrations.documents.length === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    const registration = registrations.documents[0];

    // Check if already checked in
    if (registration.checkedIn) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          participant: {
            name: registration.fullName,
            code: registration.code,
            committee: registration.assignedCommittee,
            checkedInAt: registration.checkedInAt,
          },
        },
        { status: 400 }
      );
    }

    // Update registration with check-in
    const checkedInAt = new Date();
    await databases.updateDocument(
      databaseId,
      'registrations',
      registration.$id,
      {
        checkedIn: true,
        checkedInAt: checkedInAt,
        status: 'confirmed',
      }
    );

    // Create attendance record
    try {
      await databases.createDocument(
        databaseId,
        'attendance',
        ID.unique(),
        {
          registrationId: registration.$id,
          eventId,
          checkedInAt: checkedInAt,
          checkedInBy: user.$id,
          qrCodeScanned: true,
          createdAt: new Date(),
        }
      );
    } catch (error) {
      console.error('Failed to create attendance record:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      participant: {
        name: registration.fullName,
        code: registration.code,
        committee: registration.assignedCommittee,
        portfolio: registration.assignedPortfolio,
        checkedInAt,
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Check-in failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkin/stats
 * Get check-in statistics for event
 */
export async function GET(request: NextRequest) {
  try {
    const user = await account.get();
    
    // Only admins can view stats
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!adminEmails.includes(user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (!databaseId) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get all registrations for event
    const registrations = await databases.listDocuments(
      databaseId,
      'registrations',
      [`eventId == "${eventId}"`],
      100
    );

    // Calculate stats
    const checkedIn = registrations.documents.filter(r => r.checkedIn).length;
    const total = registrations.documents.length;
    const pending = total - checkedIn;

    // Group by committee
    const byCommittee: Record<string, { total: number; checkedIn: number }> = {};
    registrations.documents.forEach(reg => {
      const committee = reg.assignedCommittee || 'Unassigned';
      if (!byCommittee[committee]) {
        byCommittee[committee] = { total: 0, checkedIn: 0 };
      }
      byCommittee[committee].total++;
      if (reg.checkedIn) {
        byCommittee[committee].checkedIn++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        checkedIn,
        pending,
        checkInRate: ((checkedIn / total) * 100).toFixed(2) + '%',
        byCommittee,
      },
    });
  } catch (error) {
    console.error('Error fetching check-in stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
