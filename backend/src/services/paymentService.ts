import crypto from "crypto";
import { ethers } from "ethers";
import Razorpay from "razorpay";
import { provider } from "../config/celo";

export const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export const verifyRazorpaySignature = (input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
  const digest = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return digest === input.razorpaySignature;
};

export const verifyCeloNativePayment = async (input: {
  txHash: string;
  expectedTo: string;
  expectedAmountCelo: number;
}) => {
  const receipt = await provider.getTransactionReceipt(input.txHash);
  if (!receipt || receipt.status !== 1) {
    return { verified: false, reason: "Transaction is not confirmed" };
  }

  const tx = await provider.getTransaction(input.txHash);
  if (!tx) {
    return { verified: false, reason: "Transaction not found" };
  }

  const expectedWei = ethers.parseEther(String(input.expectedAmountCelo));
  const verified =
    tx.to?.toLowerCase() === input.expectedTo.toLowerCase() && tx.value >= expectedWei;

  return {
    verified,
    reason: verified ? undefined : "Receiver or amount did not match",
    from: tx.from,
    to: tx.to,
    valueCelo: ethers.formatEther(tx.value),
    blockNumber: receipt.blockNumber
  };
};
