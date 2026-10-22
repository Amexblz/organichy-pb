import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyDummyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethodDetail = "UPI",
      simulateFailure = false,
    } = body;

    if (!orderId && !orderNumber) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. Handle Simulated Failure
    if (simulateFailure) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
          },
        });

        await tx.payment.create({
          data: {
            orderId: order.id,
            amount: order.total,
            currency: "INR",
            provider: "RAZORPAY",
            status: "FAILED",
            transactionId: razorpay_payment_id || `pay_fail_${Date.now()}`,
            metadataJson: JSON.stringify({
              error: "Payment declined by customer bank / user cancelled authorization",
              razorpayOrderId: razorpay_order_id,
            }),
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "PENDING",
            comment: "Razorpay payment authorization failed or was declined.",
            createdBy: "Razorpay Gateway Webhook",
          },
        });
      });

      return NextResponse.json(
        { error: "Payment authorization was declined by the bank. Please try another method." },
        { status: 400 }
      );
    }

    // 2. Verify Razorpay Signature
    const isValidSignature = verifyDummyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature. Security check failed." },
        { status: 400 }
      );
    }

    // 3. Complete order and deduct stock atomically
    const finalizedOrder = await prisma.$transaction(async (tx) => {
      // Mark order as PAID & PROCESSING
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      });

      // Update or create payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          currency: "INR",
          provider: "RAZORPAY",
          status: "COMPLETED",
          transactionId: razorpay_payment_id,
          signature: razorpay_signature,
          metadataJson: JSON.stringify({
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            method: paymentMethodDetail,
            verifiedAt: new Date().toISOString(),
          }),
        },
      });

      // Add status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: "PROCESSING",
          comment: `Payment of ₹${order.total} received via Razorpay (${paymentMethodDetail}). Payment ID: ${razorpay_payment_id}`,
          createdBy: "Razorpay Gateway System",
        },
      });

      // Decrement stock & record inventory movements
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryMovement.create({
          data: {
            variantId: item.variantId,
            quantity: -item.quantity,
            type: "SALE",
            notes: `Deducted for paid Order ${order.orderNumber} (Razorpay ID: ${razorpay_payment_id})`,
          },
        });
      }

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      orderNumber: finalizedOrder.orderNumber,
      total: finalizedOrder.total,
      paymentId: razorpay_payment_id,
      paymentMethod: "RAZORPAY",
    });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Razorpay payment" },
      { status: 500 }
    );
  }
}
