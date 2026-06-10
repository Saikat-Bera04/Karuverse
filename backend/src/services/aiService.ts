import ai, { GEMINI_MODEL } from "../config/ai";
import { ApiError } from "../utils/apiError";

let geminiCooldownUntil = 0;

const parseRetryDelaySeconds = (value?: string) => {
  if (!value) return undefined;
  const seconds = Number(value.replace("s", ""));
  return Number.isFinite(seconds) ? Math.ceil(seconds) : undefined;
};

const extractGeminiError = (error: unknown) => {
  const fallbackMessage = error instanceof Error ? error.message : String(error);

  try {
    const parsed = JSON.parse(fallbackMessage);
    return parsed.error || parsed;
  } catch {
    return {
      code: (error as { code?: number })?.code,
      status: (error as { status?: string })?.status,
      message: fallbackMessage
    };
  }
};

const normalizeGeminiError = (error: unknown) => {
  const geminiError = extractGeminiError(error);
  const retryInfo = geminiError.details?.find((detail: { "@type"?: string }) =>
    detail["@type"]?.includes("RetryInfo")
  );
  const retryAfterSeconds = parseRetryDelaySeconds(retryInfo?.retryDelay);

  if (geminiError.code === 429 || geminiError.status === "RESOURCE_EXHAUSTED") {
    geminiCooldownUntil = Date.now() + (retryAfterSeconds || 60) * 1000;
    const retryMessage = retryAfterSeconds ? ` Retry in about ${retryAfterSeconds}s.` : "";
    return new ApiError(
      429,
      `Gemini quota or rate limit reached for ${GEMINI_MODEL}.${retryMessage} Check GEMINI_API_KEY billing/quota or switch GEMINI_MODEL.`
    );
  }

  if (geminiError.code === 400 || geminiError.status === "INVALID_ARGUMENT") {
    return new ApiError(400, `Gemini request failed: ${geminiError.message || "Invalid request"}`);
  }

  if (geminiError.code === 401 || geminiError.code === 403) {
    return new ApiError(503, "Gemini API key is invalid or not authorized for this model.");
  }

  return new ApiError(503, `Gemini service unavailable: ${geminiError.message || "Unknown error"}`);
};

const runGeminiRequest = async <T>(request: () => Promise<T>) => {
  if (!ai) {
    throw new ApiError(503, "GEMINI_API_KEY is not configured on the backend.");
  }

  if (Date.now() < geminiCooldownUntil) {
    const waitSeconds = Math.ceil((geminiCooldownUntil - Date.now()) / 1000);
    throw new ApiError(429, `Gemini is cooling down after a quota response. Retry in about ${waitSeconds}s.`);
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
  responseMimeType?: string;
}) => {
  const response = await runGeminiRequest(() =>
    ai!.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: input.systemInstruction,
        ...(input.responseMimeType ? { responseMimeType: input.responseMimeType } : {})
      },
      contents: input.contents
    })
  );

  return response.text?.trim() || "";
};

export const generateProductDescription = async (input: {
  title: string;
  craftType: string;
  language?: string;
  district?: string;
}) => {
  return generateText({
    systemInstruction:
      "You write warm, trustworthy marketplace copy for handmade Indian artisan products. Keep it culturally respectful and concise.",
    contents: `Create a product description in ${input.language || "English"} for "${input.title}", craft type ${input.craftType}, district ${input.district || "unknown"}.`
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
      "You create short cultural storytelling scripts for artisan products, suitable for a Hear the Story button.",
    contents: JSON.stringify(input)
  });
};

export const translateText = async (text: string, language: string) => {
  return generateText({
    systemInstruction: "Translate faithfully while preserving artisan and craft context.",
    contents: `Translate to ${language}: ${text}`
  });
};

export const suggestPrice = async (input: {
  materials: string[];
  hoursWorked: number;
  category: string;
  baseCurrency?: string;
}) => {
  return generateText({
    systemInstruction:
      "Suggest a fair artisan marketplace price. Return compact JSON with minPrice, maxPrice, recommendedPrice, currency, and reasoning.",
    responseMimeType: "application/json",
    contents: JSON.stringify({ baseCurrency: "INR", ...input })
  });
};
