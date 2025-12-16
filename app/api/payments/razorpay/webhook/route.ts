import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    if (!DATABASE_ID) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const signature = request.headers.get("x-razorpay-signature") || "";
    const rawBody = await request.text();

    // Verify signature
    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

    if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let payload: any;
    try {
        payload = JSON.parse(rawBody);
    } catch (err) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const status = paymentEntity?.status;
    const registrationId = paymentEntity?.notes?.registrationId || orderEntity?.notes?.registrationId || "";

    if (!orderId || !paymentId) {
        return NextResponse.json({ error: "Missing order/payment details" }, { status: 200 });
    }

    // Only mark as success when captured/authorized
    const successStatuses = ["captured", "authorized", "paid"]; // paid in some webhook events
    const isSuccess = successStatuses.includes(status);

    try {
        // Update payment document if present
        try {
            const payments = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PAYMENTS,
                [Query.equal("orderId", orderId), Query.limit(1)]
            );
            if (payments.documents.length > 0) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.PAYMENTS,
                    payments.documents[0].$id,
                    {
                        status: isSuccess ? "success" : status || payments.documents[0].status,
                        transactionId: paymentId,
                        verifiedAt: new Date().toISOString(),
                        invoiceUrl: registrationId
                            ? `${request.nextUrl.origin}/api/payments/receipt?registrationId=${registrationId}&format=pdf`
                            : payments.documents[0].invoiceUrl,
                    }
                );
            }
        } catch (err) {
            console.error("Razorpay webhook payment update failed", err);
        }

        if (isSuccess && registrationId) {
            try {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.REGISTRATIONS,
                    registrationId,
                    {
                        paymentStatus: "paid",
                        updatedAt: new Date().toISOString(),
                    }
                );
            } catch (err) {
                console.error("Razorpay webhook registration update failed", err);
            }
        }
    } catch (err) {
        console.error("Razorpay webhook processing failed", err);
    }

    return NextResponse.json({ received: true });
}
