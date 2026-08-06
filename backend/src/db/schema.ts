import {
	pgTable,
	serial,
	integer,
  varchar,
  boolean,
	text,
	date,
	timestamp,
  unique, 
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

  emailVerified: boolean("email_verified")
    .default(false)
    .notNull(),

  genero: varchar("gender", {
    length: 10,
  })
  .notNull(),

  fechaNacimiento: date("birth_date")
  .notNull(),

  pesoKg: integer("weight_kg")
  .notNull(),

  estaturaCm: integer("height_cm")
  .notNull(),

  nivelActividad: varchar(
    "activity_level",
    {
      length: 30,
    }
  )
  .notNull(),

  biografia: text("bio"),

  fotoPerfil: integer("profile_picture")
  .default(1)
  .notNull(),

  suspended: boolean("suspended")
  .notNull()
  .default(false),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id, {
        onDelete: "cascade",
    })
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
      .references(() => users.id, {
        onDelete: "cascade",
    }),

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
        () => exerciseCategories.id, {
        onDelete: "cascade",
    }),

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
        () => exerciseRoutines.id, {
          onDelete: "cascade",
      }),

    exerciseId: integer("exercise_id")
      .notNull()
      .references(
        () => exercises.id, {
        onDelete: "cascade",
      }
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
        () => users.id, {
          onDelete: "cascade",
      }),

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
          () => userRoutines.id, {
            onDelete: "cascade",
        }),

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
  export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
        onDelete: "cascade",
    }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  chatId: integer("chat_id")
    .notNull()
    .references(() => chats.id, {
        onDelete: "cascade",
    }),

  role: text("role")
    .notNull(),

  content: text("content")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
        onDelete: "cascade",
    }),

  summary: text("summary")
    .notNull(),

  embedding: text("embedding")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const authTokens = pgTable("auth_tokens", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  token: text("token")
    .notNull()
    .unique(),

  type: varchar("type", {
    length: 32,
  }).notNull(),

  expiresAt: timestamp("expires_at")
    .notNull(),

  usedAt: timestamp("used_at"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
        onDelete: "cascade",
    }),

  title: varchar("title", {
    length: 150,
  }).notNull(),

  category: varchar("category", {
    length: 50,
  }).notNull(),

  content: text("content")
    .notNull(),

  edited: boolean("edited")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),

  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, {
        onDelete: "cascade",
    }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
        onDelete: "cascade",
    }),

  content: text("content")
    .notNull(),
  
  edited: boolean("edited")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const postReactions = pgTable("post_reactions", {
  id: serial("id").primaryKey(),

  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, {
        onDelete: "cascade",
    }),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
        onDelete: "cascade",
    }),

  type: varchar("type", {
    length: 10,
  }).notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
},

(table) => ({
  uniqueReaction: unique().on(
    table.postId,
    table.userId
  ),
})
);

export const professionals = pgTable(
  "professionals",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    profession: varchar(
      "profession",
      {
        length: 50,
      }
    ).notNull(),

    description: text(
      "description"
    ),

    pricePerHour: integer(
      "price_per_hour"
    ).notNull(),

    verified: boolean(
      "verified"
    )
      .default(false)
      .notNull(),

    acceptingClients: boolean("accepting_clients")
      .default(true)
      .notNull(),

    active: boolean("active")
      .notNull()
      .default(true),

deactivatedAt: timestamp("deactivated_at"),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);

export const professionalClients =
pgTable(
  "professional_clients",
  {

    id: serial("id").primaryKey(),

    professionalId: integer(
      "professional_id"
    )
      .notNull()
      .references(
        () => professionals.id,
        {
          onDelete: "cascade",
        }
      ),

    userId: integer(
      "user_id"
    )
      .notNull()
      .references(
        () => users.id,
        {
          onDelete: "cascade",
        }
      ),

    startedAt: timestamp(
      "started_at"
    )
      .defaultNow()
      .notNull(),

    expiresAt: timestamp(
      "expires_at"
    ),

    active: boolean(
      "active"
    )
      .default(true)
      .notNull(),

  }
);

export const professionalContacts = pgTable(
  "professional_contacts",
  {
    id: serial("id").primaryKey(),

    professionalId: integer("professional_id")
      .notNull()
      .references(() => professionals.id, {
        onDelete: "cascade",
      }),

    type: varchar("type", {
      length: 30,
    }).notNull(),

    value: text("value")
      .notNull(),

    visible: boolean("visible")
      .default(true)
      .notNull(),
  }
);

export const payments = pgTable(
  "payments",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    professionalId: integer(
      "professional_id"
    )
      .notNull()
      .references(() => professionals.id, {
        onDelete: "cascade",
      }),

    orderId: text("order_id")
      .notNull()
      .unique(),

    captureId: text("capture_id"),

    amount: integer("amount")
      .notNull(),

    currency: varchar("currency", {
      length: 5,
    })
      .default("USD")
      .notNull(),

    status: varchar("status", {
      length: 20,
    })
      .notNull(),

    payerEmail: text(
      "payer_email"
    ),

    createdAt: timestamp(
      "created_at"
    )
      .defaultNow()
      .notNull(),
  }
);
export const professionalRequests = pgTable("professional_requests",{
      id:
        serial("id")
          .primaryKey(),

      userId:
        integer("user_id")
          .notNull()
          .references(
            () => users.id,
            {
              onDelete: "cascade",
            }
          ),

      profession:
        varchar(
          "profession",
          { length: 50 }
        ).notNull(),

      message:
        text("message"),

      adminComment: text("admin_comment"),

      status:
        varchar(
          "status",
          { length: 20 }
        )
          .notNull()
          .default("PENDING"),

      reviewedBy:
        integer("reviewed_by")
          .references(
            () => users.id,
            {
              onDelete: "set null",
            }
          ),

      reviewedAt:
        timestamp(
          "reviewed_at"
        ),

      createdAt:
        timestamp(
          "created_at"
        )
          .defaultNow()
          .notNull(),

    }
  );
