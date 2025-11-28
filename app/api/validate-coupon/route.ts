import { NextRequest, NextResponse } from "next/server";
import { databases, DATABASE_ID } from "@/lib/server-appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { code, eventId, baseAmount } = await request.json();

        if (!code || !baseAmount) {
            return NextResponse.json({ valid: false, discount: 0, finalAmount: baseAmount });
        }

        const coupons = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.COUPONS,
            [Query.equal("code", code.toUpperCase())]
        );

        if (coupons.documents.length === 0) {
            return NextResponse.json({ valid: false, discount: 0, finalAmount: baseAmount });
        }

        const coupon = coupons.documents[0];

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: baseAmount,
                message: "Coupon expired"
            });
        }

        if (coupon.eventId && coupon.eventId !== eventId) {
            return NextResponse.json({
                valid: false,
                discount: 0,
                finalAmount: baseAmount,
                message: "Coupon not valid for this event"
            });
        }

        const discountPercent = coupon.discountPercent || 0;
        const discount = Math.round(baseAmount * (discountPercent / 100));
        const finalAmount = baseAmount - discount;

        return NextResponse.json({
            valid: true,
            discount,
            finalAmount,
            code: coupon.code,
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json(
            { message: "Failed to validate coupon" },
            { status: 500 }
        );
    }
}
