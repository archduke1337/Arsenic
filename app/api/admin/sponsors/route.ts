import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, sponsorSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/sponsors - List all sponsors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const sponsors = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SPONSORS,
      [Query.orderAsc('displayOrder'), Query.limit(limit)]
    );

    return NextResponse.json({ success: true, sponsors: sponsors.documents });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

// POST /api/admin/sponsors - Create a sponsor
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    const validationResult = sponsorSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const sponsor = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SPONSORS,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, sponsor }, { status: 201 });
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}

// PUT /api/admin/sponsors - Update a sponsor
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing sponsor ID' }, { status: 400 });
    }

    const sponsor = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SPONSORS,
      id,
      data
    );

    return NextResponse.json({ success: true, sponsor });
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

// DELETE /api/admin/sponsors - Delete a sponsor
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing sponsor ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SPONSORS, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
