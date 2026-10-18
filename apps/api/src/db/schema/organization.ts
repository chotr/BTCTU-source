import {
  date,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const assignmentTypeEnum = pgEnum("assignment_type", [
  "STAFF",
  "SECONDMENT",
]);

export const businessRoleEnum = pgEnum("business_role", [
  "lanh_dao",
  "truong_phong",
  "cong_chuc",
]);

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),

  shortName: varchar("short_name", { length: 128 }),

  officialCode: varchar("official_code", { length: 64 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),

  externalId: varchar("external_id", { length: 255 }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("people_external_id_unique")
    .on(table.externalId)
    .where(sql`${table.externalId} is not null`),
]);

export const positions = pgTable("positions", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 255 }).notNull(),

  externalId: varchar("external_id", { length: 255 }),

  businessRole: businessRoleEnum("business_role")
    .notNull()
    .default("cong_chuc"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const positionAssignments = pgTable(
  "position_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),

    positionId: uuid("position_id")
      .notNull()
      .references(() => positions.id, { onDelete: "restrict" }),

    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "restrict" }),

    assignmentType: assignmentTypeEnum("assignment_type").notNull(),

    validFrom: date("valid_from"),

    validTo: date("valid_to"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("position_assignments_person_id_idx").on(table.personId),
    index("position_assignments_position_id_idx").on(table.positionId),
    index("position_assignments_department_id_idx").on(table.departmentId),
  ],
);

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type Person = typeof people.$inferSelect;
export type NewPerson = typeof people.$inferInsert;
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
export type PositionAssignment = typeof positionAssignments.$inferSelect;
export type NewPositionAssignment = typeof positionAssignments.$inferInsert;
