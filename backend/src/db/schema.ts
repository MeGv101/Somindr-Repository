import {
	pgTable,
	serial,
	integer,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),

	nombre: text("name")
		.notNull(),

  apellido: text("lastname")
      .notNull(),

	email: text("email")
		.notNull()
		.unique(),
  
  username: text("username")
    .notNull()
    .unique(),

	passwordHash: text("password_hash")
		.notNull(),

	createdAt: timestamp("created_at")
		.defaultNow()
		.notNull(),
});


export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  tokenId: text("token_id")
    .notNull()
    .unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});