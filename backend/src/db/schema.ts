import {
	pgTable,
	serial,
	integer,
  varchar,
  boolean,
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
export const exerciseCategories = pgTable(
  "exercise_categories",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    description: text("description"),
  }
);

export const exerciseRoutines = pgTable(
  "exercise_routines",
  {
    id: serial("id").primaryKey(),

    categoryId: integer("category_id")
      .notNull()
      .references(
        () => exerciseCategories.id
      ),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    description: text("description"),

    difficulty: varchar(
      "difficulty",
      {
        length: 20,
      }
    ).notNull(),

    estimatedMinutes: integer(
      "estimated_minutes"
    ).notNull(),
  }
);

export const exercises = pgTable(
  "exercises",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    description: text("description"),

    videoUrl: text("video_url"),
  }
);

export const routineExercises = pgTable(
  "routine_exercises",
  {
    id: serial("id").primaryKey(),

    routineId: integer("routine_id")
      .notNull()
      .references(
        () => exerciseRoutines.id
      ),

    exerciseId: integer("exercise_id")
      .notNull()
      .references(
        () => exercises.id
      ),

    orderIndex: integer(
      "order_index"
    ).notNull(),

    recommendedReps: integer(
      "recommended_reps"
    ),

    recommendedMinutes: integer(
      "recommended_minutes"
    ),
  }
);

export const userRoutines = pgTable(
  "user_routines",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(
        () => users.id
      ),

    routineId: integer("routine_id")
      .notNull()
      .references(
        () => exerciseRoutines.id
      ),

    startedAt: timestamp(
      "started_at"
    )
      .defaultNow()
      .notNull(),

    completedAt: timestamp(
      "completed_at"
    ),

    completionPercentage:
      integer(
        "completion_percentage"
      )
        .default(0)
        .notNull(),
  }
);

export const userRoutineExercises =
  pgTable(
    "user_routine_exercises",
    {
      id: serial("id").primaryKey(),

      userRoutineId: integer(
        "user_routine_id"
      )
        .notNull()
        .references(
          () => userRoutines.id
        ),

      exerciseId: integer(
        "exercise_id"
      )
        .notNull()
        .references(
          () => exercises.id
        ),

      completed: boolean(
        "completed"
      )
        .default(false)
        .notNull(),

      completedAt: timestamp(
        "completed_at"
      ),
    }
  );