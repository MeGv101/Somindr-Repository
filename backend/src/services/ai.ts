import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
import { pipeline } from "@huggingface/transformers";

let generator: Awaited<ReturnType<typeof pipeline>> | null = null;

async function getGenerator() {
  if (!generator) {
    console.log("Cargando modelo...");

    generator = await pipeline(
      "text-generation",
      "onnx-community/Phi-3.5-mini-instruct"
    );

    console.log("Modelo cargado.");
  }

  return generator;
}

export async function generateResponse(
  prompt: string
) {
  const model = await getGenerator();

  const output = await model(prompt, {
    max_new_tokens: 300,
    temperature: 0.7,
    do_sample: true,
  });

  return output[0].generated_text
    .replace(prompt, "")
    .trim();
}