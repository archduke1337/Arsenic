import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance (defer key validation to runtime)
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return null;
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

export async function POST(request: NextRequest) {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
        return NextResponse.json(
            { error: "Razorpay keys are not configured" },
            { status: 500 }
        );
    }

    try {
        const { amount, currency = "INR" } = await request.json();

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
