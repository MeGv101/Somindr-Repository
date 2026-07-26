ALTER TABLE "exercise_routines" DROP CONSTRAINT "exercise_routines_category_id_exercise_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_chat_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "post_reactions" DROP CONSTRAINT "post_reactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP CONSTRAINT "routine_exercises_routine_id_exercise_routines_id_fk";
--> statement-breakpoint
ALTER TABLE "routine_exercises" DROP CONSTRAINT "routine_exercises_exercise_id_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "user_routine_exercises" DROP CONSTRAINT "user_routine_exercises_user_routine_id_user_routines_id_fk";
--> statement-breakpoint
ALTER TABLE "exercise_routines" ADD CONSTRAINT "exercise_routines_category_id_exercise_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."exercise_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_routine_id_exercise_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."exercise_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_exercises" ADD CONSTRAINT "routine_exercises_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_routine_exercises" ADD CONSTRAINT "user_routine_exercises_user_routine_id_user_routines_id_fk" FOREIGN KEY ("user_routine_id") REFERENCES "public"."user_routines"("id") ON DELETE cascade ON UPDATE no action;