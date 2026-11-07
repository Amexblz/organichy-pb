import Razorpay from "razorpay";
import crypto from "crypto";

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

/**
 * Initialize Razorpay instance on the server.
 * Never import or use this on the client side.
 */
export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Verifies Razorpay payment signature using HMAC-SHA256.
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  if (!RAZORPAY_KEY_SECRET) {
    console.error("RAZORPAY_KEY_SECRET is not configured");
    return false;
  }

  try {
    const generatedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const bufExpected = Buffer.from(generatedSignature, "utf8");
    const bufActual = Buffer.from(signature, "utf8");

    if (bufExpected.length !== bufActual.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufExpected, bufActual);
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export function generateDummyRazorpaySignature(
  orderId: string,
  paymentId: string
): string {
  return crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
}

// Backwards-compatible aliases
export const verifyDummyRazorpaySignature = verifyRazorpaySignature;
export const DUMMY_RAZORPAY_KEY_ID = RAZORPAY_KEY_ID;
export const DUMMY_RAZORPAY_KEY_SECRET = RAZORPAY_KEY_SECRET;
