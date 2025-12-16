import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS } from '@/lib/schema';
import { isAdminEmail } from '@/lib/server-auth';
import { Query } from 'node-appwrite';

// GET /api/admin/contact - List all contact submissions
export async function GET(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const submissions = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CONTACT_SUBMISSIONS,
      [Query.orderDesc('$createdAt'), Query.limit(limit)]
    );

    return NextResponse.json({ success: true, submissions: submissions.documents });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// PUT /api/admin/contact - Update submission status
export async function PUT(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
    }

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const submission = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.CONTACT_SUBMISSIONS,
      id,
      { status }
    );

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

// DELETE /api/admin/contact - Delete a submission
export async function DELETE(request: NextRequest) {
  try {
    const adminEmail = await isAdminEmail(request);
    if (!adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CONTACT_SUBMISSIONS, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
