import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, scoreSchema } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { ID, Query } from 'node-appwrite';

// GET /api/admin/scores - List all scores
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

    const queries = [Query.orderDesc('score'), Query.limit(limit)];
    if (eventId) {
      queries.push(Query.equal('eventId', eventId));
    }
    if (committeeId) {
      queries.push(Query.equal('committeeId', committeeId));
    }

    const scores = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SCORES,
      queries
    );

    return NextResponse.json({ success: true, scores: scores.documents });
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

// POST /api/admin/scores - Create/submit a score
export async function POST(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    
    const validationResult = scoreSchema.safeParse({
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const score = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SCORES,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, score }, { status: 201 });
  } catch (error) {
    console.error('Error creating score:', error);
    return NextResponse.json({ error: 'Failed to create score' }, { status: 500 });
  }
}

// PUT /api/admin/scores - Update a score
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing score ID' }, { status: 400 });
    }

    const score = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SCORES,
      id,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
  }
}

// DELETE /api/admin/scores - Delete a score
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing score ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SCORES, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting score:', error);
    return NextResponse.json({ error: 'Failed to delete score' }, { status: 500 });
  }
}
