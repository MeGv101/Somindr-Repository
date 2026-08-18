import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,

    baseURL:
        "https://api.groq.com/openai/v1",
});
export async function generateResponse(
    prompt: string
) {
    try {
        const completion =
            await client.chat.completions.create({
                model:
                    "groq/compound",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
        return (
            completion.choices[0]
            .message.content ?? ""
        );
    } catch (error) {
        console.error(error);
        return "Lo siento, en este momento no puedo responder. Intenta nuevamente en unos segundos.";
    }
}