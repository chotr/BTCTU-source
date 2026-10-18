CREATE TYPE "business_role" AS ENUM ('lanh_dao', 'truong_phong', 'cong_chuc');
--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "business_role" "business_role" DEFAULT 'cong_chuc' NOT NULL;
--> statement-breakpoint
UPDATE "positions"
SET "business_role" = 'lanh_dao'
WHERE "external_id" IN (
  'truong-ban',
  'pho-truong-ban-thuong-truc',
  'pho-truong-ban'
);
--> statement-breakpoint
UPDATE "positions"
SET "business_role" = 'truong_phong'
WHERE "external_id" IN (
  'truong-phong',
  'chanh-van-phong',
  'pho-truong-phong',
  'pho-chanh-van-phong'
);
--> statement-breakpoint
CREATE UNIQUE INDEX "people_external_id_unique" ON "people" USING btree ("external_id") WHERE "external_id" IS NOT NULL;
--> statement-breakpoint
UPDATE "users" AS "u"
SET "directory_actor_id" = "p"."id"::text
FROM "people" AS "p"
WHERE "u"."directory_actor_id" = "p"."external_id";
--> statement-breakpoint
CREATE UNIQUE INDEX "position_assignments_one_open_per_person_unique" ON "position_assignments" USING btree ("person_id") WHERE "valid_to" IS NULL;
