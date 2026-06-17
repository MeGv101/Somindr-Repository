import { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import { moodEntries } from "../db/schema.js";
import { eq , and , desc } from "drizzle-orm"
console.log("CARGÓ EL ARCHIVO MOOD");
export async function moodRoutes(
  fastify: FastifyInstance
) {

    function formatDateLocal(date: Date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
    }

    function getPreviousWeekStart() {
        const today = new Date();
        const day = today.getDay();
        const diff = day === 0 ? - 6 : 1 - day;
        today.setDate(today.getDate() + diff);
        today.setDate(today.getDate() - 7);
        return formatDateLocal(today);
    }

    

    fastify.get(
    "/mood/current",
    async (request, reply) => {
        const payload = await request.jwtVerify() as {
            id: number;
            tokenId: string;
        };
        const weekStart = getPreviousWeekStart();
        const mood =
        await db.select().from(moodEntries).where(and(
            eq(moodEntries.userId, payload.id),
            eq(moodEntries.weekStart, weekStart)
        ));
        if (mood.length === 0) {return null;}
        return mood[0];
    }
    );

    fastify.post(
    "/mood",
    async (request, reply) => {
        const body = request.body as {
        stress: number;
        sleepQuality: number;
        energy: number;
        anxiety: number;
        notes: string;
        };
        const payload = await request.jwtVerify() as {
        id: number;
        tokenId: string;
        };

        const weekStart = getPreviousWeekStart();
        const existingMood = await db
        .select()
        .from(moodEntries)
        .where(
            and(
            eq(moodEntries.userId, payload.id),
            eq(moodEntries.weekStart, weekStart)
            )
        );

        if (existingMood.length > 0) {
            await db.update(moodEntries).set({
                stress: body.stress,
                sleepQuality: body.sleepQuality,
                energy: body.energy,
                anxiety: body.anxiety,
                notes:
                body.notes.trim() ||
                "Sin observaciones adicionales.",
            })
            .where(
                eq(
                moodEntries.id,
                existingMood[0].id
                )
            );
            return {
                message: "Mood actualizado"
            };
        } else {
            await db.insert(moodEntries).values({
            userId: payload.id,
            weekStart: getPreviousWeekStart(),
            stress: body.stress,
            sleepQuality: body.sleepQuality,
            energy: body.energy,
            anxiety: body.anxiety,
            notes:
            body.notes.trim() ||
            "Sin observaciones adicionales.",
            });
            return {
                message: "Mood recibido"
            };
        }

        
        
    }
    );

    fastify.get(
    "/mood/history",
    async (request, reply) => {
        
        const payload =
        await request.jwtVerify() as {id: number;};

        const moods = await db
        .select()
        .from(moodEntries)
        .where(
            eq(
            moodEntries.userId,
            payload.id
            )
        )
        .orderBy(
            desc(moodEntries.weekStart)
        );

        return moods;
    }
    );
}
