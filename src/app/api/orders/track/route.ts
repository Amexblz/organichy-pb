import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || "").trim();

    if (!query) {
      return NextResponse.json({ error: "Order Number or Phone Number is required" }, { status: 400 });
    }

    const cleanPhone = query.replace(/\D/g, "").slice(-10);

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { equals: query } },
          ...(cleanPhone.length >= 8
            ? [
                { guestPhone: { contains: cleanPhone } },
                { user: { phone: { contains: cleanPhone } } },
              ]
            : []),
        ],
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // Sanitize orders for public tracking
    const sanitizedOrders = orders.map((o) => {
      let city = "";
      let state = "";
      try {
        const addr = JSON.parse(o.shippingAddressJson);
        city = addr.city || "";
        state = addr.state || "";
      } catch (e) {}

      return {
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        total: o.total,
        createdAt: o.createdAt,
        trackingNumber: o.trackingNumber,
        courierName: o.courierName,
        estimatedDelivery: o.estimatedDelivery,
        destination: city && state ? `${city}, ${state}` : city || state || "India",
        items: o.items.map((item) => ({
          name: item.productName,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          image: item.image,
          price: item.unitPrice,
        })),
        statusHistory: o.statusHistory.map((h) => ({
          status: h.status,
          comment: h.comment,
          createdAt: h.createdAt,
        })),
      };
    });

    return NextResponse.json({ orders: sanitizedOrders });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
