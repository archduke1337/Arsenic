import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";
import PDFDocument from "pdfkit";

export async function GET(request: NextRequest) {
    const registrationId = request.nextUrl.searchParams.get("registrationId") || "";

    if (!registrationId) {
        return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
    }

    if (!DATABASE_ID) {
        return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    try {
        const registration = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.REGISTRATIONS,
            registrationId
        );

        let payment: any = null;
        try {
            const payments = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PAYMENTS,
                [Query.equal("registrationId", registrationId), Query.orderDesc("$createdAt"), Query.limit(1)]
            );
            payment = payments.documents[0] || null;
        } catch (err) {
            // Ignore payment lookup failure; still show receipt basics
            console.error("Receipt payment lookup failed", err);
        }

        const format = request.nextUrl.searchParams.get("format") || "pdf";

        if (format === "html") {
            const html = buildReceiptHtml({ registration, payment });
            return new NextResponse(html, {
                status: 200,
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-store",
                },
            });
        }

        const pdfBuffer = await buildReceiptPdf({ registration, payment });
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename=receipt-${registrationId}.pdf`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Receipt generation failed", error);
        return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }
}

function buildReceiptHtml({ registration, payment }: { registration: any; payment: any }) {
    const issuedAt = new Date().toLocaleString();
    const paid = payment?.status === "success" || registration?.paymentStatus === "paid";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Payment Receipt</title>
<style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; padding: 24px; }
    .card { max-width: 640px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
    .title { font-size: 20px; margin: 0 0 12px; }
    .muted { color: #666; font-size: 13px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .row:last-child { border-bottom: none; }
    .label { color: #555; }
    .value { font-weight: 600; color: #111; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .success { background: #e8f7ed; color: #157347; }
    .pending { background: #fff4e5; color: #b26b00; }
    .section { margin-top: 16px; }
</style>
</head>
<body>
    <div class="card">
        <h1 class="title">Arsenic Summit Receipt</h1>
        <p class="muted">Issued on ${issuedAt}</p>
        <p class="muted">Registration ID: ${registration?.$id ?? ""}</p>
        <div class="section">
            <div class="row"><span class="label">Name</span><span class="value">${registration?.fullName ?? ""}</span></div>
            <div class="row"><span class="label">Email</span><span class="value">${registration?.email ?? ""}</span></div>
            <div class="row"><span class="label">Phone</span><span class="value">${registration?.phone ?? ""}</span></div>
            <div class="row"><span class="label">Registration Code</span><span class="value">${registration?.code ?? ""}</span></div>
            <div class="row"><span class="label">Gateway</span><span class="value">${payment?.gateway ?? "—"}</span></div>
            <div class="row"><span class="label">Order / Txn</span><span class="value">${payment?.orderId || payment?.transactionId || "—"}</span></div>
            <div class="row"><span class="label">Amount</span><span class="value">₹${payment?.amount ?? registration?.paymentAmount ?? "—"}</span></div>
            <div class="row"><span class="label">Status</span><span class="value"><span class="badge ${paid ? "success" : "pending"}">${paid ? "Paid" : "Pending"}</span></span></div>
        </div>
    </div>
</body>
</html>`;
}

async function buildReceiptPdf({ registration, payment }: { registration: any; payment: any }) {
    const doc = new PDFDocument({ margin: 36, size: "A4" });
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
        doc.on("data", (chunk) => chunks.push(chunk as Buffer));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        const paid = payment?.status === "success" || registration?.paymentStatus === "paid";

        doc.fontSize(18).text("Arsenic Summit Receipt", { align: "left" });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#555").text(`Issued: ${new Date().toLocaleString()}`);
        doc.text(`Registration ID: ${registration?.$id ?? ""}`);

        doc.moveDown();
        doc.fillColor("#000").fontSize(12).text("Participant");
        doc.moveDown(0.25);
        doc.fontSize(10).fillColor("#333");
        doc.text(`Name: ${registration?.fullName ?? ""}`);
        doc.text(`Email: ${registration?.email ?? ""}`);
        doc.text(`Phone: ${registration?.phone ?? ""}`);
        doc.text(`Registration Code: ${registration?.code ?? ""}`);

        doc.moveDown();
        doc.fillColor("#000").fontSize(12).text("Payment");
        doc.moveDown(0.25);
        doc.fontSize(10).fillColor("#333");
        doc.text(`Gateway: ${payment?.gateway ?? "—"}`);
        doc.text(`Order / Txn: ${payment?.orderId || payment?.transactionId || "—"}`);
        doc.text(`Amount: ₹${payment?.amount ?? registration?.paymentAmount ?? "—"}`);
        doc.text(`Status: ${paid ? "Paid" : "Pending"}`);
        if (payment?.verifiedAt) {
            doc.text(`Verified At: ${payment.verifiedAt}`);
        }

        doc.end();
    });
}
