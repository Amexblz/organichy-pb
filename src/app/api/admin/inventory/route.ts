import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const lowStockOnly = searchParams.get("lowStock") === "true";

  const whereClause: any = {};
  if (lowStockOnly) {
    whereClause.stock = { lte: 10 };
  }

  const variants = await prisma.productVariant.findMany({
    where: whereClause,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          category: { select: { name: true } },
        },
      },
      inventoryMovements: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { stock: "asc" },
  });

  return NextResponse.json({ variants });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { variantId, adjustment, type = "ADJUSTMENT", notes } = await req.json();

    if (!variantId || adjustment === undefined) {
      return NextResponse.json({ error: "Variant ID and adjustment amount required" }, { status: 400 });
    }

    const delta = parseInt(adjustment);

    const updatedVariant = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stock: {
            increment: delta,
          },
        },
      });

      await tx.inventoryMovement.create({
        data: {
          variantId,
          quantity: delta,
          type,
          notes: notes || `Manual stock adjustment by ${session.name}`,
        },
      });

      return v;
    });

    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "INVENTORY_ADJUSTED",
        entity: "ProductVariant",
        entityId: variantId,
        detailsJson: JSON.stringify({ adjustment: delta, newStock: updatedVariant.stock }),
      },
    });

    return NextResponse.json({ success: true, variant: updatedVariant });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to adjust inventory" }, { status: 500 });
  }
}
