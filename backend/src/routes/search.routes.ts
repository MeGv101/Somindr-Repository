import { FastifyInstance } from "fastify";
import { ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export async function searchRoutes(fastify: FastifyInstance) {
    fastify.get("/api/search", async (request, reply) => {
        const { q } = request.query as { q?: string };

        if (!q || q.trim().length === 0) {
            return reply.send([]);
        }

        const resultados = await db
            .select({
                id: users.id,
                username: users.username,
                fotoPerfil: users.fotoPerfil,

            })
            .from(users)
            .where(ilike(users.username, `%${q}%`));

        return reply.send(resultados);
    });
}
