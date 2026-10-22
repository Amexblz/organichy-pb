import { NextResponse } from "next/server";
import { getCurrentCustomer, getCurrentAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const checkAdmin = url.searchParams.get("role") === "admin";

  if (checkAdmin) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      authenticated: true,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  }

  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: customer.role,
      hasPassword: !!customer.passwordHash,
      addresses: customer.addresses,
      profile: customer.profile,
    },
  });
}
