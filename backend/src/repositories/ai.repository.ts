import { db } from "../db/index.js";

import {
  chats,
  messages,
  summaries,
  moodEntries,
  userRoutines,
} from "../db/schema.js";

import {
  eq,
  desc,
} from "drizzle-orm";
export async function findChatByUserId(
  userId: number
) {
  const result = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  return result[0] ?? null;
}
export async function createChat(
  userId: number
) {
  const [chat] = await db
    .insert(chats)
    .values({
      userId,
    })
    .returning();

  return chat;
}
export async function getMessages(
  chatId: number
) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));
}
export async function getRecentMessages(
  chatId: number,
  limit = 20
) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}
export async function saveMessage(
  chatId: number,
  role: string,
  content: string
) {
  await db
    .insert(messages)
    .values({
      chatId,
      role,
      content,
    });
}
export async function getMoodHistory(
  userId: number
) {
  return db
    .select()
    .from(moodEntries)
    .where(
      eq(
        moodEntries.userId,
        userId
      )
    );
}
export async function getRoutineHistory(
  userId: number
) {
  return db
    .select()
    .from(userRoutines)
    .where(
      eq(
        userRoutines.userId,
        userId
      )
    );
}
export async function getSummaries(
  userId: number
) {
  return db
    .select()
    .from(summaries)
    .where(
      eq(
        summaries.userId,
        userId
      )
    );
}
export async function createSummary(
  userId: number,
  summary: string
) {
  await db
    .insert(summaries)
    .values({
      userId,
      summary,
      embedding: "PENDING",
    });
}