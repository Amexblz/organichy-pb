import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
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
      payments: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, paymentStatus, trackingNumber, courierName, comment } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status && status !== existingOrder.status) {
      updateData.status = status;
    }
    if (paymentStatus && paymentStatus !== existingOrder.paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber;
    }
    if (courierName !== undefined) {
      updateData.courierName = courierName;
    }

    // Execute atomic update
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. If status is being set to CANCELLED and was not previously CANCELLED, restore inventory
      if (status === "CANCELLED" && existingOrder.status !== "CANCELLED") {
        for (const item of existingOrder.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          await tx.inventoryMovement.create({
            data: {
              variantId: item.variantId,
              quantity: item.quantity,
              type: "RETURN",
              notes: `Order #${existingOrder.orderNumber} cancelled by admin`,
            },
          });
        }
      }

      // 2. If tracking number is added, upsert shipment
      if (trackingNumber) {
        await tx.shipment.create({
          data: {
            orderId: existingOrder.id,
            trackingNumber,
            courier: courierName || "Standard Express",
            status: "IN_TRANSIT",
            shippedAt: new Date(),
          },
        });
      }

      // 3. Record status history
      if (status || comment) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: existingOrder.id,
            status: status || existingOrder.status,
            comment: comment || `Status updated to ${status || existingOrder.status}`,
            createdBy: session.name,
          },
        });
      }

      // 4. Update order
      return tx.order.update({
        where: { id: params.id },
        data: updateData,
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
          shipments: true,
        },
      });
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: session.userId,
        adminEmail: session.email,
        action: "ORDER_STATUS_UPDATED",
        entity: "Order",
        entityId: params.id,
        detailsJson: JSON.stringify({ status, trackingNumber, courierName }),
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error("Order update error:", err);
    return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 500 });
  }
}
