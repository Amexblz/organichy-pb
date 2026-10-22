"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Printer, Truck, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrder = () => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) {
          setOrder(data.order);
          setStatus(data.order.status);
          setPaymentStatus(data.order.paymentStatus);
          setTrackingNumber(data.order.trackingNumber || "");
          setCourierName(data.order.courierName || "Delhivery Air Express");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
          courierName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Order fulfillment status updated successfully!");
        loadOrder();
      } else {
        setMessage(data.error || "Failed to update order.");
      }
    } catch (e) {
      setMessage("Error updating order.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !order) {
    return <div className="p-12 text-center text-xs text-stone-400">Loading order details...</div>;
  }

  const shippingAddr = JSON.parse(order.shippingAddressJson || "{}");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Print GST Invoice</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-700 print:hidden">
          {message}
        </div>
      )}

      {/* Printable Invoice & Order Details Box */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-stone-200 pb-6">
          <div>
            <span className="font-black text-2xl tracking-tighter text-stone-950">
              ORGANICHY<span className="text-amber-600">.</span>
            </span>
            <p className="text-[11px] text-stone-500 font-semibold mt-1">
              Dr Health Xpert Pvt Ltd • GSTIN: 07AAECD1234F1Z5
            </p>
            <p className="text-[11px] text-stone-500">
              Sector 62, Noida, Uttar Pradesh, 201309 | care@organichy.com
            </p>
          </div>

          <div className="text-right">
            <span className="bg-stone-900 text-amber-400 text-xs font-black px-2.5 py-1 rounded uppercase">
              TAX INVOICE
            </span>
            <p className="text-xs font-black text-stone-900 mt-2">{order.orderNumber}</p>
            <p className="text-[11px] text-stone-500">Date: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Customer & Shipping info */}
        <div className="grid grid-cols-2 gap-6 text-xs text-stone-700">
          <div>
            <h4 className="font-black text-stone-900 uppercase text-[11px] mb-1">
              Billed & Shipped To:
            </h4>
            <p className="font-extrabold text-stone-900">{shippingAddr.fullName}</p>
            <p>{shippingAddr.addressLine1}</p>
            {shippingAddr.addressLine2 && <p>{shippingAddr.addressLine2}</p>}
            <p>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.pincode}</p>
            <p className="mt-1 font-semibold text-stone-600">Phone: {shippingAddr.phone}</p>
            <p className="text-stone-600">Email: {shippingAddr.email || order.guestEmail}</p>
          </div>

          <div className="text-right">
            <h4 className="font-black text-stone-900 uppercase text-[11px] mb-1">
              Payment & Fulfillment:
            </h4>
            <p>Method: <strong>{order.paymentMethod}</strong></p>
            <p>Payment Status: <strong>{order.paymentStatus}</strong></p>
            <p>Fulfillment: <strong>{order.status}</strong></p>
            {order.trackingNumber && (
              <p className="mt-1 text-amber-800 font-bold">
                Courier: {order.courierName} (AWB: {order.trackingNumber})
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-xs border-y border-stone-200">
          <thead>
            <tr className="bg-stone-50 font-black uppercase text-stone-600">
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3">Rate</th>
              <th className="py-2.5 px-3 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {order.items.map((item: any) => (
              <tr key={item.id}>
                <td className="py-3 px-3">
                  <p className="font-bold text-stone-900">{item.productName}</p>
                  <p className="text-[11px] text-amber-800 font-semibold">{item.variantLabel}</p>
                </td>
                <td className="py-3 px-3">{formatINR(item.unitPrice)}</td>
                <td className="py-3 px-3 text-center">{item.quantity}</td>
                <td className="py-3 px-3 text-right font-black">{formatINR(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Summary */}
        <div className="flex justify-end text-xs">
          <div className="w-64 space-y-1.5 text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-stone-900">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-bold text-stone-900">{order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-950 pt-2 border-t border-stone-200">
              <span>Total Amount:</span>
              <span className="text-amber-800">{formatINR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action: Update Fulfillment Status (hidden on print) */}
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 print:hidden">
        <h3 className="font-black text-xs uppercase text-stone-900 tracking-wider">
          Update Order Fulfillment & Logistics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Fulfillment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-bold"
            >
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PACKED">PACKED</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED (Restores Stock)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-bold"
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="REFUNDED">REFUNDED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Courier Partner</label>
            <input
              type="text"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              placeholder="e.g. Delhivery Air Express"
              className="w-full px-3 py-2 border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tracking Number (AWB)</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. DEL-89421894"
              className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-colors shadow-md disabled:opacity-50"
        >
          {updating ? "Saving Changes..." : "Update Order & Notify"}
        </button>
      </form>
    </div>
  );
}
