import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default-settings" },
    });

    const response = NextResponse.json({ settings });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ settings: null });
  }
}
