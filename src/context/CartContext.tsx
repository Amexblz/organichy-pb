"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItemType {
  variantId: string;
  productId: string;
  quantity: number;
  name: string;
  variantLabel: string;
  price: number;
  mrp: number;
  image: string;
  stock: number;
}

export interface SiteSettingsType {
  id?: string;
  siteName: string;
  logoUrl: string;
  announcementText: string;
  announcementActive: boolean;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  enableCod: boolean;
  enableRazorpay: boolean;
  currencySymbol: string;
}

interface CartContextType {
  items: CartItemType[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItemType, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: {
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  siteSettings: SiteSettingsType;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettingsType = {
  siteName: "Organichy Peanut Butter",
  logoUrl: "/images/branding/logo.png",
  announcementText: "🔥 EXTRA 15% OFF ON ORDERS ABOVE ₹799! CODE: ORGANIC15 | FREE EXPRESS SHIPPING ABOVE ₹499",
  announcementActive: true,
  contactEmail: "care@organichy.com",
  contactPhone: "+91 98765 43210",
  contactAddress: "Dr Health Xpert Pvt Ltd, Industrial Area, Sector 62, Noida, Uttar Pradesh 201309",
  freeShippingThreshold: 499,
  standardShippingFee: 50,
  enableCod: true,
  enableRazorpay: true,
  currencySymbol: "₹",
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CartContextType["appliedCoupon"]>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsType>(defaultSettings);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const fetchLiveSettings = async () => {
    try {
      const res = await fetch("/api/settings?t=" + Date.now(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }
    } catch (e) {
      // Fallback stays in place
    }
  };

  // Load from local storage and fetch fresh site settings
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("organichy_cart");
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("organichy_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem("organichy_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error("Failed to load local cart state", e);
    }
    setMounted(true);
    fetchLiveSettings();

    // Listen to custom settings-updated event (fired by admin settings form)
    const handleSettingsUpdated = () => {
      fetchLiveSettings();
    };
    window.addEventListener("organichy:settings-updated", handleSettingsUpdated);
    return () => window.removeEventListener("organichy:settings-updated", handleSettingsUpdated);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("organichy_cart", JSON.stringify(items));
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("organichy_wishlist", JSON.stringify(wishlist));
  }, [wishlist, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (appliedCoupon) {
      localStorage.setItem("organichy_coupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("organichy_coupon");
    }
  }, [appliedCoupon, mounted]);

  const addItem = (item: Omit<CartItemType, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, item.stock);
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  // Recalculate discount based on applied coupon
  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const freeShippingThreshold = siteSettings.freeShippingThreshold || 499;
  const standardShippingFee = siteSettings.standardShippingFee !== undefined ? siteSettings.standardShippingFee : 50;

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : standardShippingFee;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      return { success: false, message: "Please enter a coupon code." };
    }

    try {
      const res = await fetch("/api/cart/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode, subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Failed to apply coupon." };
      }

      setAppliedCoupon(data.coupon);
      setCouponCode(cleanCode);
      return { success: true, message: `Coupon ${cleanCode} applied successfully!` };
    } catch (err) {
      return { success: false, message: "Error applying coupon. Please try again." };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        total,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        wishlist,
        toggleWishlist,
        isInWishlist,
        siteSettings,
        refreshSettings: fetchLiveSettings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
