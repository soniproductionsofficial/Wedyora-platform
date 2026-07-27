import Razorpay from "razorpay";

// Server-side only. Never import this from a Client Component — it reads
// RAZORPAY_KEY_SECRET, which must never reach the browser.
export function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}
