import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { COLLECTIONS, contactSubmissionSchema } from '@/lib/schema';
import { ID } from 'node-appwrite';

// POST /api/contact - Submit a contact form (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = contactSubmissionSchema.safeParse({
      ...body,
      status: 'new',
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const submission = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CONTACT_SUBMISSIONS,
      ID.unique(),
      validationResult.data
    );

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
