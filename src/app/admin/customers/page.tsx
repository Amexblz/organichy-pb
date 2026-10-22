"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/customers?search=${encodeURIComponent(search)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.customers) setCustomers(data.customers);
      })
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">
            CUSTOMER DIRECTORY
          </h1>
          <p className="text-xs text-stone-500">View registered fitness athletes, order volume, and spending</p>
        </div>
        <span className="text-xs font-bold text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-full">
          {customers.length} Registered Customers
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, or phone..."
          className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-amber-500 shadow-sm"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-black tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Total Orders</th>
              <th className="py-3.5 px-4">Lifetime Spend</th>
              <th className="py-3.5 px-4">Saved Addresses</th>
              <th className="py-3.5 px-4">Joined On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-400">Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-400">No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-stone-900">{c.name}</p>
                        {c.isEmailVerified && (
                          <span className="text-[10px] text-green-700 font-bold">✓ Verified</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-stone-900 font-semibold">{c.email}</p>
                    <p className="text-stone-400 text-[11px]">{c.phone || "No phone added"}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="bg-stone-100 text-stone-800 font-bold px-2.5 py-1 rounded text-[11px]">
                      {c._count?.orders || 0} order(s)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-black text-stone-950">
                    {formatINR(c.profile?.totalSpend || 0)}
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    {c.addresses?.length || 0} address(es)
                  </td>

                  <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
