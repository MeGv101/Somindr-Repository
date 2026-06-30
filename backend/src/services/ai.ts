import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateResponse(
  prompt: string
) {
  try {

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

    console.log(
      "GEMINI RAW RESPONSE:",
      JSON.stringify(response, null, 2)
    );

    console.log(
      "GEMINI TEXT:",
      response.text
    );

    return response.text ?? null;

  } catch (error) {

    console.error(
      "GEMINI ERROR:",
      error
    );

    throw error;
  }
}