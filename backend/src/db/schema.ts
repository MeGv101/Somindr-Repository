import {
	pgTable,
	serial,
	integer,
	text,
	date,
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

	role: text("role")
		.notNull()
		.default("user"),
		
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

export const moodEntries = pgTable(
  "mood_entries",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    weekStart: date("week_start")
      .notNull(),

    stress: integer("stress")
      .notNull(),

    sleepQuality: integer("sleep_quality")
      .notNull(),

    energy: integer("energy")
      .notNull(),

    anxiety: integer("anxiety")
      .notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  }
);