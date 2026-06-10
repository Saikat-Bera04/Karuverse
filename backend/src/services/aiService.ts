import ai, { GEMINI_MODEL } from "../config/ai";
import { ApiError } from "../utils/apiError";

const normalizeGeminiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes("429") || message.includes("rate_limit")) {
    return new ApiError(429, `Gemini API rate limited. Please retry in a moment.`);
  }
  
  if (message.includes("503") || message.includes("overloaded")) {
    return new ApiError(503, `Gemini service is overloaded. Please retry in a moment.`);
  }
  
  if (message.includes("401") || message.includes("authentication")) {
    return new ApiError(503, "Gemini API key is invalid or not authorized.");
  }
  
  return new ApiError(503, `Gemini service error: ${message}`);
};

const runGeminiRequest = async <T>(request: () => Promise<T>) => {
  if (!ai) {
    throw new ApiError(503, "GEMINI_API_KEY is not configured on the backend.");
  }

  try {
    return await request();
  } catch (error) {
    throw normalizeGeminiError(error);
  }
};

const generateText = async (input: {
  contents: string;
  systemInstruction: string;
  maxTokens?: number;
}) => {
  const response = await runGeminiRequest(async () => {
    const model = ai!.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: input.systemInstruction
    });
    
    return model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: input.contents }]
        }
      ],
      generationConfig: {
        maxOutputTokens: input.maxTokens || 1024,
        temperature: 0.7
      }
    });
  });

  return response.response.text()?.trim() || "";
};

export const generateProductDescription = async (input: {
  title: string;
  craftType: string;
  language?: string;
  district?: string;
}) => {
  return generateText({
    systemInstruction:
      "You write warm, trustworthy marketplace copy for handmade Indian artisan products. Keep it culturally respectful and very concise (2-3 sentences max).",
    contents: `Create a brief product description (2-3 sentences) in ${input.language || "English"} for "${input.title}", craft type ${input.craftType}, district ${input.district || "unknown"}.`,
    maxTokens: 300
  });
};

export const generateStory = async (input: {
  title: string;
  artisanName?: string;
  craftType: string;
  village?: string;
  district?: string;
  language?: string;
}) => {
  return generateText({
    systemInstruction:
      "You create very short cultural storytelling snippets (max 3 sentences) for artisan products. Be concise and memorable.",
    contents: `Create a brief story (3 sentences max) for this artisan product: ${JSON.stringify(input)}`,
    maxTokens: 300
  });
};

export const translateText = async (text: string, language: string) => {
  return generateText({
    systemInstruction: "Translate faithfully while preserving artisan and craft context. Keep translation concise.",
    contents: `Translate to ${language}: ${text}`,
    maxTokens: 500
  });
};

export const suggestPrice = async (input: {
  materials: string[];
  hoursWorked: number;
  category: string;
  baseCurrency?: string;
}) => {
  const response = await generateText({
    systemInstruction:
      "Suggest a fair artisan marketplace price. Return ONLY valid JSON (no markdown) with minPrice, maxPrice, recommendedPrice, currency, and reasoning (1-2 sentences max).",
    contents: `Analyze and suggest prices for this artisan product: ${JSON.stringify({ baseCurrency: "INR", ...input })}. Return only valid JSON with no markdown formatting.`,
    maxTokens: 400
  });
  
  // Clean JSON response (remove markdown formatting if present)
  return response.replace(/```json\n?|```\n?/g, "").replace(/```\n?/g, "");
};
