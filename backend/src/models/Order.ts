import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "celo"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    deliveryStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
      default: "placed"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    celoTxHash: String,
    buyerWallet: { type: String, lowercase: true, trim: true },
    receiverWallet: { type: String, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
