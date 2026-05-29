import openai from "../config/ai";

const model = "gpt-4.1-mini";

const getText = (response: { choices: Array<{ message?: { content?: string | null } }> }) =>
  response.choices[0]?.message?.content?.trim() || "";

export const generateProductDescription = async (input: {
  title: string;
  craftType: string;
  language?: string;
  district?: string;
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You write warm, trustworthy marketplace copy for handmade Indian artisan products. Keep it culturally respectful and concise."
      },
      {
        role: "user",
        content: `Create a product description in ${input.language || "English"} for "${input.title}", craft type ${input.craftType}, district ${input.district || "unknown"}.`
      }
    ]
  });

  return getText(response);
};

export const generateStory = async (input: {
  title: string;
  artisanName?: string;
  craftType: string;
  village?: string;
  district?: string;
  language?: string;
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You create short cultural storytelling scripts for artisan products, suitable for a Hear the Story button."
      },
      {
        role: "user",
        content: JSON.stringify(input)
      }
    ]
  });

  return getText(response);
};

export const translateText = async (text: string, language: string) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Translate faithfully while preserving artisan and craft context." },
      { role: "user", content: `Translate to ${language}: ${text}` }
    ]
  });

  return getText(response);
};

export const suggestPrice = async (input: {
  materials: string[];
  hoursWorked: number;
  category: string;
  baseCurrency?: string;
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "Suggest a fair artisan marketplace price. Return compact JSON with minPrice, maxPrice, recommendedPrice, currency, and reasoning."
      },
      { role: "user", content: JSON.stringify({ baseCurrency: "INR", ...input }) }
    ],
    response_format: { type: "json_object" }
  });

  return getText(response);
};
