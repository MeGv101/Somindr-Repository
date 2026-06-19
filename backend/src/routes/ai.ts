import type { FastifyInstance } from "fastify";

import { eq, desc } from "drizzle-orm";

import { db } from "../db/index.js";

import {
  moodEntries,
  userRoutines,
  chats,
  messages,
  summaries,
} from "../db/schema.js";

import { generateResponse } from "../services/ai.js";

export async function aiRoutes(
  fastify: FastifyInstance
) {

    fastify.get(
    "/messages",
    async (request, reply) => {

        const payload =
        await request.jwtVerify() as {
            id: number;
            tokenId: string;
        };

        const chat = await db
        .select()
        .from(chats)
        .where(
            eq(chats.userId, payload.id)
        );

        if (chat.length === 0) {
        return [];
        }

        const history = await db
        .select()
        .from(messages)
        .where(
            eq(messages.chatId, chat[0].id)
        );

        return history;
    }
    );

  fastify.post(
    "/chat",
    async (request, reply) => {

      const payload =
      await request.jwtVerify() as {
        id: number;
        tokenId: string;
      };

      const existingChat = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, payload.id)
      );

      let chatId: number;

      if (existingChat.length === 0) {

        const [newChat] = await db
            .insert(chats)
            .values({
            userId: payload.id,
            })
            .returning();

        chatId = newChat.id;

      } else {

        chatId = existingChat[0].id;

      }
      const moods = await db
        .select()
        .from(moodEntries)
        .where(
          eq(
            moodEntries.userId,
            payload.id
          )
        );
        

      const routines = await db
        .select()
        .from(userRoutines)
        .where(
          eq(
            userRoutines.userId,
            payload.id
          )
        );

        const body = request.body as {
            message: string;
        };

        const history = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId)
        )
        .orderBy(desc(messages.createdAt))
        .limit(20);

        const historyText = history
        .map(
            (message) =>
            `${message.role}: ${message.content}`
        )
        .join("\n");

        const prompt = `

        Eres un asistente que vela por la salud física y mental del usuario.

        Información del usuario:

        Mood:
        ${JSON.stringify(moods)}

        Fitness:
        ${JSON.stringify(routines)}

        Ultimos 20 mensajes:
        ${historyText}

        Mensaje del usuario:
        ${body.message}
        
        
        Si la información está vacía, dile que lo ideal es que se dirija a la sección psicoemocional a colocar su estado de ánimo.`;

        await db
        .insert(messages)
        .values({
            chatId,
            role: "user",
            content: body.message,
        });

        const response = await generateResponse(prompt);

        console.log(
        "AI RESPONSE:",
        response
        );

        if (!response) {
        throw new Error(
            "Gemini no devolvió respuesta"
        );
        }

        await db
        .insert(messages)
        .values({
            chatId,
            role: "assistant",
            content: response,
        });

        const chatMessages = await db
        .select()
        .from(messages)
        .where(
            eq(messages.chatId, chatId)
        );

        if ( (chatMessages.length > 10)) {

            const userSummaries = await db
            .select()
            .from(summaries)
            .where(
                eq(
                summaries.userId,
                payload.id
                )
            );

            const expectedSummaries =
            Math.floor(
                chatMessages.length / 10
            );

            if (
            expectedSummaries >
            userSummaries.length
            ) {

            const recentMessages = await db
                .select()
                .from(messages)
                .where(
                eq(messages.chatId, chatId)
                )
                .orderBy(
                desc(messages.createdAt)
                )
                .limit(10);

            const conversation =
                recentMessages
                .reverse()
                .map(
                    message =>
                    `${message.role}: ${message.content}`
                )
                .join("\n");

            const summary =
                await generateResponse(`
            Resume la conversación.

            Extrae:

            - emociones importantes
            - preocupaciones
            - eventos relevantes
            - hábitos mencionados

            Sé breve.

            Conversación:

            ${conversation}
            `);

            if (!summary) {
                throw new Error(
                "Gemini no devolvió respuesta"
                );
            }

            await db
                .insert(summaries)
                .values({
                userId: payload.id,
                summary,
                embedding: "PENDING",
                });

            console.log(
                "SUMMARY CREATED"
            );
            }
    }}
    );
};