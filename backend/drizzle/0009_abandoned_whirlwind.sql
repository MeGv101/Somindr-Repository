CREATE TABLE "professional_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"professional_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professional_contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"professional_id" integer NOT NULL,
	"type" varchar(30) NOT NULL,
	"value" text NOT NULL,
	"visible" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"profession" varchar(50) NOT NULL,
	"description" text,
	"price_per_hour" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"accepting_clients" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weight_kg" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "height_cm" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "activity_level" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_professional" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "professional_clients" ADD CONSTRAINT "professional_clients_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_clients" ADD CONSTRAINT "professional_clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_contacts" ADD CONSTRAINT "professional_contacts_professional_id_professionals_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professionals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;