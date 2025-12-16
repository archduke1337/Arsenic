import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { Query } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * GET /api/user/dashboard
 * Get authenticated user's dashboard data (registration, allocation, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's registration
    const registrations = await databases.listDocuments(DATABASE_ID, COLLECTIONS.REGISTRATIONS, [
      Query.equal('email', user.email),
      Query.limit(1),
    ]);

    const registration = registrations.documents[0] || null;

    // Build allocation data if available
    let allocation = null;
    if (registration?.assignedCommittee || registration?.committeeId) {
      allocation = {
        committeeId: registration.assignedCommittee || registration.committeeId || '',
        committee: registration.committee || 'TBA',
        portfolio: registration.assignedPortfolio || 'TBA',
        event: registration.eventType || 'MUN',
        status: registration.allocationStatus || 'pending',
        daysLeft: calculateDaysLeft(registration.eventStartDate),
      };
    }

    // Get upcoming events if registered
    let upcomingEvents: any[] = [];
    if (registration?.eventId) {
      try {
        const events = await databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [
          Query.equal('$id', registration.eventId),
        ]);
        upcomingEvents = events.documents;
      } catch (e) {
        // Events may not exist
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
      registration,
      allocation,
      upcomingEvents,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

function calculateDaysLeft(eventStartDate?: string): number {
  if (!eventStartDate) return 0;
  const eventDate = new Date(eventStartDate);
  const today = new Date();
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
