import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, committeeSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/committees - List all committees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const eventType = searchParams.get('eventType');

    const queries = [Query.orderDesc('$createdAt'), Query.limit(limit)];
    if (eventType) {
      queries.push(Query.equal('eventType', eventType));
    }

    const committees = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMITTEES,
      queries
    );

    return NextResponse.json({ success: true, committees: committees.documents });
  } catch (error) {
    console.error('Error fetching committees:', error);
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 });
  }
}

// POST /api/admin/committees - Create a committee
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    const validationResult = committeeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const committee = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.COMMITTEES,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, committee }, { status: 201 });
  } catch (error) {
    console.error('Error creating committee:', error);
    return NextResponse.json({ error: 'Failed to create committee' }, { status: 500 });
  }
}

// PUT /api/admin/committees - Update a committee
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing committee ID' }, { status: 400 });
    }

    const committee = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.COMMITTEES,
      id,
      data
    );

    return NextResponse.json({ success: true, committee });
  } catch (error) {
    console.error('Error updating committee:', error);
    return NextResponse.json({ error: 'Failed to update committee' }, { status: 500 });
  }
}

// DELETE /api/admin/committees - Delete a committee
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing committee ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.COMMITTEES, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting committee:', error);
    return NextResponse.json({ error: 'Failed to delete committee' }, { status: 500 });
  }
}
