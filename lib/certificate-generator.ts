import jsPDF from 'jspdf';
import { generateQRCode } from './qrcode-utils';

export type CertificateTemplate = 'classic' | 'modern' | 'formal';

interface CertificateData {
    $id: string;
    name: string;
    school?: string;
    eventType: string;
    awardCategory: string;
    committee?: string;
    eventDate?: string;
    eventLocation?: string;
}

/**
 * Generate certificate ID for verification
 */
export function generateCertificateId(winnerId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
}

/**
 * Generate a professional certificate PDF
 */
export async function generateCertificate(
    winner: CertificateData,
    template: CertificateTemplate = 'modern',
    certificateId?: string
): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4', // 297 x 210 mm
    });

    const certId = certificateId || generateCertificateId(winner.$id);

    // Generate QR code for verification
    let qrCodeDataUrl;
    try {
        const verificationUrl = `https://arsenicsummit.com/verify/${certId}`;
        qrCodeDataUrl = await generateQRCode(verificationUrl);
    } catch (error) {
        console.error('QR generation failed:', error);
    }

    switch (template) {
        case 'classic':
            await createClassicTemplate(doc, winner, certId, qrCodeDataUrl);
            break;
        case 'modern':
            await createModernTemplate(doc, winner, certId, qrCodeDataUrl);
            break;
        case 'formal':
            await createFormalTemplate(doc, winner, certId, qrCodeDataUrl);
            break;
    }

    return doc.output('blob');
}

/**
 * Classic Certificate Template
 */
