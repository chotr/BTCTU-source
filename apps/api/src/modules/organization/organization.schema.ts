import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(255),
  shortName: z.string().trim().min(2).max(128).optional(),
  officialCode: z.string().trim().min(1).max(64).optional(),
});

export const updateDepartmentSchema = z
  .object({
    name: z.string().trim().min(2).max(255).optional(),
    shortName: z.string().trim().min(2).max(128).optional(),
    officialCode: z.string().trim().min(1).max(64).optional(),
  })
  .refine((val) => Object.values(val).some((v) => v !== undefined), {
    message: "Provide at least one field to update.",
  });

export const createPersonSchema = z.object({
  name: z.string().trim().min(2).max(255),
  externalId: z.string().trim().min(1).max(255).optional(),
  sourceRef: z.string().trim().min(1).max(255).optional(),
}).strict();

export const updatePersonSchema = z
  .object({
    name: z.string().trim().min(2).max(255).optional(),
    sourceRef: z.string().trim().min(1).max(255).optional(),
  })
  .strict()
  .refine((val) => Object.values(val).some((v) => v !== undefined), {
    message: "Provide at least one field to update.",
  });

export const assignPositionSchema = z.object({
  personId: z.string().trim().min(1),
  positionId: z.string().trim().min(1),
  departmentId: z.string().trim().min(1),
  assignmentType: z.enum(["STAFF", "SECONDMENT"]).default("STAFF"),
  sourceRef: z.string().trim().min(1).max(255).optional(),
}).strict();
