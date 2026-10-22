import crypto from "crypto";

export const DUMMY_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TqvEEanuQFa49Y";
export const DUMMY_RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "test_secret_OrganichyPeanutKey";

export interface DummyRazorpayOrder {
  id: string;
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
  key: string;
}

/**
 * Generate a realistic dummy Razorpay Order object
 */
export function createDummyRazorpayOrder(amountInRupees: number, receipt: string): DummyRazorpayOrder {
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const orderId = `order_dummy_${Date.now()}_${randomSuffix}`;
  const amountInPaise = Math.round(amountInRupees * 100);

  return {
    id: orderId,
    entity: "order",
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: "INR",
    receipt,
    status: "created",
    attempts: 0,
    created_at: Math.floor(Date.now() / 1000),
    key: DUMMY_RAZORPAY_KEY_ID,
  };
}

/**
 * Generate a valid dummy Razorpay payment signature
 */
export function generateDummyRazorpaySignature(razorpayOrderId: string, razorpayPaymentId: string): string {
  return crypto
    .createHmac("sha256", DUMMY_RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
}

/**
 * Verify a Razorpay payment signature
 */
export function verifyDummyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  try {
    const expectedSignature = generateDummyRazorpaySignature(razorpayOrderId, razorpayPaymentId);
    const bufExpected = Buffer.from(expectedSignature, "utf8");
    const bufActual = Buffer.from(razorpaySignature, "utf8");

    if (bufExpected.length !== bufActual.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufExpected, bufActual);
  } catch (error) {
    return false;
  }
}
