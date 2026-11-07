import { NextResponse } from "next/server";
import { razorpayInstance, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured in environment" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    // Validate amount: must be a number and at least 100 paise (1 INR)
    if (typeof amount !== "number" || isNaN(amount) || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (1 INR)." },
        { status: 400 }
      );
    }

    try {
      const order = await razorpayInstance.orders.create({
        amount: Math.round(amount),
        currency: currency || "INR",
        receipt: receipt || `rcpt_${Date.now()}`,
      });

      return NextResponse.json({
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      });
    } catch (razorpayErr: any) {
      console.error("Razorpay API create order error:", razorpayErr);
      if (razorpayErr?.statusCode === 401) {
        return NextResponse.json(
          { error: "Razorpay authentication failed. Please check your credentials." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        {
          error:
            razorpayErr?.error?.description ||
            razorpayErr.message ||
            "Failed to create Razorpay order",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Create order endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order creation" },
      { status: 500 }
    );
  }
}
