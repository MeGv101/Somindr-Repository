import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from "@fastify/jwt";

import { db } from './db/index.js'
import { users } from './db/schema.js'

import { authRoutes } from "./routes/auth.js";
import { moodRoutes } from "./routes/mood.js";

const app = Fastify()

await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

await app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174",]
})

await app.register(authRoutes);

await app.register(moodRoutes);

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
  port: 3000
});

console.log("Server running on port 3000");
