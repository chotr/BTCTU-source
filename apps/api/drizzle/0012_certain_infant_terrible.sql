CREATE TYPE "public"."business_role" AS ENUM('lanh_dao', 'truong_phong', 'cong_chuc');--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "business_role" "business_role" DEFAULT 'cong_chuc' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "people_external_id_unique" ON "people" USING btree ("external_id") WHERE "people"."external_id" is not null;