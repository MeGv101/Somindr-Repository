import { db } from "../db/index.js";
import { moodEntries } from "../db/schema.js";

import {
    eq,
    and,
    desc,
} from "drizzle-orm";

export async function findCurrentMood(
    userId: number,
    weekStart: string
) {

    const result = await db
        .select()
        .from(moodEntries)
        .where(
            and(
                eq(moodEntries.userId, userId),
                eq(moodEntries.weekStart, weekStart)
            )
        );

    return result[0] ?? null;

}

export async function createMood(data: {
    userId: number;
    weekStart: string;
    stress: number;
    sleepQuality: number;
    energy: number;
    anxiety: number;
    notes: string;
}) {

    await db
        .insert(moodEntries)
        .values(data);

}

export async function updateMood(
    id: number,
    data: {
        stress: number;
        sleepQuality: number;
        energy: number;
        anxiety: number;
        notes: string;
    }
) {

    await db
        .update(moodEntries)
        .set(data)
        .where(eq(moodEntries.id, id));

}

export async function findHistory(
    userId: number
) {

    return db
        .select()
        .from(moodEntries)
        .where(
            eq(moodEntries.userId, userId)
        )
        .orderBy(
            desc(moodEntries.weekStart)
        );

}