import { NextRequest, NextResponse } from 'next/server';
import { createEasebuzzPayment, verifyEasebuzzPayment } from '@/lib/payment-service';
import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';

/**
 * POST /api/payments/easebuzz/create-order
 * Create an Easebuzz payment order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, amount, email, name, phone, redirectUrl } = body;

    if (!registrationId || !amount || !email || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount < 1 || amount > 500000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const payment = await createEasebuzzPayment(
      amount,
      registrationId,
      email,
      name,
      phone,
      redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/register/success`
    );

    // Store order in database
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (databaseId) {
      try {
        await databases.createDocument(
          databaseId,
          'payments',
          ID.unique(),
          {
            registrationId,
            transactionId: payment.txnId,
            amount,
            currency: 'INR',
            status: 'pending',
            gateway: 'easebuzz',
            createdAt: new Date(),
          }
        );
      } catch (dbError) {
        console.error('Failed to store order in database:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      txnId: payment.txnId,
      paymentUrl: payment.paymentUrl,
      payload: payment.payload,
    });
  } catch (error) {
    console.error('Error creating Easebuzz order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/easebuzz/verify
 * Verify Easebuzz payment
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { txnId, amount, status, hash, registrationId } = body;

    if (!txnId || !amount || !status || !hash) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    // Verify payment
    await verifyEasebuzzPayment(txnId, amount, status, hash);

    // Update payment status
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    if (databaseId && registrationId) {
      try {
        const payments = await databases.listDocuments(
          databaseId,
          'payments',
          [`transactionId == "${txnId}"`]
        );

        if (payments.documents.length > 0) {
          await databases.updateDocument(
            databaseId,
            'payments',
            payments.documents[0].$id,
            {
              status: status === '0' ? 'success' : 'failed',
              verifiedAt: new Date(),
            }
          );

          if (status === '0') {
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
        }
      } catch (dbError) {
        console.error('Failed to update payment status:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      verified: status === '0',
      message: status === '0' ? 'Payment successful' : 'Payment failed',
    });
  } catch (error) {
    console.error('Error verifying Easebuzz payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  }
}
