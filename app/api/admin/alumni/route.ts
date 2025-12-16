import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, alumniSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/alumni - List all alumni
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const alumni = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ALUMNI,
      [Query.orderDesc('joinedAt'), Query.limit(limit)]
    );

    return NextResponse.json({ success: true, alumni: alumni.documents });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}

// POST /api/admin/alumni - Create an alumni record
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    const validationResult = alumniSchema.safeParse({
      ...body,
      joinedAt: body.joinedAt || new Date().toISOString(),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const alumni = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ALUMNI,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, alumni }, { status: 201 });
  } catch (error) {
    console.error('Error creating alumni:', error);
    return NextResponse.json({ error: 'Failed to create alumni' }, { status: 500 });
  }
}

// PUT /api/admin/alumni - Update an alumni record
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing alumni ID' }, { status: 400 });
    }

    const alumni = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.ALUMNI,
      id,
      data
    );

    return NextResponse.json({ success: true, alumni });
  } catch (error) {
    console.error('Error updating alumni:', error);
    return NextResponse.json({ error: 'Failed to update alumni' }, { status: 500 });
  }
}

// DELETE /api/admin/alumni - Delete an alumni record
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing alumni ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ALUMNI, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alumni:', error);
    return NextResponse.json({ error: 'Failed to delete alumni' }, { status: 500 });
  }
}
