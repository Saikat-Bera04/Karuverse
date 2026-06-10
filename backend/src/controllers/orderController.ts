import Order from "../models/Order";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const orders = await Order.find({ buyer: req.user._id })
    .populate("product")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(401, "Authentication required");

  const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id }).populate("product");
  if (!order) throw new ApiError(404, "Order not found");

  res.json({ success: true, order });
});
