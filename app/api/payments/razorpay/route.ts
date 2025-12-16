import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/payment-service';
import { databases, DATABASE_ID } from '@/lib/server-appwrite';
import { ID, Query } from 'node-appwrite';
import { COLLECTIONS } from '@/lib/schema';

/**
 * POST /api/payments/razorpay/create-order
 * Create a Razorpay payment order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, amount, email, name } = body;

    if (!registrationId || !amount || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 1 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!DATABASE_ID) throw new Error('Database not configured');

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, registrationId, email, name);

    // Store order in database for verification later
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PAYMENTS,
        ID.unique(),
        {
          registrationId,
          orderId: order.orderId,
          amount,
          currency: order.currency,
          status: 'pending',
          gateway: 'razorpay',
          createdAt: new Date().toISOString(),
        }
      );
    } catch (dbError) {
      console.error('Failed to store order in database:', dbError);
      // Continue anyway - order is created in Razorpay
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/razorpay/verify
 * Verify Razorpay payment signature
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature, registrationId } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    if (!DATABASE_ID) throw new Error('Database not configured');

    // Verify signature
    await verifyRazorpayPayment(orderId, paymentId, signature);

    // Update payment status in database
    if (registrationId) {
      try {
        // Find payment document
        const payments = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.PAYMENTS,
          [Query.equal('orderId', orderId), Query.limit(1)]
        );

        if (payments.documents.length > 0) {
          // Update payment status
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.PAYMENTS,
            payments.documents[0].$id,
            {
              status: 'success',
              transactionId: paymentId,
              verifiedAt: new Date().toISOString(),
              invoiceUrl: `${request.nextUrl.origin}/api/payments/receipt?registrationId=${registrationId}&format=pdf`,
            }
          );

          // Update registration payment status
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            registrationId,
            {
              paymentStatus: 'paid',
              updatedAt: new Date().toISOString(),
            }
          );
        }
      } catch (dbError) {
        console.error('Failed to update payment status:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  }
}
