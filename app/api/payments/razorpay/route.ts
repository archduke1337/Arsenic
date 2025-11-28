import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/payment-service';
import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';

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

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, registrationId, email, name);

    // Store order in database for verification later
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (databaseId) {
      try {
        await databases.createDocument(
          databaseId,
          'payments',
          ID.unique(),
          {
            registrationId,
            orderId: order.orderId,
            amount,
            currency: order.currency,
            status: 'pending',
            gateway: 'razorpay',
            createdAt: new Date(),
          }
        );
      } catch (dbError) {
        console.error('Failed to store order in database:', dbError);
        // Continue anyway - order is created in Razorpay
      }
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

    // Verify signature
    await verifyRazorpayPayment(orderId, paymentId, signature);

    // Update payment status in database
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (databaseId && registrationId) {
      try {
        // Find payment document
        const payments = await databases.listDocuments(
          databaseId,
          'payments',
          [
            `orderId == "${orderId}"`,
          ]
        );

        if (payments.documents.length > 0) {
          // Update payment status
          await databases.updateDocument(
            databaseId,
            'payments',
            payments.documents[0].$id,
            {
              status: 'success',
              transactionId: paymentId,
              verifiedAt: new Date(),
            }
          );

          // Update registration payment status
          await databases.updateDocument(
            databaseId,
            'registrations',
            registrationId,
            {
              paymentStatus: 'paid',
              updatedAt: new Date(),
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
