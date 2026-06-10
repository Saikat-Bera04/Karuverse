import ai from "../config/ai";

const MODEL = "gemini-2.0-flash";

export const generateProductDescription = async (input: {
  title: string;
  craftType: string;
  language?: string;
  district?: string;
}) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    config: {
      systemInstruction: "You write warm, trustworthy marketplace copy for handmade Indian artisan products. Keep it culturally respectful and concise."
    },
    contents: `Create a product description in ${input.language || "English"} for "${input.title}", craft type ${input.craftType}, district ${input.district || "unknown"}.`
  });
  return response.text ?? "";
};

export const generateStory = async (input: {
  title: string;
  artisanName?: string;
  craftType: string;
  village?: string;
  district?: string;
  language?: string;
}) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    config: {
      systemInstruction: "You create short cultural storytelling scripts for artisan products, suitable for a Hear the Story button."
    },
    contents: JSON.stringify(input)
  });
  return response.text ?? "";
};

export const translateText = async (text: string, language: string) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    config: {
      systemInstruction: "Translate faithfully while preserving artisan and craft context."
    },
    contents: `Translate to ${language}: ${text}`
  });
  return response.text ?? "";
};

export const suggestPrice = async (input: {
  materials: string[];
  hoursWorked: number;
  category: string;
  baseCurrency?: string;
}) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    config: {
      systemInstruction: "Suggest a fair artisan marketplace price. Return compact JSON with minPrice, maxPrice, recommendedPrice, currency, and reasoning.",
      responseMimeType: "application/json"
    },
    contents: JSON.stringify({ baseCurrency: "INR", ...input })
  });
  return response.text ?? "{}";
};
