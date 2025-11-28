import jsPDF from 'jspdf';
import { generateQRCode } from './qrcode-utils';

/**
 * Create badge template with QR code
 */
export async function createBadgeTemplate(doc: jsPDF, data: any, qrCodeDataUrl?: string) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Border with gradient effect
    doc.setDrawColor(147, 51, 234); // Purple
    doc.setLineWidth(2);
    doc.rect(5, 5, width - 10, height - 10);

    // Inner border
    doc.setDrawColor(236, 72, 153); // Pink
    doc.setLineWidth(0.5);
    doc.rect(8, 8, width - 16, height - 16);

    // Event branding header
    doc.setFillColor(147, 51, 234); // Purple background
    doc.rect(8, 8, width - 16, 25, 'F');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('ARSENIC SUMMIT', width / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('2024', width / 2, 27, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Attendee name
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const name = data.name || 'Attendee Name';

    // Center name with better spacing
    const nameY = 50;
    doc.text(name, width / 2, nameY, { align: 'center', maxWidth: width - 20 });

    // School name
    if (data.school) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        doc.text(data.school, width / 2, nameY + 8, { align: 'center', maxWidth: width - 20 });
        doc.setTextColor(0, 0, 0);
    }

    // Event Type with background
    const eventY = data.school ? nameY + 18 : nameY + 10;
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.roundedRect(15, eventY - 5, width - 30, 12, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235); // Blue text
    const eventType = (data.eventType || 'Event').replace(/_/g, ' ');
    doc.text(eventType, width / 2, eventY + 3, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Committee (if exists)
    if (data.committee) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(data.committee, width / 2, eventY + 11, { align: 'center', maxWidth: width - 20 });
    }

    // QR Code section
    const qrY = data.committee ? eventY + 20 : eventY + 15;

    if (qrCodeDataUrl) {
        // Add QR code image
        try {
            doc.addImage(qrCodeDataUrl, 'PNG', width / 2 - 20, qrY, 40, 40);
        } catch (error) {
            console.error('Failed to add QR code to badge:', error);
            // Fallback: Draw placeholder
            doc.setFillColor(240, 240, 240);
            doc.rect(width / 2 - 20, qrY, 40, 40, 'F');
            doc.setFontSize(8);
            doc.text('QR CODE', width / 2, qrY + 23, { align: 'center' });
        }
    } else {
        // Placeholder if no QR code
        doc.setFillColor(240, 240, 240);
        doc.rect(width / 2 - 20, qrY, 40, 40, 'F');
        doc.setFontSize(8);
        doc.text('QR CODE', width / 2, qrY + 23, { align: 'center' });
    }

    // Instructional text
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Scan at check-in', width / 2, qrY + 48, { align: 'center' });

    // Footer with decorative line
    doc.setDrawColor(147, 51, 234);
    doc.setLineWidth(0.5);
    doc.line(15, height - 15, width - 15, height - 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Presented by Arsenic Events', width / 2, height - 10, { align: 'center' });

    // Registration ID (small, bottom corner)
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(`ID: ${data.$id?.substring(0, 8) || 'N/A'}`, width - 10, height - 5, { align: 'right' });
}

/**
 * Generate badge PDF with QR code for a single registration
 */
export async function generateSingleBadgeWithQR(registration: any): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6', // 105 x 148 mm
    });

    // Generate QR code
    let qrCodeDataUrl;
    try {
        qrCodeDataUrl = await generateQRCode(registration.$id);
    } catch (error) {
        console.error('QR generation failed:', error);
    }

    await createBadgeTemplate(doc, registration, qrCodeDataUrl);

    return doc.output('blob');
}

/**
 * Generate badges for multiple registrations with QR codes
 */
export async function generateBatchBadgesWithQR(registrations: any[]): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6',
    });

    for (let i = 0; i < registrations.length; i++) {
        if (i > 0) {
            doc.addPage();
        }

        // Generate QR code for each registration
        let qrCodeDataUrl;
        try {
            qrCodeDataUrl = await generateQRCode(registrations[i].$id);
        } catch (error) {
            console.error(`QR generation failed for registration ${i}:`, error);
        }

        await createBadgeTemplate(doc, registrations[i], qrCodeDataUrl);
    }

    return doc.output('blob');
}
