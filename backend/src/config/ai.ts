import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
export const hasGeminiApiKey = Boolean(apiKey);

const ai = hasGeminiApiKey ? new GoogleGenAI({ apiKey }) : null;

export default ai;
