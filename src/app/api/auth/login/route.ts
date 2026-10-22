import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSessionToken, CUSTOMER_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || body.email || body.phone || "").trim();
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Phone number/email and password are required." },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.toLowerCase().trim();
    const cleanPhone = cleanIdentifier.replace(/\D/g, "").slice(-10);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          ...(cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "No password set for this account yet. Please sign in via Phone OTP and set your password in your profile." },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role as "CUSTOMER" | "ADMIN",
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    response.cookies.set({
      name: CUSTOMER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to sign in." }, { status: 500 });
  }
}
