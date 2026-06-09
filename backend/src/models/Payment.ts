import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    provider: {
      type: String,
      enum: ["razorpay", "celo"],
      default: "razorpay"
    },
    providerOrderId: String,
    providerPaymentId: String,
    txHash: String,
    payerWallet: { type: String, lowercase: true, trim: true },
    receiverWallet: { type: String, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["created", "verified", "failed", "pending"],
      default: "created"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
