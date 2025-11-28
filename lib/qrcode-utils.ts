import QRCode from 'qrcode';
import { ID } from 'appwrite';

/**
 * Generate a QR code data URL for a registration
 */
export async function generateQRCode(registrationId: string): Promise<string> {
    try {
        // Create a secure QR code payload with validation hash
        const timestamp = Date.now();
        const payload = {
            id: registrationId,
            ts: timestamp,
            hash: generateHash(registrationId, timestamp),
        };

        const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 300,
            margin: 2,
        });

        return dataUrl;
    } catch (error) {
        console.error('QR Code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(registrationId: string): Promise<string> {
    try {
        const timestamp = Date.now();
        const payload = {
            id: registrationId,
            ts: timestamp,
            hash: generateHash(registrationId, timestamp),
        };

        const svg = await QRCode.toString(JSON.stringify(payload), {
            errorCorrectionLevel: 'H',
            type: 'svg',
            width: 300,
        });

        return svg;
    } catch (error) {
        console.error('QR Code SVG generation error:', error);
        throw new Error('Failed to generate QR code SVG');
    }
}

/**
 * Validate a scanned QR code
 */
export function validateQRCode(qrData: string): { valid: boolean; registrationId?: string; error?: string } {
    try {
        const payload = JSON.parse(qrData);

        if (!payload.id || !payload.ts || !payload.hash) {
            return { valid: false, error: 'Invalid QR code format' };
        }

        // Check if QR code is not too old (24 hours)
        const ageInHours = (Date.now() - payload.ts) / (1000 * 60 * 60);
        if (ageInHours > 24) {
            return { valid: false, error: 'QR code has expired' };
        }

        // Validate hash
        const expectedHash = generateHash(payload.id, payload.ts);
        if (payload.hash !== expectedHash) {
            return { valid: false, error: 'QR code validation failed' };
        }

        return { valid: true, registrationId: payload.id };
    } catch (error) {
        return { valid: false, error: 'Failed to parse QR code' };
    }
}

/**
 * Generate a simple hash for QR code validation
 */
function generateHash(registrationId: string, timestamp: number): string {
    const secret = process.env.NEXT_PUBLIC_QR_SECRET || 'arsenic-summit-2024';
    const data = `${registrationId}-${timestamp}-${secret}`;

    // Simple hash function (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
}

/**
 * Download QR code as PNG file
 */
export function downloadQRCode(dataUrl: string, filename: string = 'qr-code.png') {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
}

/**
 * Encode registration data for QR code
 */
export function encodeRegistrationData(data: any): string {
    return JSON.stringify({
        id: data.$id,
        name: data.name,
        event: data.eventType,
        ts: Date.now(),
    });
}

/**
 * Decode registration data from QR code
 */
export function decodeRegistrationData(qrData: string): any {
    try {
        return JSON.parse(qrData);
    } catch (error) {
        return null;
    }
}
