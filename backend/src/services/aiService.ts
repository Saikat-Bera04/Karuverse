import genAI from "../config/ai";

export const generateProductDescription = async (input: {
  title: string;
  craftType: string;
  language?: string;
  district?: string;
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You write warm, trustworthy marketplace copy for handmade Indian artisan products. Keep it culturally respectful and concise."
  });

  const result = await model.generateContent(
    `Create a product description in ${input.language || "English"} for "${input.title}", craft type ${input.craftType}, district ${input.district || "unknown"}.`
  );
  return result.response.text().trim();
};

export const generateStory = async (input: {
  title: string;
  artisanName?: string;
  craftType: string;
  village?: string;
  district?: string;
  language?: string;
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You create short cultural storytelling scripts for artisan products, suitable for a Hear the Story button."
  });

  const result = await model.generateContent(JSON.stringify(input));
  return result.response.text().trim();
};

export const translateText = async (text: string, language: string) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Translate faithfully while preserving artisan and craft context."
  });

  const result = await model.generateContent(`Translate to ${language}: ${text}`);
  return result.response.text().trim();
};

export const suggestPrice = async (input: {
  materials: string[];
  hoursWorked: number;
  category: string;
  baseCurrency?: string;
}) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Suggest a fair artisan marketplace price. Return compact JSON with minPrice, maxPrice, recommendedPrice, currency, and reasoning."
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: JSON.stringify({ baseCurrency: "INR", ...input }) }] }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  return result.response.text().trim();
};
