import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE_NAME, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("type"); // "admin" or "customer"

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  if (target === "admin") {
    response.cookies.delete(ADMIN_COOKIE_NAME);
  } else {
    response.cookies.delete(CUSTOMER_COOKIE_NAME);
  }

  return response;
}
