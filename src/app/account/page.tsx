import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { formatINR, formatDate } from "@/lib/utils";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function AccountOverviewPage() {
  const session = await getCustomerSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      orders: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      addresses: {
        take: 2,
        orderBy: { isDefault: "desc" },
      },
      profile: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
          <p className="text-xs font-bold text-stone-500 uppercase">Total Orders</p>
          <p className="text-2xl font-black text-stone-900 mt-1">{user.profile?.ordersCount || user.orders.length}</p>
        </div>
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
          <p className="text-xs font-bold text-stone-500 uppercase">Total Spent</p>
          <p className="text-2xl font-black text-amber-800 mt-1">{formatINR(user.profile?.totalSpend || 0)}</p>
        </div>
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
          <p className="text-xs font-bold text-stone-500 uppercase">Saved Addresses</p>
          <p className="text-2xl font-black text-stone-900 mt-1">{user.addresses.length}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-stone-900 uppercase tracking-tight">
            Recent Orders
          </h2>
          <Link href="/account/orders" className="text-xs font-bold text-amber-700 hover:underline">
            View All Orders →
          </Link>
        </div>

        {user.orders.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
            You haven&apos;t placed any orders yet. Ready to fuel up?
            <div className="mt-3">
              <Link
                href="/shop"
                className="inline-block bg-stone-900 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-amber-300 transition-colors bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-stone-900">{order.orderNumber}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
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
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Placed on {formatDate(order.createdAt)} • {order.items.length} item(s)
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-black text-sm text-stone-950">{formatINR(order.total)}</span>
                  <Link
                    href={`/account/orders?id=${order.id}`}
                    className="text-xs font-bold text-stone-900 hover:text-amber-700 uppercase flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Address Section */}
      <div className="pt-4 border-t border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-stone-900 uppercase tracking-tight">
            Saved Delivery Address
          </h2>
          <Link href="/account/addresses" className="text-xs font-bold text-amber-700 hover:underline">
            Manage Addresses →
          </Link>
        </div>

        {user.addresses.length === 0 ? (
          <p className="text-xs text-stone-500 italic">No address saved yet.</p>
        ) : (
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed max-w-md">
            <p className="font-extrabold text-stone-900">{user.addresses[0].fullName}</p>
            <p>{user.addresses[0].addressLine1}, {user.addresses[0].addressLine2}</p>
            <p>{user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].pincode}</p>
            <p className="text-stone-500 mt-1">Phone: {user.addresses[0].phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
