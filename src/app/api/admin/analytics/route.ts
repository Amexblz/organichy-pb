import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Core counters
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const totalProducts = await prisma.product.count();

  // 2. Sales sum
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
    },
  });

  const totalSales = orders.reduce((sum, o) => (o.status !== "CANCELLED" ? sum + o.total : sum), 0);

  // 3. Status breakdown
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;

  // 4. Low stock count
  const lowStockCount = await prisma.productVariant.count({
    where: { stock: { lte: 15 } },
  });

  // 5. Recent 7 days sales trend
  const now = new Date();
  const salesByDay: Record<string, { date: string; sales: number; orders: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split("T")[0];
    salesByDay[key] = {
      date: new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(d),
      sales: 0,
      orders: 0,
    };
  }

  orders.forEach((o) => {
    const dateKey = o.createdAt.toISOString().split("T")[0];
    if (salesByDay[dateKey] && o.status !== "CANCELLED") {
      salesByDay[dateKey].sales += o.total;
      salesByDay[dateKey].orders += 1;
    }
  });

  const chartData = Object.values(salesByDay);

  // 6. Top Selling Products
  const orderItems = await prisma.orderItem.groupBy({
    by: ["productId", "productName"],
    _sum: {
      quantity: true,
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  // 7. Recent 5 orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({
    metrics: {
      totalSales: Math.round(totalSales * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockCount,
    },
    chartData,
    topProducts: orderItems.map((item) => ({
      name: item.productName,
      unitsSold: item._sum.quantity || 0,
      revenue: item._sum.totalPrice || 0,
    })),
    recentOrders,
  });
}
