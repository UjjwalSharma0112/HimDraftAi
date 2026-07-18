import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client lazily to avoid throwing errors during boot if key is missing
let genAI: GoogleGenerativeAI | null = null;
const MODEL = "gemini-3.1-flash-lite";
const getGenAI = (): GoogleGenerativeAI => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not defined in the environment variables.",
    );
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export interface ClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  allowCustom: boolean;
}

export interface AnalysisResult {
  isVague: boolean;
  clarifications?: ClarificationQuestion[];
}

export interface GenerateInput {
  productName: string;
  ingredients: string[];
  weight: string;
  features: string[];
  tone: "premium" | "traditional" | "health";
}

/**
 * Analyzes the user's input to check if it's too vague.
 * If vague, it returns 2-3 specific clarification questions.
 */
export const analyzeProductInput = async (
  input: GenerateInput,
): Promise<AnalysisResult> => {
  const genAIClient = getGenAI();
  const model = genAIClient.getGenerativeModel({
    model: MODEL,
  });

  const prompt = `
You are an AI assistant designed to analyze product copy requests for traditional Himalayan food products (e.g. Shilajit, Honey, Millets, Herbs, Grains).
Analyze the following product details:
- Product Name: "${input.productName}"
- Category/Ingredients: ${JSON.stringify(input.ingredients)}
- Weight/Size: "${input.weight}"
- Selected Tone: "${input.tone}"
- Key Features: ${JSON.stringify(input.features)}

Determine if the provided details are too vague or generic to generate a high-quality, rich, and authentic narrative copy.
If the input is vague (e.g., just the name "Honey" or "Shilajit" with little to no specific details about its origin, harvesting method, or unique properties), you must flag it as vague and generate 2 to 3 clarifying questions.
Each question must have a unique 'id' (snake_case), a clear 'question' text, 3 to 4 specific multiple-choice options tailored to this specific product type, and 'allowCustom' set to true.

Respond ONLY with a valid JSON object matching this schema (do not include markdown wrapper tags or extra text):
{
  "isVague": boolean,
  "clarifications": [
    {
      "id": "question_id",
      "question": "Clarification question text?",
      "options": ["Option A", "Option B", "Option C"],
      "allowCustom": true
    }
  ]
}

Ensure the JSON is well-formatted. If the input has sufficient detail (e.g., custom features or a specific product name that is self-explanatory), return:
{
  "isVague": false
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText.trim()) as AnalysisResult;
    return parsed;
  } catch (error: any) {
    console.error("Error in analyzeProductInput service:", error);
    // If the API fails or JSON parsing fails, we default to not vague so we don't block the user
    return { isVague: false };
  }
};

/**
 * Generates the final product description copy.
 */
export const generateFinalProductCopy = async (
  input: GenerateInput,
  answers?: Record<string, string>,
): Promise<string> => {
  const genAIClient = getGenAI();
  const model = genAIClient.getGenerativeModel({ model: MODEL });

  let toneInstruction = "";
  if (input.tone === "premium") {
    toneInstruction =
      "Write in an elegant, luxurious, and premium storytelling tone. Emphasize purity, rarity, premium craftsmanship, high altitude, and sensory delight. Use sophisticated language suitable for high-end organic export products.";
  } else if (input.tone === "traditional") {
    toneInstruction =
      "Write in a traditional, heritage-rich, and culturally deep storytelling tone. Emphasize ancestral farming techniques, generational honey hunters/farmers, local Himalayan mountain cooperatives, and centuries-old methods. Use warm, authentic, and rustic imagery.";
  } else {
    // health
    toneInstruction =
      "Write in a health-focused, functional, and clean adaptogenic tone. Emphasize organic purity, high mineral density (like fulvic acid or natural antioxidants), physical vitality, wellness benefits, and absolute clean nutrition. Keep it informative yet highly inspiring.";
  }

  let answersText = "";
  if (answers && Object.keys(answers).length > 0) {
    answersText = Object.entries(answers)
      .map(([key, val]) => `- ${key.replace(/_/g, " ")}: ${val}`)
      .join("\n");
  }

  const prompt = `
You are an expert copywriter specializing in premium, authentic Himalayan organic food exports.
Write a compelling, engaging product description (around 100-150 words) for the following product:
- Product Name: "${input.productName}"
- Category/Ingredients: ${input.ingredients.join(", ")}
- Weight/Size: "${input.weight}"
- Tone: "${input.tone}"

Product Features:
${input.features.map((f) => `- ${f}`).join("\n")}

${answersText ? `Additional Clarifications Sourced from User:\n${answersText}` : ""}

Tone Guidelines:
${toneInstruction}

Formatting Instructions:
- Do not include any title headers (like "Product Description:"), quote marks, or placeholders.
- Focus on creating a single, rich, cohesive narrative paragraph or two short paragraphs.
- Highlight the unique high-altitude origin of the Himalayas.
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};
