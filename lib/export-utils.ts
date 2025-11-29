import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) {
        throw new Error('No data to export');
    }

    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    downloadFile(csv, filename, 'text/csv');
}

/**
 * Export data to Excel format (uses CSV for security)
 * Note: For Excel compatibility, use CSV format which Excel can open natively
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
    if (data.length === 0) {
        throw new Error('No data to export');
    }

    // Convert to CSV and use Excel-compatible headers
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value ?? '';
            }).join(',')
        )
    ].join('\n');

    // Add BOM for Excel UTF-8 encoding
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.xlsx') ? filename.replace('.xlsx', '.csv') : filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Export data to PDF format
 */
export function exportToPDF(data: any[], title: string, columns: string[], filename: string) {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add metadata
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 30);
    doc.text(`Total Records: ${data.length}`, 14, 36);

    // Prepare table data
    const tableData = data.map(row => columns.map(col => row[col] || ''));

    // Add table
    autoTable(doc, {
        head: [columns],
        body: tableData,
        startY: 42,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [147, 51, 234] }, // Purple
    });

    doc.save(filename);
}

/**
 * Format registration data for export
 */
export function formatRegistrationData(registrations: any[]): any[] {
    return registrations.map(reg => ({
        'Name': reg.name,
        'Email': reg.email,
        'Phone': reg.phone || '',
        'School': reg.school || '',
        'Event Type': reg.eventType,
        'Committee': reg.committee || '',
        'Amount': reg.amount || 0,
        'Payment Status': reg.paymentStatus || 'Pending',
        'Checked In': reg.checkedIn ? 'Yes' : 'No',
        'Registration Date': new Date(reg.$createdAt).toLocaleDateString('en-IN'),
    }));
}

/**
 * Generate badge PDF for a single registration
 */
export async function generateSingleBadge(registration: any): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6', // 105 x 148 mm
    });

    createBadgeTemplate(doc, registration);

    return doc.output('blob');
}

/**
 * Generate badges for multiple registrations
 */
export async function generateBatchBadges(registrations: any[]): Promise<Blob> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6',
    });

    registrations.forEach((registration, index) => {
        if (index > 0) {
            doc.addPage();
        }
        createBadgeTemplate(doc, registration);
    });

    return doc.output('blob');
}

/**
 * Create badge template
 */
function createBadgeTemplate(doc: jsPDF, data: any) {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(147, 51, 234); // Purple
    doc.setLineWidth(1);
    doc.rect(5, 5, width - 10, height - 10);

    // Event branding
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ARSENIC SUMMIT', width / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('2024', width / 2, 27, { align: 'center' });

    // Attendee name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const name = data.name || 'Attendee Name';
    doc.text(name, width / 2, 50, { align: 'center' });

    // School
    if (data.school) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(data.school, width / 2, 58, { align: 'center' });
    }

    // Committee/Event
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const eventType = data.eventType || 'Event';
    doc.text(eventType.replace(/_/g, ' '), width / 2, 70, { align: 'center' });

    if (data.committee) {
        doc.setFontSize(10);
        doc.text(data.committee, width / 2, 77, { align: 'center' });
    }

    // QR Code placeholder (you can add actual QR code here)
    doc.setFillColor(240, 240, 240);
    doc.rect(width / 2 - 20, 90, 40, 40, 'F');
    doc.setFontSize(8);
    doc.text('QR CODE', width / 2, 113, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Presented by Arsenic Events', width / 2, height - 10, { align: 'center' });
}

/**
 * Download file helper
 */
function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
