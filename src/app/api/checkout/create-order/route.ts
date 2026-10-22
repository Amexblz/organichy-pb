import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { calculateCartTotals } from "@/lib/cart";

export async function POST(req: Request) {
  try {
    const session = await getCustomerSession();
    const body = await req.json();

    const {
      items,
      shippingAddress,
      paymentMethod = "COD",
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

    // 1. Recalculate totals strictly on server
    const calculated = await calculateCartTotals(items, couponCode);

    if (calculated.items.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // 2. Verify stock availability
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

    // 4. Run atomic database transaction
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

      // Create the order
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
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          paymentMethod,
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
                comment: paymentMethod === "COD" ? "Order confirmed with Cash on Delivery" : "Order placed with online payment",
                createdBy: session ? session.name : "Customer (Guest)",
              },
            ],
          },
          payments: {
            create: {
              amount: calculated.total,
              currency: "INR",
              provider: paymentMethod,
              status: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
              transactionId: paymentMethod === "COD" ? null : `pay_sim_${Date.now()}`,
            },
          },
        },
        include: {
          items: true,
        },
      });

      // Decrement stock & record inventory movements
      for (const item of calculated.items) {
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
            notes: `Order #${orderNumber}`,
          },
        });
      }

      // Record coupon usage if applied
      if (calculated.appliedCoupon) {
        const coupon = await tx.coupon.findUnique({
          where: { code: calculated.appliedCoupon.code },
        });

        if (coupon) {
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } },
          });

          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId: session?.userId || null,
              orderId: order.id,
              discountApplied: calculated.discount,
            },
          });
        }
      }

      // If user is logged in, update customer profile total spend & order count
      if (session?.userId) {
        await tx.customerProfile.upsert({
          where: { userId: session.userId },
          update: {
            totalSpend: { increment: calculated.total },
            ordersCount: { increment: 1 },
          },
          create: {
            userId: session.userId,
            totalSpend: calculated.total,
            ordersCount: 1,
          },
        });
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      total: createdOrder.total,
      paymentMethod: createdOrder.paymentMethod,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 500 });
  }
}
