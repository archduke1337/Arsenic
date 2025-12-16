import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { Query } from 'node-appwrite';

// GET /api/admin/registrations - List all registrations
export async function GET(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200');
    const eventId = searchParams.get('eventId');

    const queries = [Query.orderDesc('$createdAt'), Query.limit(limit)];
    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }

    const registrations = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.REGISTRATIONS,
      queries
    );

    return NextResponse.json({ success: true, registrations: registrations.documents });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// PUT /api/admin/registrations - Update a registration
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    const registration = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.REGISTRATIONS,
      id,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}

// DELETE /api/admin/registrations - Delete a registration
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.REGISTRATIONS, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
