CREATE TYPE "public"."task_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(1000),
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"img_url" varchar(512),
	"created_at" timestamp DEFAULT now() NOT NULL
);
