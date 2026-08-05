import "dotenv/config"
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from "@fastify/jwt";


import { db } from './db/index.js'
import { users } from './db/schema.js'

import { authRoutes } from "./routes/auth.route.js";
import { moodRoutes } from "./routes/mood.route.js";
import { fitnessRoutes } from "./routes/fitness.route.js";
import { aiRoutes } from "./routes/ai.route.js";
import { communityRoutes } from "./routes/comunidad.route.js";
import { profileRoutes } from "./routes/profile.route.js";
import { userRoutes } from "./routes/user.route.js";
import {searchRoutes } from "./routes/search.routes.js"
import { professionalRoutes } from "./routes/professional.route.js"
import { adminRoutes } from "./routes/admin.route.js";

const app = Fastify()

await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

await app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174", "https://pages-rap-status-arrived.trycloudflare.com"]
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

await app.register(profileRoutes, {
  prefix: "/api",
});

await app.register(userRoutes, {
    prefix:"/api/users"
});

await app.register(professionalRoutes, {
    prefix:"/api"
});

await app.register(searchRoutes, {
    prefix: "/api"
});

await app.register(adminRoutes, {
    prefix: "/api/admin"
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
