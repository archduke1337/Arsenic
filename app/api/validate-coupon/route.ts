import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { code, eventId, baseAmount } = await request.json();

        // Basic input validation
        const normalizedCode = (code || "").toString().trim().toUpperCase();
        const amount = Number(baseAmount);

        if (!normalizedCode || Number.isNaN(amount) || amount <= 0) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount > 0 ? amount : 0,
                message: "Code and amount are required",
            });
        }

        const coupons = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.COUPONS,
            [Query.equal("code", normalizedCode), Query.limit(1)]
        );

        if (coupons.documents.length === 0) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount,
                message: "Coupon not found",
            });
        }

        const coupon = coupons.documents[0];

        // Status checks
        if (coupon.isActive === false) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount,
                message: "Coupon is inactive",
            });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount,
                message: "Coupon expired",
            });
        }

        if (coupon.eventId && eventId && coupon.eventId !== eventId) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount,
                message: "Coupon not valid for this event",
            });
        }

        const maxUses = typeof coupon.maxUses === "number" ? coupon.maxUses : undefined;
        const currentUses = typeof coupon.currentUses === "number" ? coupon.currentUses : 0;

        if (maxUses !== undefined && currentUses >= maxUses) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: amount,
                message: "Coupon usage limit reached",
            });
        }

        // Calculate discount
        const discountType = coupon.discountType;
        const discountValue = Number(coupon.discountValue) || 0;

        let discount = 0;
        if (discountType === "percentage") {
            discount = Math.round(amount * (discountValue / 100));
        } else if (discountType === "fixed") {
            discount = Math.round(discountValue);
        }

        if (discount < 0) discount = 0;
        if (discount > amount) discount = amount;

        const finalAmount = Math.max(amount - discount, 0);

        // Increment usage (best-effort, non-blocking for response speed)
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.COUPONS,
                coupon.$id,
                {
                    currentUses: currentUses + 1,
                    updatedAt: new Date().toISOString(),
                }
            );
        } catch (updateErr) {
            console.error("Failed to increment coupon usage", updateErr);
        }

        return NextResponse.json({
            valid: true,
            discount,
            finalAmount,
            code: coupon.code,
            discountType,
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json(
            { message: "Failed to validate coupon" },
            { status: 500 }
        );
    }
}
