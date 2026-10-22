"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Download, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    fetch(`/api/admin/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ["OrderNumber", "Customer", "Email", "Phone", "Status", "PaymentMethod", "PaymentStatus", "Total", "Date"];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.user?.name || o.guestEmail || 'Customer'}"`,
      o.guestEmail || o.user?.email || "",
      o.guestPhone || o.user?.phone || "",
      o.status,
      o.paymentMethod,
      o.paymentStatus,
      o.total,
      `"${new Date(o.createdAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `organichy-orders-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            ORDER MANAGEMENT
          </h1>
          <p className="text-xs text-stone-500">Track shipments, manage fulfillment, and view invoices</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4 text-stone-600" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, email, or AWB..."
            className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs font-bold bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 text-stone-800"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      {o.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-stone-900">{o.user?.name || o.guestEmail || "Guest"}</p>
                      <p className="text-[11px] text-stone-400">{o.guestPhone || o.user?.phone || ""}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-700">
                        {o.items?.length || 0} product(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-stone-950">
                      {formatINR(o.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          o.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          o.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : o.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                      {formatDate(o.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 bg-stone-900 hover:bg-amber-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
