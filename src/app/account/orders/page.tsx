import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { formatINR, formatDate } from "@/lib/utils";
import { Package, Truck, Printer, AlertCircle } from "lucide-react";

export const revalidate = 0;

export default async function CustomerOrdersPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
      shipments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-black text-stone-900 uppercase tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-stone-500">Track and manage your order history</p>
        </div>
        <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <Package className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-900">No orders yet</h3>
          <p className="text-xs text-stone-500">When you place an order, you can track its delivery here.</p>
          <Link
            href="/shop"
            className="inline-block bg-stone-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/30"
            >
              {/* Order Header bar */}
              <div className="bg-stone-100/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-200">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Order Number</span>
                    <span className="font-black text-stone-900">{order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Placed On</span>
                    <span className="font-bold text-stone-800">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Payment</span>
                    <span className="font-bold text-stone-800">{order.paymentMethod} ({order.paymentStatus})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-black text-sm text-stone-950">{formatINR(order.total)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-5 divide-y divide-stone-100 bg-white">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 bg-stone-50 rounded-lg border border-stone-200 shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          src={item.image || "/images/products/organichy-jar.png"}
                          alt={item.productName}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-amber-800 font-semibold">{item.variantLabel} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-xs sm:text-sm text-stone-900 shrink-0">
                      {formatINR(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Courier Tracking & Status Footer */}
              {order.trackingNumber && (
                <div className="bg-stone-50 p-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>
                      Courier: <strong>{order.courierName || "Express Logistics"}</strong> (AWB: <strong>{order.trackingNumber}</strong>)
                    </span>
                  </div>
                  <Link
                    href={`/track-order?orderId=${encodeURIComponent(order.orderNumber)}`}
                    className="font-bold text-amber-700 hover:underline"
                  >
                    Track Live Shipment →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
