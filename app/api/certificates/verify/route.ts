import { NextRequest, NextResponse } from 'next/server';
import { getCertificatesByEvent, verifyCertificate } from '@/lib/certificate-service';

/**
 * GET /api/certificates/verify?code=CERT-xxxx
 * Verify a certificate
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Missing certificate code' },
        { status: 400 }
      );
    }

    const certificate = await verifyCertificate(code);

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/certificates/event/[eventId]
 * Get all certificates for event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    const certificates = await getCertificatesByEvent(eventId);

    return NextResponse.json({
      success: true,
      certificates,
      count: certificates.length,
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
