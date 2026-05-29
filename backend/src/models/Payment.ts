import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    provider: { type: String, default: "razorpay" },
    providerOrderId: String,
    providerPaymentId: String,
    status: {
      type: String,
      enum: ["created", "verified", "failed"],
      default: "created"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
