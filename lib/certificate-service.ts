import PDFDocument from 'pdfkit';
import crypto from 'crypto';
import { databases, ID, storage } from '@/lib/appwrite';
import { Query } from 'appwrite';

export interface Certificate {
  id: string;
  recipientName: string;
  certificateType: 'award' | 'participation' | 'delegate';
  awardCategory?: string;
  eventName: string;
  eventDate: Date;
  certificateCode: string;
  verificationUrl: string;
  downloadUrl?: string;
  issuedAt: Date;
  isVerified: boolean;
}

/**
 * Generate unique certificate code
 */
function generateCertificateCode(): string {
  return `CERT-${Date.now()}-${crypto
    .randomBytes(4)
    .toString('hex')
    .toUpperCase()}`;
}

/**
 * Generate certificate PDF
 */
export async function generateCertificatePDF(
  recipientName: string,
  certificateType: 'award' | 'participation' | 'delegate',
  eventName: string,
  eventDate: Date,
  awardCategory?: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Background color
      doc
        .rect(0, 0, 842, 595)
        .fill('#f5f5f5');

      // Border
      doc
        .rect(50, 50, 742, 495)
        .lineWidth(3)
        .stroke('#d4af37'); // Gold border

      // Title
      doc
        .font('Helvetica-Bold')
        .fontSize(48)
        .fillColor('#333')
        .text('CERTIFICATE OF', 100, 100, { align: 'center' })
        .fontSize(44)
        .text(certificateType === 'award' ? 'ACHIEVEMENT' : 'PARTICIPATION', {
          align: 'center',
        });

      // Decorative line
      doc
        .moveTo(250, 200)
        .lineTo(592, 200)
        .stroke('#d4af37');

      // Recipient text
      doc
        .fontSize(28)
        .fillColor('#000')
        .text('This is proudly presented to', 100, 240, { align: 'center' });

      // Recipient name
      doc
        .fontSize(36)
        .fillColor('#d4af37')
        .font('Helvetica-Bold')
        .text(recipientName.toUpperCase(), 100, 280, { align: 'center' });

      // Certificate details
      doc
        .fontSize(12)
        .fillColor('#333')
        .font('Helvetica')
        .text(
          certificateType === 'award'
            ? `For exceptional performance and achievement in ${awardCategory || 'the event'}`
            : `For successful participation in ${eventName}`,
          100,
          350,
          { align: 'center', width: 642 }
        );

      // Event details
      doc
        .fontSize(11)
        .text(`Event: ${eventName}`, 100, 390, { align: 'center' });

      doc.text(`Date: ${eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`, 100, 410, { align: 'center' });

      // Signature area
      doc
        .fontSize(10)
        .font('Helvetica')
        .text('_____________________', 150, 460)
        .text('Authorized Signatory', 150, 475);

      doc.text('_____________________', 550, 460).text('Event Organizer', 550, 475);

      // Certificate number
      const certificateCode = generateCertificateCode();
      doc
        .fontSize(8)
        .fillColor('#999')
        .text(`Certificate ID: ${certificateCode}`, 100, 540, { align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Issue certificate
 */
export async function issueCertificate(
  participantName: string,
  certificateType: 'award' | 'participation' | 'delegate',
  eventId: string,
  eventName: string,
  eventDate: Date,
  awardCategory?: string
): Promise<Certificate> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;

  if (!databaseId || !bucketId) {
    throw new Error('Database or storage not configured');
  }

  try {
    // Generate certificate code
    const certificateCode = generateCertificateCode();

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(
      participantName,
      certificateType,
      eventName,
      eventDate,
      awardCategory
    );

    // Upload to storage
    const fileName = `cert-${certificateCode}.pdf`;
    const uploadedFile = await storage.createFile(
      bucketId,
      ID.unique(),
      new File([pdfBuffer], fileName, { type: 'application/pdf' })
    );

    // Store certificate record
    const certificate = await databases.createDocument(
      databaseId,
      'awards', // or create 'certificates' collection
      ID.unique(),
      {
        recipientName: participantName,
        certificateType,
        awardCategory,
        eventId,
        eventName,
        eventDate,
        certificateCode,
        certificateUrl: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        downloadUrl: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        issuedAt: new Date(),
        isVerified: false,
        isPublished: false,
      }
    );

    return {
      id: certificate.$id,
      recipientName: participantName,
      certificateType,
      awardCategory,
      eventName,
      eventDate: new Date(eventDate),
      certificateCode,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateCode}`,
      downloadUrl: certificate.downloadUrl,
      issuedAt: new Date(certificate.issuedAt),
      isVerified: false,
    };
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw error;
  }
}

/**
 * Verify certificate
 */
export async function verifyCertificate(
  certificateCode: string
): Promise<Certificate | null> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const results = await databases.listDocuments(
      databaseId,
      'awards',
      [`certificateCode == "${certificateCode}"`]
    );

    if (results.documents.length === 0) {
      return null;
    }

    const cert = results.documents[0];
    return {
      id: cert.$id,
      recipientName: cert.recipientName,
      certificateType: cert.certificateType || 'participation',
      awardCategory: cert.awardCategory,
      eventName: cert.eventName,
      eventDate: new Date(cert.eventDate),
      certificateCode: cert.certificateCode,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateCode}`,
      downloadUrl: cert.downloadUrl,
      issuedAt: new Date(cert.issuedAt),
      isVerified: true,
    };
  } catch (error) {
    console.error('Error verifying certificate:', error);
    throw error;
  }
}

/**
 * Bulk issue certificates
 */
export async function issueBulkCertificates(
  participants: Array<{
    name: string;
    type: 'award' | 'participation' | 'delegate';
    awardCategory?: string;
  }>,
  eventId: string,
  eventName: string,
  eventDate: Date
): Promise<Certificate[]> {
  const certificates: Certificate[] = [];

  for (const participant of participants) {
    try {
      const cert = await issueCertificate(
        participant.name,
        participant.type,
        eventId,
        eventName,
        eventDate,
        participant.awardCategory
      );
      certificates.push(cert);

      // Rate limiting: wait 100ms between certificates
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error issuing certificate for ${participant.name}:`, error);
    }
  }

  return certificates;
}

/**
 * Get certificates by event
 */
export async function getCertificatesByEvent(eventId: string): Promise<Certificate[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

  if (!databaseId) {
    throw new Error('Database not configured');
  }

  try {
    const results = await databases.listDocuments(
      databaseId,
      'awards',
      [`eventId == "${eventId}"`, Query.limit(1000)]
    );

    return results.documents.map((cert) => ({
      id: cert.$id,
      recipientName: cert.recipientName,
      certificateType: cert.certificateType || 'participation',
      awardCategory: cert.awardCategory,
      eventName: cert.eventName,
      eventDate: new Date(cert.eventDate),
      certificateCode: cert.certificateCode,
      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${cert.certificateCode}`,
      downloadUrl: cert.downloadUrl,
      issuedAt: new Date(cert.issuedAt),
      isVerified: true,
    }));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
}

/**
 * Download certificate
 */
export async function downloadCertificate(
  certificateCode: string
): Promise<Buffer | null> {
  const certificate = await verifyCertificate(certificateCode);

  if (!certificate || !certificate.downloadUrl) {
    return null;
  }

  try {
    const response = await fetch(certificate.downloadUrl);
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error('Error downloading certificate:', error);
    throw error;
  }
}
