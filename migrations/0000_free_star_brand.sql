CREATE TABLE "vand_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user" text NOT NULL
);
