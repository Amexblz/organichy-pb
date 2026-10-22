import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPhone = body.phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Indian mobile number starting with 6, 7, 8, or 9." },
        { status: 400 }
      );
    }

    // Check if user or orders exist with this phone
    const existingUser = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    const orderCount = await prisma.order.count({
      where: {
        OR: [
          { guestPhone: cleanPhone },
          ...(existingUser ? [{ userId: existingUser.id }] : []),
        ],
      },
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any previous pending OTPs for this phone
    await prisma.phoneOtp.deleteMany({
      where: { phone: cleanPhone },
    });

    // Save new OTP
    await prisma.phoneOtp.create({
      data: {
        phone: cleanPhone,
        otp,
        expiresAt,
        verified: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      phone: cleanPhone,
      userExists: !!existingUser,
      orderCount,
      // Provided in development/demo for immediate zero-friction testing
      demoOtp: otp,
    });
  } catch (error: any) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
