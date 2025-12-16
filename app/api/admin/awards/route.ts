import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, awardSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/awards - List all awards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const eventId = searchParams.get('eventId');

    const queries = [Query.orderDesc('$createdAt'), Query.limit(limit)];
    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }

    const awards = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.AWARDS,
      queries
    );

    return NextResponse.json({ success: true, awards: awards.documents });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
  }
}

// POST /api/admin/awards - Create an award
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    const validationResult = awardSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const award = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AWARDS,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, award }, { status: 201 });
  } catch (error) {
    console.error('Error creating award:', error);
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 });
  }
}

// PUT /api/admin/awards - Update an award
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing award ID' }, { status: 400 });
    }

    const award = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.AWARDS,
      id,
      data
    );

    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error('Error updating award:', error);
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 });
  }
}

// DELETE /api/admin/awards - Delete an award
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing award ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.AWARDS, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting award:', error);
    return NextResponse.json({ error: 'Failed to delete award' }, { status: 500 });
  }
}
