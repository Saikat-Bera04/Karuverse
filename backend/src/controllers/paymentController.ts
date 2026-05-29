import Payment from "../models/Payment";
import { getRazorpay, verifyRazorpaySignature } from "../services/paymentService";
import { asyncHandler } from "../utils/asyncHandler";

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;
  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt: receipt || `karuverse_${Date.now()}`
  });

  const payment = await Payment.create({
    user: req.user?._id,
    amount,
    currency,
    providerOrderId: order.id,
    status: "created"
  });

  res.status(201).json({ success: true, order, payment });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const verified = verifyRazorpaySignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature
  });

  const payment = await Payment.findOneAndUpdate(
    { providerOrderId: razorpay_order_id },
    {
      providerPaymentId: razorpay_payment_id,
      status: verified ? "verified" : "failed"
    },
    { new: true }
  );

  res.json({ success: true, verified, payment });
});
