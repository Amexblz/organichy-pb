import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 });
    }

    const now = new Date();
    if (coupon.startDate > now) {
      return NextResponse.json({ error: "This coupon is not active yet" }, { status: 400 });
    }

    if (coupon.endDate && coupon.endDate < now) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit has been reached" }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
      discountAmount = Math.round(discountAmount * 100) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        description: coupon.description,
      },
    });
  } catch (error: any) {
    console.error("Apply coupon error:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}
