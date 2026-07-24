import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from "@fastify/jwt";

import { db } from './db/index.js'
import { users } from './db/schema.js'

import { authRoutes } from "./routes/auth.js";
import { moodRoutes } from "./routes/mood.js";
import { fitnessRoutes } from "./routes/fitness.js";
import { aiRoutes } from "./routes/ai.js";
import { communityRoutes } from "./routes/comunidad.js";

const app = Fastify()

await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

await app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://naturals-requirement-differential-powered.trycloudflare.com"]
})

await app.register(authRoutes, {
  prefix: "/api",
});

await app.register(moodRoutes, {
  prefix: "/api",
});

await app.register(fitnessRoutes, {
  prefix: "/api",
});

await app.register(aiRoutes, {
  prefix: "/api",
});

await app.register(communityRoutes, {
  prefix: "/api/community",
});

app.get('/', async () => {
  return {
    message: 'Somindr API running'
  }
})

app.get('/users', async (_, reply) => {
  try {
    const result = await db.select().from(users)

    return result
  } catch (error) {
    console.error(error)

    return reply.status(500).send(error)
  }
})


await app.listen({
  host: "0.0.0.0",
  port: 3000
});



console.log("Server running on port 3000");
