ALTER TABLE "comments" ADD COLUMN "edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "edited" boolean DEFAULT false NOT NULL;