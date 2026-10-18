ALTER TABLE "departments" ADD COLUMN "source_ref" varchar(255);
--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "source_class" varchar(32) DEFAULT 'UNVERIFIED' NOT NULL;
--> statement-breakpoint
ALTER TABLE "people" ADD COLUMN "source_class" varchar(32) DEFAULT 'UNVERIFIED' NOT NULL;
--> statement-breakpoint
UPDATE "departments"
SET
  "source_ref" = '01-QĐ/BTCTU, Điều 2–6',
  "source_class" = 'FACT'
WHERE "id" IN (
  '00000000-0000-0000-0000-0000000000d0',
  '00000000-0000-0000-0000-0000000000d1',
  '00000000-0000-0000-0000-0000000000d2',
  '00000000-0000-0000-0000-0000000000d3',
  '00000000-0000-0000-0000-0000000000d4'
);
--> statement-breakpoint
UPDATE "people"
SET "source_class" = 'FACT'
WHERE "source_ref" = '01-QĐ/BTCTU, Điều 2–7';
--> statement-breakpoint
UPDATE "position_assignments"
SET "source_class" = 'UNVERIFIED'
WHERE "source_class" IS NULL;
--> statement-breakpoint
ALTER TABLE "position_assignments" ALTER COLUMN "source_class" SET DEFAULT 'UNVERIFIED';
--> statement-breakpoint
ALTER TABLE "position_assignments" ALTER COLUMN "source_class" SET NOT NULL;
