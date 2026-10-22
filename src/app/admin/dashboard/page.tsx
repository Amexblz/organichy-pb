"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatINR, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) setData(resData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900" />
      </div>
    );
  }

  const { metrics, chartData, topProducts, recentOrders } = data || {};

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
          OPERATIONS OVERVIEW
        </h1>
        <p className="text-xs text-stone-500">Live e-commerce metrics and performance data</p>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <div className="p-2 rounded-lg bg-green-50 text-green-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900">{formatINR(metrics?.totalSales || 0)}</p>
          <p className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Direct to Consumer
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Orders</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900">{metrics?.totalOrders || 0}</p>
          <p className="text-[11px] text-stone-500 font-medium">
            {metrics?.pendingOrders || 0} requiring action
          </p>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Total Customers</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900">{metrics?.totalCustomers || 0}</p>
          <p className="text-[11px] text-stone-500 font-medium">Registered fitness users</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase">
            <span>Low Stock Items</span>
            <div className={`p-2 rounded-lg ${metrics?.lowStockCount > 0 ? "bg-red-50 text-red-600" : "bg-stone-100 text-stone-500"}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900">{metrics?.lowStockCount || 0}</p>
          <Link href="/admin/inventory" className="text-[11px] text-amber-700 hover:underline font-bold block">
            Inspect inventory →
          </Link>
        </div>
      </div>

      {/* Order Status Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-stone-200 text-xs">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50 text-amber-900 font-bold">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Pending: {metrics?.pendingOrders || 0}</span>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50 text-blue-900 font-bold">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Shipped: {metrics?.shippedOrders || 0}</span>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-green-50 text-green-900 font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Delivered: {metrics?.deliveredOrders || 0}</span>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-red-50 text-red-900 font-bold">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Cancelled: {metrics?.cancelledOrders || 0}</span>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider">
            7-Day Sales Trend (₹)
          </h2>
          <span className="text-xs text-stone-400 font-semibold">Updated live from orders</span>
        </div>

        <div className="h-64 w-full">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}`, "Sales"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-stone-400">
              No sales data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* 2 Column: Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider">
            Top Selling Products
          </h2>
          <div className="divide-y divide-stone-100">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-extrabold text-stone-900 truncate">{p.name}</p>
                    <p className="text-stone-500">{p.unitsSold} units fulfilled</p>
                  </div>
                  <span className="font-black text-stone-950 shrink-0">{formatINR(p.revenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 italic">No product sales yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-sm uppercase text-stone-900 tracking-wider">
              Recent Customer Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-amber-700 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900">{ord.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ord.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : ord.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      {ord.user?.name || ord.guestEmail || "Guest"} • {formatDate(ord.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-stone-900">{formatINR(ord.total)}</span>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="text-stone-400 hover:text-stone-900 p-1"
                      title="Manage Order"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-4 italic">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
