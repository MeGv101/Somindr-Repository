import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'

import { db } from './db/index.js'
import { users } from './db/schema.js'

dotenv.config()

const app = Fastify()

await app.register(cors)

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

try {
  await app.listen({
    port: 3000
  })

  console.log('Server running on port 3000')
} catch (err) {
  console.error(err)
  process.exit(1)
}