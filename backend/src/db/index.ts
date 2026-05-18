import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'coachy',
  password: 'exercises',
  database: 'somindr',
})

export const db = drizzle(pool)