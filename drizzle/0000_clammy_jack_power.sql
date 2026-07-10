CREATE TABLE "contacts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"push_name" varchar(255),
	"profile_picture_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"remote_jid" varchar(255) NOT NULL,
	"from_me" boolean NOT NULL,
	"participant" varchar(255),
	"push_name" varchar(255),
	"message_timestamp" timestamp NOT NULL,
	"message_type" varchar(50) NOT NULL,
	"content" text,
	"media_url" text,
	"status" varchar(20) DEFAULT 'SERVER_ACK',
	"raw_message" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
