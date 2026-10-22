import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const whereClause: any = {};
  if (status && status !== "ALL") {
    whereClause.status = status;
  }
  if (search) {
    whereClause.OR = [
      { orderNumber: { contains: search } },
      { guestEmail: { contains: search } },
      { guestPhone: { contains: search } },
      { user: { name: { contains: search } } },
      { trackingNumber: { contains: search } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: true,
      shipments: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
