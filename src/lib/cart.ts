import { prisma } from "./prisma";

export interface CartCalculationResult {
  items: Array<{
    id: string;
    productId: string;
    variantId: string;
    name: string;
    variantLabel: string;
    image: string;
    unitPrice: number;
    mrp: number;
    quantity: number;
    totalPrice: number;
    stock: number;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  total: number;
  appliedCoupon: {
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null;
}

export async function calculateCartTotals(
  items: Array<{ variantId: string; quantity: number }>,
  couponCode?: string | null
): Promise<CartCalculationResult> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default-settings" },
  });

  const freeThreshold = settings?.freeShippingThreshold ?? 499;
  const standardShipping = settings?.standardShippingFee ?? 50;

  if (!items || items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      freeShippingThreshold: freeThreshold,
      amountNeededForFreeShipping: freeThreshold,
      total: 0,
      appliedCoupon: null,
    };
  }

  // Fetch variants from DB to prevent tampering
  const variantIds = items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  let subtotal = 0;
  const computedItems: CartCalculationResult["items"] = [];

  for (const item of items) {
    const v = variantMap.get(item.variantId);
    if (!v) continue;
    const qty = Math.max(1, Math.min(item.quantity, v.stock));
    const lineTotal = v.price * qty;
    subtotal += lineTotal;

    const primaryImage =
      v.product.images[0]?.url || "/images/products/organichy-jar.png";

    computedItems.push({
      id: v.id,
      productId: v.productId,
      variantId: v.id,
      name: v.product.name,
      variantLabel: `${v.weight}${v.flavor ? ` - ${v.flavor}` : ""}${v.texture ? ` (${v.texture})` : ""}`,
      image: primaryImage,
      unitPrice: v.price,
      mrp: v.mrp,
      quantity: qty,
      totalPrice: lineTotal,
      stock: v.stock,
    });
  }

  // Shipping calculation
  const shippingFee = subtotal >= freeThreshold ? 0 : standardShipping;
  const amountNeeded = Math.max(0, freeThreshold - subtotal);

  // Coupon calculation
  let discount = 0;
  let appliedCoupon: CartCalculationResult["appliedCoupon"] = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase().trim() },
    });

    if (coupon && coupon.isActive) {
      const now = new Date();
      const validStart = coupon.startDate <= now;
      const validEnd = !coupon.endDate || coupon.endDate >= now;
      const validMin = subtotal >= coupon.minOrderAmount;
      const validUsage = !coupon.usageLimit || coupon.usageCount < coupon.usageLimit;

      if (validStart && validEnd && validMin && validUsage) {
        if (coupon.discountType === "PERCENTAGE") {
          let calculated = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount && calculated > coupon.maxDiscountAmount) {
            calculated = coupon.maxDiscountAmount;
          }
          discount = Math.round(calculated * 100) / 100;
        } else {
          // FIXED
          discount = Math.min(coupon.discountValue, subtotal);
        }

        appliedCoupon = {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discountAmount: discount,
        };
      }
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: computedItems,
    subtotal,
    discount,
    shippingFee,
    freeShippingThreshold: freeThreshold,
    amountNeededForFreeShipping: amountNeeded,
    total: Math.round(grandTotal * 100) / 100,
    appliedCoupon,
  };
}
