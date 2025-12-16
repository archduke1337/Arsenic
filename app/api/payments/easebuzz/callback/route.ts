import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { verifyEasebuzzPayment } from "@/lib/payment-service";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";

async function collectParams(request: NextRequest): Promise<Record<string, string>> {
    const params: Record<string, string> = {};

    if (request.method === "POST") {
        const form = await request.formData();
        form.forEach((value, key) => {
            params[key] = String(value);
        });
    } else {
        request.nextUrl.searchParams.forEach((value, key) => {
            params[key] = value;
        });
    }

    return params;
}

function deriveRegistrationId(txnId: string, provided?: string): string {
    if (provided) return provided;
    if (txnId?.startsWith("TXN_")) {
        const parts = txnId.split("_");
        if (parts.length >= 3) return parts[1];
    }
    return "";
}

export async function GET(request: NextRequest) {
    return handleCallback(request);
}

export async function POST(request: NextRequest) {
    return handleCallback(request);
}

async function handleCallback(request: NextRequest) {
    const params = await collectParams(request);

    const txnId = params["txnid"] || params["txnId"] || "";
    const amountStr = params["amount"] || params["amt"] || "0";
    const status = params["status"] || params["easebuzzStatus"] || "";
    const hash = params["hash"] || "";
    const regId = deriveRegistrationId(txnId, params["registrationId"] || params["registration_id"] || params["udf1"]);

    let verified = false;
    let error: string | undefined;

    try {
        const amount = Number(amountStr) || 0;
        await verifyEasebuzzPayment(txnId, amount, status, hash);
        verified = status === "0";

        if (DATABASE_ID) {
            // Update payment document
            try {
                const payments = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.PAYMENTS,
                    [Query.equal("transactionId", txnId), Query.limit(1)]
                );

                if (payments.documents.length > 0) {
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTIONS.PAYMENTS,
                        payments.documents[0].$id,
                        {
                            status: verified ? "success" : "failed",
                            verifiedAt: new Date().toISOString(),
                            invoiceUrl: `${request.nextUrl.origin}/api/payments/receipt?registrationId=${regId}`,
                        }
                    );
                }
            } catch (dbErr) {
                console.error("Easebuzz callback payment update failed", dbErr);
            }

            // Update registration status
            if (verified && regId) {
                try {
                    await databases.updateDocument(
                        DATABASE_ID,
                        COLLECTIONS.REGISTRATIONS,
                        regId,
                        {
                            paymentStatus: "paid",
                            updatedAt: new Date().toISOString(),
                        }
                    );
                } catch (dbErr) {
                    console.error("Easebuzz callback registration update failed", dbErr);
                }
            }
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Verification failed";
    }

    const redirectParams = new URLSearchParams({
        gateway: "easebuzz",
        txnId: txnId || "",
        registrationId: regId || "",
        status: verified ? "success" : "pending",
    });
    if (error) redirectParams.set("error", error);

    const redirectUrl = `${request.nextUrl.origin}/register/success?${redirectParams.toString()}`;
    return NextResponse.redirect(redirectUrl, { status: 302 });
}
