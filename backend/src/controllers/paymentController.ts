import Order from "../models/Order";
import Payment from "../models/Payment";
import Product from "../models/Product";
import {
  getRazorpay,
  verifyCeloNativePayment,
  verifyRazorpaySignature
} from "../services/paymentService";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const createPaymentOrder = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const { amount, currency = "INR", receipt, productId } = req.body;
  const product = productId ? await Product.findById(productId) : null;
  const payableAmount = product ? product.price : Number(amount);

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: Math.round(Number(payableAmount) * 100),
    currency,
    receipt: receipt || `karuverse_${Date.now()}`
  });

  const marketplaceOrder = product
    ? await Order.create({
        buyer: req.user._id,
        product: product._id,
        amount: payableAmount,
        currency,
        paymentMethod: "razorpay",
        razorpayOrderId: order.id
      })
    : undefined;

  const payment = await Payment.create({
    user: req.user._id,
    order: marketplaceOrder?._id,
    product: product?._id,
    amount: payableAmount,
    currency,
    provider: "razorpay",
    providerOrderId: order.id,
    status: "created"
  });

  res.status(201).json({
    success: true,
    order,
    marketplaceOrder,
    payment,
    keyId: process.env.RAZORPAY_KEY_ID
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

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

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      paymentStatus: verified ? "paid" : "failed"
    },
    { new: true }
  );

  res.json({ success: true, verified, payment, order });
});

export const verifyCeloPayment = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const { productId, txHash, amountCelo, receiverWallet } = req.body;
  if (!productId || !txHash || !amountCelo) {
    throw new ApiError(400, "productId, txHash, and amountCelo are required");
  }

  const product = await Product.findById(productId).populate("artisan", "walletAddress");
  if (!product) throw new ApiError(404, "Product not found");

  const artisan = product.artisan as unknown as { walletAddress?: string };
  const expectedReceiver =
    artisan.walletAddress || receiverWallet || process.env.CELO_TREASURY_WALLET;

  if (!expectedReceiver) {
    throw new ApiError(400, "No artisan or treasury wallet is configured for Celo payment");
  }

  const result =
    process.env.CELO_VERIFY_PAYMENTS === "false"
      ? {
          verified: true,
          reason: undefined,
          from: req.body.payerWallet,
          to: expectedReceiver,
          valueCelo: amountCelo
        }
      : await verifyCeloNativePayment({
          txHash,
          expectedTo: expectedReceiver,
          expectedAmountCelo: Number(amountCelo)
        });

  const order = await Order.create({
    buyer: req.user._id,
    product: product._id,
    amount: Number(amountCelo),
    currency: "CELO",
    paymentMethod: "celo",
    paymentStatus: result.verified ? "paid" : "failed",
    celoTxHash: txHash,
    buyerWallet: result.from,
    receiverWallet: expectedReceiver
  });

  const payment = await Payment.create({
    user: req.user._id,
    order: order._id,
    product: product._id,
    amount: Number(amountCelo),
    currency: "CELO",
    provider: "celo",
    txHash,
    payerWallet: result.from,
    receiverWallet: expectedReceiver,
    status: result.verified ? "verified" : "failed"
  });

  res.status(result.verified ? 201 : 400).json({
    success: result.verified,
    verified: result.verified,
    reason: result.reason,
    payment,
    order,
    chainResult: result
  });
});
