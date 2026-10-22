import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isApproved } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { isApproved: !!isApproved },
  });

  return NextResponse.json({ success: true, review: updated });
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 });
  }

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
