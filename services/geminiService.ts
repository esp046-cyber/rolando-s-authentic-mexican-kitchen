import { GoogleGenAI } from "@google/genai";
import { Recipe } from "../types";

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!ai) {
    try {
      // In Vite, process.env.API_KEY is replaced by the string value during build.
      // We check if it exists directly.
      if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      } else {
        console.warn("Chef Rolando's Kitchen: API_KEY is missing.");
      }
    } catch (e) {
      console.error("Error initializing AI client:", e);
    }
  }
  return ai;
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Visual Search / Token-Optimized Analysis
 * Analyzes an image and returns a search query or ingredients list.
 */
export const analyzeImageForSearch = async (base64Image: string): Promise<string> => {
  const client = getAiClient();
  if (!client) return "Mole"; // Fallback

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/webp', data: base64Image } },
          { text: "Identify this Mexican dish or these ingredients. Return ONLY a comma-separated list of keywords for searching." }
        ]
      }
    });
    return response.text || "";
  } catch (e) {
    console.error("Visual search failed", e);
    return "";
  }
};

/**
 * Vibe Coding: Instruction-Based Recipe Editing
 * "Make it vegan", "Make it spicy", "I don't have cilantro"
 */
export const remixRecipeWithAI = async (originalRecipe: Recipe, instruction: string): Promise<Recipe> => {
  const client = getAiClient();
  if (!client) throw new Error("AI Client not ready");

  const prompt = `
    You are Chef Rolando. 
    Modify this recipe based strictly on this instruction: "${instruction}".
    
    Original Recipe JSON:
    ${JSON.stringify(originalRecipe)}

    Rules:
    1. Update title to reflect changes.
    2. Adjust ingredients, instructions, and nutrition.
    3. Update cookingTips.
    4. Keep the same structure.
    5. Return ONLY valid JSON.
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });

  if (!response.text) throw new Error("Failed to generate remix");

  const newRecipe = JSON.parse(response.text);
  
  // Regenerate image prompt based on new title
  const newImagePrompt = `professional food photography of ${newRecipe.title}, authentic mexican cuisine, michelin star plating, 8k resolution`;
  newRecipe.image = `https://image.pollinations.ai/prompt/${encodeURIComponent(newImagePrompt)}?width=800&height=600&nologo=true`;
  
  // Add AI Metadata (SynthID simulation)
  newRecipe.isAiGenerated = true;
  newRecipe.remixInstructions = instruction;
  newRecipe.id = `remix_${Date.now()}`;
  
  return newRecipe;
};

export const askChefRolando = async (message: string): Promise<string> => {
  try {
    const client = getAiClient();
    if (!client) return "Lo siento, I cannot connect right now.";

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are Chef Rolando, a Michelin-star Mexican chef. Concise, warm, Spanglish allowed.",
      }
    });
    
    return response.text || "Disculpe, I am busy cooking.";
  } catch (error) {
    return "Lo siento, connection error.";
  }
};