CREATE TABLE "professional_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"profession" varchar(50) NOT NULL,
	"message" text,
	"admin_comment" text,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"reviewed_by" integer,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "professional_requests" ADD CONSTRAINT "professional_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_requests" ADD CONSTRAINT "professional_requests_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;