async function createClassicTemplate(
    doc: jsPDF,
    data: CertificateData,
    certId: string,
    qrCode?: string
) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Ornate border
    doc.setLineWidth(3);
    doc.setDrawColor(147, 51, 234); // Purple
    doc.rect(10, 10, width - 20, height - 20);

    doc.setLineWidth(1);
    doc.setDrawColor(236, 72, 153); // Pink
    doc.rect(15, 15, width - 30, height - 30);

    // Decorative corners
    doc.setFillColor(147, 51, 234);
    [
        [15, 15], [width - 15, 15], [15, height - 15], [width - 15, height - 15]
    ].forEach(([x, y]) => {
        doc.circle(x, y, 3, 'F');
    });

    // Header
    doc.setFontSize(32);
    doc.setFont('times', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text('CERTIFICATE OF EXCELLENCE', width / 2, 40, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is to certify that', width / 2, 55, { align: 'center' });

    // Winner name
    doc.setFontSize(36);
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(data.name, width / 2, 75, { align: 'center' });

    // Underline
    doc.setLineWidth(0.5);
    doc.setDrawColor(147, 51, 234);
    const nameWidth = doc.getTextWidth(data.name);
    doc.line(width / 2 - nameWidth / 2 - 10, 78, width / 2 + nameWidth / 2 + 10, 78);

    // School (if exists)
    if (data.school) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(data.school, width / 2, 88, { align: 'center' });
    }

    // Award text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const awardY = data.school ? 100 : 95;
    doc.text('has been awarded', width / 2, awardY, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text(data.awardCategory.replace(/_/g, ' '), width / 2, awardY + 12, { align: 'center' });

    // Event details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`in ${data.eventType.replace(/_/g, ' ')}`, width / 2, awardY + 24, { align: 'center' });

    if (data.committee) {
        doc.text(`Committee: ${data.committee}`, width / 2, awardY + 32, { align: 'center' });
    }

    // Date and location
    const eventDetails = awardY + (data.committee ? 45 : 38);
    doc.setFontSize(10);
    if (data.eventDate) {
        doc.text(data.eventDate, width / 2, eventDetails, { align: 'center' });
    }
    if (data.eventLocation) {
        doc.text(data.eventLocation, width / 2, eventDetails + 6, { align: 'center' });
    }

    // Signatures
    const sigY = height - 45;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left signature
    doc.line(30, sigY, 80, sigY);
    doc.text('Organizing Secretary', 55, sigY + 6, { align: 'center' });

    // Right signature
    doc.line(width - 80, sigY, width - 30, sigY);
    doc.text('Chief Guest', width - 55, sigY + 6, { align: 'center' });

    // QR Code
    if (qrCode) {
        doc.addImage(qrCode, 'PNG', width - 35, height - 35, 20, 20);
    }

    // Certificate ID
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate ID: ${certId}`, width / 2, height - 8, { align: 'center' });
}

/**
 * Modern Certificate Template
 */
async function createModernTemplate(
    doc: jsPDF,
    data: CertificateData,
    certId: string,
    qrCode?: string
) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Gradient background effect (simulated with rectangles)
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, width, height, 'F');

    // White content area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 20, width - 40, height - 40, 3, 3, 'F');

    // Accent stripe
    doc.setFillColor(236, 72, 153); // Pink
    doc.rect(20, 20, 15, height - 40, 'F');

    // Modern header
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text('ACHIEVEMENT', width / 2, 50, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('CERTIFICATE OF', width / 2, 42, { align: 'center' });

    // Winner name with background
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(50, 65, width - 100, 25, 2, 2, 'F');

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(data.name, width / 2, 82, { align: 'center' });

    // School
    if (data.school) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text(data.school, width / 2, 95, { align: 'center' });
    }

    // Award badge
    const badgeY = data.school ? 110 : 105;
    doc.setFillColor(254, 243, 199); // Yellow tint
    doc.circle(width / 2, badgeY + 10, 25, 'F');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber
    const awardText = data.awardCategory.replace(/_/g, ' ');
    doc.text(awardText, width / 2, badgeY + 13, { align: 'center', maxWidth: 45 });

    // Event info
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`${data.eventType.replace(/_/g, ' ')} • ${data.eventDate || '2024'}`, width / 2, badgeY + 45, { align: 'center' });

    if (data.committee) {
        doc.setFontSize(11);
        doc.text(data.committee, width / 2, badgeY + 53, { align: 'center' });
    }

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Presented by Arsenic Events', width / 2, height - 25, { align: 'center' });

    // QR and ID
    if (qrCode) {
        doc.addImage(qrCode, 'PNG', width - 38, height - 38, 18, 18);
    }

    doc.setFontSize(7);
    doc.text(certId, 25, height - 25);
}

/**
 * Formal Certificate Template
 */
async function createFormalTemplate(
    doc: jsPDF,
    data: CertificateData,
    certId: string,
    qrCode?: string
) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Elegant double border
    doc.setLineWidth(2);
    doc.setDrawColor(0, 0, 0);
    doc.rect(12, 12, width - 24, height - 24);

    doc.setLineWidth(0.5);
    doc.rect(15, 15, width - 30, height - 30);
    doc.rect(18, 18, width - 36, height - 36);

    // Seal/badge at top
    doc.setFillColor(147, 51, 234);
    doc.circle(width / 2, 35, 12, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(width / 2, 35, 10, 'F');
    doc.setFillColor(147, 51, 234);
    doc.circle(width / 2, 35, 7, 'F');

    // Formal header
    doc.setFontSize(28);
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICATE', width / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('times', 'italic');
    doc.text('OF ACHIEVEMENT', width / 2, 68, { align: 'center' });

    // Decorative line
    doc.setLineWidth(0.3);
    doc.line(width / 2 - 40, 72, width / 2 + 40, 72);

    // Body text
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text('This is presented to', width / 2, 85, { align: 'center' });

    // Winner name
    doc.setFontSize(30);
    doc.setFont('times', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text(data.name, width / 2, 100, { align: 'center' });

    // School
    if (data.school) {
        doc.setFontSize(12);
        doc.setFont('times', 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(data.school, width / 2, 109, { align: 'center' });
    }

    // Award details
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.setTextColor(0, 0, 0);
    const detailsY = data.school ? 122 : 115;

    doc.text('for outstanding performance in', width / 2, detailsY, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text(data.awardCategory.replace(/_/g, ' ').toUpperCase(), width / 2, detailsY + 10, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(`at ${data.eventType.replace(/_/g, ' ')}`, width / 2, detailsY + 20, { align: 'center' });

    if (data.committee) {
        doc.setFontSize(10);
        doc.text(`(${data.committee})`, width / 2, detailsY + 27, { align: 'center' });
    }

    // Date and location
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    const dateY = detailsY + (data.committee ? 37 : 32);
    if (data.eventDate) {
        doc.text(`Date: ${data.eventDate}`, width / 2, dateY, { align: 'center' });
    }
    if (data.eventLocation) {
        doc.text(`Venue: ${data.eventLocation}`, width / 2, dateY + 6, { align: 'center' });
    }

    // Signatures with seals
    const sigY = height - 40;

    // Left signature
    doc.setFillColor(147, 51, 234);
    doc.circle(60, sigY - 10, 8, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(60, sigY - 10, 6, 'F');
    doc.line(35, sigY, 85, sigY);
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text('Convener', 60, sigY + 5, { align: 'center' });

    // Right signature
    doc.setFillColor(147, 51, 234);
    doc.circle(width - 60, sigY - 10, 8, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(width - 60, sigY - 10, 6, 'F');
    doc.line(width - 85, sigY, width - 35, sigY);
    doc.text('Chief Patron', width - 60, sigY + 5, { align: 'center' });

    // QR Code
    if (qrCode) {
        doc.addImage(qrCode, 'PNG', 15, height - 33, 18, 18);
    }

    // Certificate ID
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`Cert. No: ${certId}`, width / 2, height - 10, { align: 'center' });
}

/**
 * Generate certificates for multiple winners
 */
export async function generateBatchCertificates(
    winners: CertificateData[],
    template: CertificateTemplate = 'modern'
): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    for (let i = 0; i < winners.length; i++) {
        if (i > 0) {
            doc.addPage();
        }

        const certId = generateCertificateId(winners[i].$id);
        let qrCodeDataUrl;

        try {
            const verificationUrl = `https://arsenicsummit.com/verify/${certId}`;
            qrCodeDataUrl = await generateQRCode(verificationUrl);
        } catch (error) {
            console.error(`QR generation failed for winner ${i}:`, error);
        }

        switch (template) {
            case 'classic':
                await createClassicTemplate(doc, winners[i], certId, qrCodeDataUrl);
                break;
            case 'modern':
                await createModernTemplate(doc, winners[i], certId, qrCodeDataUrl);
                break;
            case 'formal':
                await createFormalTemplate(doc, winners[i], certId, qrCodeDataUrl);
                break;
        }
    }

    return doc.output('blob');
}
