import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await prisma.advertisementVideo.findMany({
      where: { active: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
      take: 12,
    });

    return NextResponse.json({ videos });
  } catch (error: any) {
    console.error("Public fetch videos error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
