import { NextResponse } from "next/server";
import { verifyRazorpaySignature, RAZORPAY_KEY_SECRET } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Missing fields check
    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required payment fields (order_id, payment_id, signature)",
        },
        { status: 400 }
      );
    }

    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured on server" },
        { status: 500 }
      );
    }

    // Verify signature using HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const isValid = verifyRazorpaySignature(order_id, payment_id, signature);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature. Verification failed.",
        },
        { status: 400 }
      );
    }

    // If an application order ID / orderNumber was attached, update database order
    const appOrderId = body.orderId;
    const appOrderNumber = body.orderNumber;

    if (appOrderId || appOrderNumber) {
      try {
        const order = await prisma.order.findFirst({
          where: appOrderId ? { id: appOrderId } : { orderNumber: appOrderNumber },
        });

        if (order) {
          await prisma.$transaction(async (tx) => {
            await tx.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
              },
            });

            await tx.payment.create({
              data: {
                orderId: order.id,
                amount: order.total,
                currency: "INR",
                provider: "RAZORPAY",
                status: "CAPTURED",
                transactionId: payment_id,
                metadataJson: JSON.stringify({
                  razorpayOrderId: order_id,
                  razorpayPaymentId: payment_id,
                  razorpaySignature: signature,
                  verifiedAt: new Date().toISOString(),
                }),
              },
            });

            await tx.orderStatusHistory.create({
              data: {
                orderId: order.id,
                status: "PROCESSING",
                comment: `Razorpay payment verified successfully. Payment ID: ${payment_id}`,
                createdBy: "Razorpay Standard Checkout",
              },
            });
          });
        }
      } catch (dbErr) {
        console.error("Database order update error during verify-payment:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order_id,
      payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification endpoint error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
