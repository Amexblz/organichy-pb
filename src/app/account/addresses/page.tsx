"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Check } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi NCR",
    pincode: "",
    isDefault: true,
  });

  const loadAddresses = () => {
    fetch("/api/account/addresses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.addresses) setAddresses(data.addresses);
      });
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      if (res.ok) {
        setShowAddForm(false);
        loadAddresses();
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "Delhi NCR",
          pincode: "",
          isDefault: false,
        });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
    loadAddresses();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-xl font-black text-stone-900 uppercase tracking-tight">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-stone-500">Manage your shipping destinations</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add Address Form Modal / Box */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-extrabold text-sm text-stone-900 uppercase">New Address Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Address Line 1 *</label>
              <input
                type="text"
                required
                placeholder="Flat / House no / Building"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                placeholder="Area / Sector / Street"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                required
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-stone-900 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-500 font-bold text-xs px-4 py-2 hover:text-stone-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 relative flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm text-stone-900">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-xs text-stone-500 mt-2 font-medium">📞 {addr.phone}</p>
            </div>

            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-stone-400 uppercase">{addr.addressType}</span>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
