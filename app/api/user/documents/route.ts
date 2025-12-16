import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { Query, ID } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * GET /api/user/documents
 * Get user's submitted documents
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DOCUMENTS, [
      Query.equal('authorId', user.$id),
      Query.orderDesc('$createdAt'),
      Query.limit(50),
    ]);

    return NextResponse.json({
      success: true,
      documents: documents.documents,
      total: documents.total,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

/**
 * POST /api/user/documents
 * Save or submit a document
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, content, isDraft = false } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const document = await databases.createDocument(DATABASE_ID, COLLECTIONS.DOCUMENTS, ID.unique(), {
      authorId: user.$id,
      authorName: user.name,
      authorEmail: user.email,
      title: title.trim(),
      type,
      content,
      status: isDraft ? 'draft' : 'submitted',
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      document,
      message: isDraft ? 'Draft saved successfully' : 'Document submitted successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving document:', error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}

/**
 * PUT /api/user/documents
 * Update an existing document
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, type, content, isDraft } = body;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Verify ownership
    const existing = await databases.getDocument(DATABASE_ID, COLLECTIONS.DOCUMENTS, id);
    if (existing.authorId !== user.$id) {
      return NextResponse.json({ error: 'Not authorized to edit this document' }, { status: 403 });
    }

    const document = await databases.updateDocument(DATABASE_ID, COLLECTIONS.DOCUMENTS, id, {
      title: title?.trim() || existing.title,
      type: type || existing.type,
      content: content || existing.content,
      status: isDraft ? 'draft' : 'submitted',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      document,
      message: isDraft ? 'Draft updated' : 'Document updated',
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
