CREATE TABLE "exercise_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "exercise_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"difficulty" varchar(20) NOT NULL,
	"estimated_minutes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"video_url" text
);
--> statement-breakpoint
CREATE TABLE "routine_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"routine_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"order_index" integer NOT NULL,
	"recommended_reps" integer,
	"recommended_minutes" integer
);
--> statement-breakpoint
CREATE TABLE "user_routine_exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_routine_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_routines" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"routine_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"completion_percentage" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_routines" ADD CONSTRAINT "exercise_routines_category_id_exercise_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exercise_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_exercise_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."exercise_routines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_routine_exercises" ADD CONSTRAINT "user_routine_exercises_user_routine_id_user_routines_id_fk" FOREIGN KEY ("user_routine_id") REFERENCES "public"."user_routines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_routine_exercises" ADD CONSTRAINT "user_routine_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_routines" ADD CONSTRAINT "user_routines_routine_id_exercise_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."exercise_routines"("id") ON DELETE no action ON UPDATE no action;