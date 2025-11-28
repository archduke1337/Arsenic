import QRCode from 'qrcode';

/**
 * Generate QR code for registration
 */
export async function generateQRCode(
  registrationCode: string,
  participantName: string,
  eventId: string
): Promise<string> {
  try {
    const data = JSON.stringify({
      code: registrationCode,
      name: participantName,
      eventId,
      timestamp: Date.now(),
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code as Buffer
 */
export async function generateQRCodeBuffer(
  registrationCode: string,
  participantName: string,
  eventId: string
): Promise<Buffer> {
  try {
    const data = JSON.stringify({
      code: registrationCode,
      name: participantName,
      eventId,
      timestamp: Date.now(),
    });

    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return buffer;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Decode QR code data
 */
export function decodeQRCode(data: string): {
  code: string;
  name: string;
  eventId: string;
  timestamp: number;
} {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error decoding QR code:', error);
    throw new Error('Invalid QR code data');
  }
}

/**
 * Validate QR code
 */
export function validateQRCode(
  data: any,
  maxAgeMs: number = 24 * 60 * 60 * 1000 // 24 hours
): boolean {
  try {
    const currentTime = Date.now();
    const age = currentTime - data.timestamp;

    // Check if QR code is not too old
    if (age > maxAgeMs) {
      return false;
    }

    // Check required fields
    if (!data.code || !data.name || !data.eventId) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating QR code:', error);
    return false;
  }
}
