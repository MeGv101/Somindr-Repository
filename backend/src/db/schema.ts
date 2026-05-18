import {
  mysqlTable,
  int,
  varchar,
  timestamp
} from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id')
    .primaryKey()
    .autoincrement(),

  username: varchar('username', {
    length: 255
  }).notNull(),

  email: varchar('email', {
    length: 255
  }).notNull(),

  password: varchar('password', {
    length: 255
  }).notNull(),

  createdAt: timestamp('created_at')
    .defaultNow()
})