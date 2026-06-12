CREATE TABLE "ws_connections" (
	"connection_id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"connected_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ws_connections" ADD CONSTRAINT "ws_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ws_connections_user_id_idx" ON "ws_connections" USING btree ("user_id");