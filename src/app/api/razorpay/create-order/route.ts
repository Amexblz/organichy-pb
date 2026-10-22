import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { calculateCartTotals } from "@/lib/cart";
import { createDummyRazorpayOrder, DUMMY_RAZORPAY_KEY_ID } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getCustomerSession();
    const body = await req.json();

    const {
      items,
      shippingAddress,
      couponCode,
      guestEmail,
      guestPhone,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode || !shippingAddress.addressLine1) {
      return NextResponse.json({ error: "Complete shipping address is required" }, { status: 400 });
    }

    // 1. Recalculate totals on server
    const calculated = await calculateCartTotals(items, couponCode);

    if (calculated.items.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // 2. Check stock availability
    for (const item of calculated.items) {
      if (item.quantity > item.stock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name} (${item.variantLabel}). Only ${item.stock} available.` },
          { status: 400 }
        );
      }
    }

    // 3. Generate unique order number
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORG-2026-${timestamp}-${randomSuffix}`;

    const rawPhone = shippingAddress.phone || guestPhone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const cleanEmail = (guestEmail || shippingAddress.email || "").trim().toLowerCase();

    // 4. Create dummy Razorpay Order object
    const razorpayOrder = createDummyRazorpayOrder(calculated.total, orderNumber);

    // 5. Store pending order in database
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Find or auto-create customer account using phone number
      let targetUserId = session?.userId || null;

      if (!targetUserId && cleanPhone) {
        let existingUser = await tx.user.findFirst({
          where: {
            OR: [
              { phone: cleanPhone },
              ...(cleanEmail ? [{ email: cleanEmail }] : []),
            ],
          },
        });

        if (existingUser) {
          targetUserId = existingUser.id;
          if (!existingUser.phone && cleanPhone) {
            await tx.user.update({
              where: { id: existingUser.id },
              data: { phone: cleanPhone },
            });
          }
        } else {
          // Auto-provision user account with Phone ID
          const fallbackEmail = cleanEmail || `${cleanPhone}@customer.organichy.com`;
          const newUser = await tx.user.create({
            data: {
              name: shippingAddress.fullName.trim(),
              phone: cleanPhone,
              email: fallbackEmail,
              role: "CUSTOMER",
              passwordHash: null, // allows setting password later
              profile: {
                create: {
                  ordersCount: 1,
                  totalSpend: calculated.total,
                },
              },
              addresses: {
                create: {
                  fullName: shippingAddress.fullName.trim(),
                  phone: cleanPhone,
                  addressLine1: shippingAddress.addressLine1.trim(),
                  addressLine2: shippingAddress.addressLine2?.trim() || null,
                  city: shippingAddress.city.trim(),
                  state: shippingAddress.state || "Delhi NCR",
                  pincode: shippingAddress.pincode.trim(),
                  isDefault: true,
                },
              },
            },
          });
          targetUserId = newUser.id;
        }
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: targetUserId,
          guestEmail: cleanEmail || null,
          guestPhone: cleanPhone || shippingAddress.phone,
          subtotal: calculated.subtotal,
          discount: calculated.discount,
          shippingFee: calculated.shippingFee,
          tax: 0.0,
          total: calculated.total,
          couponCode: calculated.appliedCoupon ? calculated.appliedCoupon.code : null,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: "RAZORPAY",
          shippingAddressJson: JSON.stringify(shippingAddress),
          items: {
            create: calculated.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.name,
              variantLabel: item.variantLabel,
              sku: item.variantId,
              unitPrice: item.unitPrice,
              mrp: item.mrp,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              image: item.image,
            })),
          },
          statusHistory: {
            create: [
              {
                status: "PENDING",
                comment: "Checkout initiated. Awaiting Razorpay online payment authorization.",
                createdBy: session ? session.name : "Customer (Guest)",
              },
            ],
          },
          payments: {
            create: {
              amount: calculated.total,
              currency: "INR",
              provider: "RAZORPAY",
              status: "PENDING",
              transactionId: razorpayOrder.id,
              metadataJson: JSON.stringify({
                razorpayOrderId: razorpayOrder.id,
                amountInPaise: razorpayOrder.amount,
                receipt: razorpayOrder.receipt,
              }),
            },
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: calculated.total,
      currency: "INR",
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: DUMMY_RAZORPAY_KEY_ID,
      },
      prefill: {
        name: shippingAddress.fullName,
        email: shippingAddress.email || guestEmail || "",
        contact: shippingAddress.phone || guestPhone || "",
      },
    });
  } catch (error: any) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay payment order" },
      { status: 500 }
    );
  }
}
