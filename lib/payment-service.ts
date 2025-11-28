import crypto from 'crypto';

// Razorpay integration
interface RazorpayConfig {
  key: string; // RAZORPAY_KEY_ID
  secret: string; // RAZORPAY_SECRET
}

interface EasebuzzConfig {
  key: string; // EASEBUZZ_MERCHANT_KEY
  salt: string; // EASEBUZZ_SALT
  env: 'test' | 'prod';
}

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(
  amount: number, // In paise (100 paise = ₹1)
  registrationId: string,
  email: string,
  name: string
) {
  const config: RazorpayConfig = {
    key: process.env.RAZORPAY_KEY_ID || '',
    secret: process.env.RAZORPAY_SECRET || '',
  };

  if (!config.key || !config.secret) {
    throw new Error('Razorpay credentials not configured');
  }

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: `order_${registrationId}`,
    payment_capture: 1,
    description: 'Registration for Arsenic Summit',
    customer_notify: 1,
    notes: {
      registrationId,
      email,
      name,
    },
  };

  const auth = Buffer.from(
    `${config.key}:${config.secret}`
  ).toString('base64');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${response.statusText}`);
    }

    const order = await response.json();
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw error;
  }
}

/**
 * Verify Razorpay payment
 */
export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const secret = process.env.RAZORPAY_SECRET;

  if (!secret) {
    throw new Error('Razorpay secret not configured');
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  const isValid = expectedSignature === signature;

  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  return { success: true, verified: true };
}

/**
 * Get Razorpay payment details
 */
export async function getRazorpayPaymentDetails(paymentId: string) {
  const config: RazorpayConfig = {
    key: process.env.RAZORPAY_KEY_ID || '',
    secret: process.env.RAZORPAY_SECRET || '',
  };

  if (!config.key || !config.secret) {
    throw new Error('Razorpay credentials not configured');
  }

  const auth = Buffer.from(
    `${config.key}:${config.secret}`
  ).toString('base64');

  try {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch payment details`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get payment details:', error);
    throw error;
  }
}

/**
 * Create Easebuzz payment
 */
export async function createEasebuzzPayment(
  amount: number,
  registrationId: string,
  email: string,
  name: string,
  phone: string,
  redirectUrl: string
) {
  const config: EasebuzzConfig = {
    key: process.env.EASEBUZZ_MERCHANT_KEY || '',
    salt: process.env.EASEBUZZ_SALT || '',
    env: (process.env.EASEBUZZ_ENV as 'test' | 'prod') || 'test',
  };

  if (!config.key || !config.salt) {
    throw new Error('Easebuzz credentials not configured');
  }

  const txnId = `TXN_${registrationId}_${Date.now()}`;

  // Create transaction hash
  const hashString = `${config.key}|${txnId}|${amount}|Arsenic Summit Registration|${name}|${email}|||||||||||${config.salt}`;
  const hash = crypto
    .createHmac('sha256', config.salt)
    .update(hashString)
    .digest('hex');

  const payload = {
    key: config.key,
    txn_id: txnId,
    amount: amount,
    product_name: 'Arsenic Summit Registration',
    firstname: name,
    email: email,
    phone: phone,
    surl: redirectUrl,
    furl: redirectUrl,
    hash: hash,
  };

  const baseUrl =
    config.env === 'prod'
      ? 'https://pay.easebuzz.in'
      : 'https://testpay.easebuzz.in';

  const paymentUrl = `${baseUrl}/payment/initiateLink/`;

  return {
    success: true,
    txnId,
    paymentUrl,
    payload,
  };
}

/**
 * Verify Easebuzz payment
 */
export async function verifyEasebuzzPayment(
  txnId: string,
  amount: number,
  status: string,
  hash: string
) {
  const salt = process.env.EASEBUZZ_SALT;

  if (!salt) {
    throw new Error('Easebuzz salt not configured');
  }

  // Reconstruct hash to verify
  const hashString = `${status}|${txnId}|${amount}|${salt}`;
  const expectedHash = crypto
    .createHmac('sha256', salt)
    .update(hashString)
    .digest('hex');

  const isValid = expectedHash === hash;

  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  return { success: true, verified: true };
}

/**
 * Generate invoice PDF (uses pdfkit)
 */
export async function generateInvoicePDF(
  paymentData: {
    transactionId: string;
    amount: number;
    date: Date;
    registrationCode: string;
    participantName: string;
    email: string;
    eventName: string;
  }
): Promise<Buffer> {
  try {
    // Invoice generation requires pdfkit - implement in production
    // This is a placeholder that returns a basic PDF buffer
    // For production, integrate with pdfkit library
    
    // Create invoice data structure
    const invoiceContent = {
      header: 'Invoice',
      transactionId: paymentData.transactionId,
      date: paymentData.date.toLocaleDateString(),
      participantName: paymentData.participantName,
      email: paymentData.email,
      eventName: paymentData.eventName,
      amount: paymentData.amount,
      registrationCode: paymentData.registrationCode,
    };
    
    // Return buffer (minimal implementation)
    const jsonStr = JSON.stringify(invoiceContent);
    return Buffer.from(jsonStr);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw new Error('Failed to generate invoice PDF');
  }
}

/**
 * Refund payment (Razorpay)
 */
export async function refundRazorpayPayment(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const config: RazorpayConfig = {
    key: process.env.RAZORPAY_KEY_ID || '',
    secret: process.env.RAZORPAY_SECRET || '',
  };

  if (!config.key || !config.secret) {
    throw new Error('Razorpay credentials not configured');
  }

  const auth = Buffer.from(
    `${config.key}:${config.secret}`
  ).toString('base64');

  const body: any = {};
  if (amount) body.amount = amount;
  if (notes) body.notes = notes;

  try {
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('Refund failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Refund failed:', error);
    throw error;
  }
}

/**
 * Apply coupon/discount
 */
export async function validateCoupon(
  couponCode: string,
  amount: number
): Promise<{ valid: boolean; discountType: string; discountValue: number; finalAmount: number }> {
  try {
    // Implementation would query Appwrite database for coupons collection
    // For now, return invalid coupon (production will query DB)
    if (!couponCode || couponCode.trim().length === 0) {
      return {
        valid: false,
        discountType: 'percentage',
        discountValue: 0,
        finalAmount: amount,
      };
    }

    // Coupon validation would go here
    return {
      valid: false,
      discountType: 'percentage',
      discountValue: 0,
      finalAmount: amount,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw new Error('Failed to validate coupon');
  }
}

/**
 * Calculate final amount with GST
 */
export function calculateWithGST(
  baseAmount: number,
  gstRate: number = 5
): { baseAmount: number; gst: number; totalAmount: number } {
  const gst = baseAmount * (gstRate / 100);
  const totalAmount = baseAmount + gst;

  return {
    baseAmount,
    gst,
    totalAmount,
  };
}
