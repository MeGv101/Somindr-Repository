ALTER TABLE "professionals" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "deactivated_at" timestamp;