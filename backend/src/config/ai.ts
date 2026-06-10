import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
export const hasGeminiApiKey = Boolean(apiKey);

const ai = hasGeminiApiKey ? new GoogleGenerativeAI(apiKey) : null;

export default ai;
