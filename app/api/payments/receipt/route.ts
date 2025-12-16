import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";
import PDFDocument from "pdfkit";
import path from "path";
import { promises as fs } from "fs";

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
        const issued = new Date().toLocaleString();
        const headerColor = "#0ea5e9";

        // Optional logo: env path or fallback to /public/logo.png
        let logoBuffer: Buffer | null = null;
        const logoPath = process.env.RECEIPT_LOGO_PATH || path.join(process.cwd(), "public", "logo.png");
        try {
            logoBuffer = await fs.readFile(logoPath);
        } catch (err) {
            console.error("Receipt logo load failed", err);
        }

        // Header bar
        doc.rect(36, 36, doc.page.width - 72, 40).fill(headerColor);
        const textStartX = logoBuffer ? 44 + 40 + 10 : 44;
        if (logoBuffer) {
            try {
                doc.image(logoBuffer, 44, 40, { fit: [32, 32], align: "left" });
            } catch (err) {
                console.error("Receipt logo render failed", err);
            }
        }
        doc.fillColor("#fff").fontSize(18).text("Arsenic Summit", textStartX, 46, { align: "left" });
        doc.fontSize(10).text("Payment Receipt", textStartX, 66, { align: "left" });

        doc.moveDown(2.5);
        doc.fillColor("#000").fontSize(14).text("Receipt Details", { align: "left" });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#555");
        doc.text(`Issued: ${issued}`);
        doc.text(`Registration ID: ${registration?.$id ?? ""}`);
        doc.text(`Registration Code: ${registration?.code ?? ""}`);
        doc.moveDown();

        // Participant block
        doc.fillColor("#000").fontSize(12).text("Participant", { align: "left" });
        doc.moveDown(0.35);
        doc.fontSize(10).fillColor("#333");
        doc.text(`Name: ${registration?.fullName ?? ""}`);
        doc.text(`Email: ${registration?.email ?? ""}`);
        doc.text(`Phone: ${registration?.phone ?? ""}`);
        doc.text(`Event: ${registration?.eventId ?? ""}`);
        doc.moveDown();

        // Payment summary table
        doc.fillColor("#000").fontSize(12).text("Payment", { align: "left" });
        doc.moveDown(0.35);
        doc.fontSize(10).fillColor("#222");

        const rows: Array<[string, string]> = [
            ["Gateway", payment?.gateway ?? "—"],
            ["Order / Txn", payment?.orderId || payment?.transactionId || "—"],
            ["Amount", `₹${payment?.amount ?? registration?.paymentAmount ?? "—"}`],
            ["Status", paid ? "Paid" : "Pending"],
        ];
        if (payment?.verifiedAt) {
            rows.push(["Verified At", payment.verifiedAt]);
        }

        const startX = 44;
        const startY = doc.y + 4;
        const labelWidth = 140;
        const valueWidth = doc.page.width - startX - labelWidth - 44;
        const rowHeight = 18;

        rows.forEach(([label, value], idx) => {
            const y = startY + idx * rowHeight;
            doc.fillColor("#f5f5f5").rect(startX - 8, y - 4, labelWidth + valueWidth + 16, rowHeight).fill(idx % 2 === 0 ? "#f9fafb" : "#f1f5f9");
            doc.fillColor("#555").text(label, startX, y, { width: labelWidth });
            doc.fillColor("#111").text(value, startX + labelWidth + 8, y, { width: valueWidth });
        });

        doc.y = startY + rows.length * rowHeight + 12;
        doc.moveDown();
        doc.fillColor(paid ? "#157347" : "#b26b00").fontSize(11).text(paid ? "Payment confirmed." : "Payment pending. If you were charged, contact support with this receipt.");

        doc.end();
    });
}
