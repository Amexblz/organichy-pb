import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken, CUSTOMER_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPhone = body.phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "").slice(-10);
    const enteredOtp = (body.otp || "").toString().trim();
    const customerName = (body.name || "").toString().trim();

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit phone number is required" },
        { status: 400 }
      );
    }

    if (!enteredOtp || enteredOtp.length !== 6) {
      return NextResponse.json(
        { error: "Please enter the 6-digit verification code" },
        { status: 400 }
      );
    }

    // Verify OTP against database (or allow standard demo fallback 123456)
    const validRecord = await prisma.phoneOtp.findFirst({
      where: {
        phone: cleanPhone,
        otp: enteredOtp,
        expiresAt: { gt: new Date() },
        verified: false,
      },
    });

    const isMasterDemoOtp = enteredOtp === "123456";

    if (!validRecord && !isMasterDemoOtp) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please enter the correct code." },
        { status: 400 }
      );
    }

    // Mark OTP as verified if found
    if (validRecord) {
      await prisma.phoneOtp.update({
        where: { id: validRecord.id },
        data: { verified: true },
      });
    }

    // Find or create the user account
    let user = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (!user) {
      // Check if there are past orders with this phone to infer name/email
      const pastOrder = await prisma.order.findFirst({
        where: { guestPhone: cleanPhone },
        orderBy: { createdAt: "desc" },
      });

      let nameToUse = customerName || "Customer";
      let emailToUse = `${cleanPhone}@customer.organichy.com`;

      if (pastOrder) {
        try {
          const addr = JSON.parse(pastOrder.shippingAddressJson);
          if (addr?.fullName) nameToUse = addr.fullName;
          if (pastOrder.guestEmail) emailToUse = pastOrder.guestEmail;
        } catch (e) {}
      }

      user = await prisma.user.create({
        data: {
          name: nameToUse,
          phone: cleanPhone,
          email: emailToUse,
          role: "CUSTOMER",
          passwordHash: null,
          profile: {
            create: {},
          },
        },
      });
    }

    // Link any orphan guest orders with this phone number to the user
    await prisma.order.updateMany({
      where: {
        guestPhone: cleanPhone,
        userId: null,
      },
      data: {
        userId: user.id,
      },
    });

    // Create session JWT token
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Phone login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        hasPassword: !!user.passwordHash,
      },
      hasPassword: !!user.passwordHash,
    });

    response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
