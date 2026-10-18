import { and, asc, desc, eq, isNull, or, sql } from "drizzle-orm";
import { ROLES, type Role } from "@btctu/shared";
import {
  departments,
  people,
  positions,
  positionAssignments,
  type Department,
  type Person,
  type Position,
  type PositionAssignment,
} from "@/db/schema/organization";
import type { Database } from "@/db/client";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function deriveRoleFromPosition(title: string): Role {
  const lower = title.toLowerCase();
  if (lower.includes("trưởng ban") || lower.includes("lãnh đạo ban")) {
    return ROLES.lanhDao;
  }
  if (
    lower.includes("trưởng phòng") ||
    lower.includes("chánh văn phòng") ||
    lower.includes("phó trưởng phòng") ||
    lower.includes("phó chánh văn phòng")
  ) {
    return ROLES.truongPhong;
  }
  return ROLES.congChuc;
}

export type OrganizationAssignment = {
  assignmentId: string;
  personId: string;
  personName: string;
  externalId: string | null;
  positionId: string;
  positionTitle: string;
  departmentId: string;
  departmentName: string;
  departmentCode: string | null;
  role: Role;
  assignmentType: "STAFF" | "SECONDMENT";
  validFrom: string | null;
  validTo: string | null;
  sourceRef: string | null;
};

export interface OrganizationStore {
  listDepartments(): Promise<Department[]>;
  findDepartmentById(id: string): Promise<Department | null>;
  listCurrentAssignments(): Promise<OrganizationAssignment[]>;
  listAssignmentsByDepartment(departmentId: string): Promise<OrganizationAssignment[]>;
  findPersonById(id: string): Promise<Person | null>;
  listAssignmentsByPerson(personId: string): Promise<OrganizationAssignment[]>;
  createDepartment(data: {
    name: string;
    shortName?: string;
    officialCode?: string;
  }): Promise<Department>;
  updateDepartment(
    id: string,
    data: { name?: string; shortName?: string; officialCode?: string },
  ): Promise<Department | null>;
  createPerson(data: {
    name: string;
    externalId?: string;
    sourceRef?: string;
  }): Promise<Person>;
  updatePerson(
    id: string,
    data: { name?: string; externalId?: string; sourceRef?: string },
  ): Promise<Person | null>;
  findPositionById(id: string): Promise<Position | null>;
  createAssignment(data: {
    personId: string;
    positionId: string;
    departmentId: string;
    assignmentType: "STAFF" | "SECONDMENT";
    validFrom?: string;
    sourceRef?: string;
  }): Promise<PositionAssignment>;
  endActiveAssignments(personId: string, validTo: string): Promise<void>;
}

export class DatabaseOrganizationStore implements OrganizationStore {
  constructor(private readonly db: Database) {}

  async listDepartments(): Promise<Department[]> {
    return this.db.select().from(departments).orderBy(asc(departments.name));
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    const conditions = [
      eq(departments.officialCode, id),
      eq(departments.shortName, id),
    ];
    if (isUuid(id)) {
      conditions.unshift(eq(departments.id, id));
    }
    const rows = await this.db
      .select()
      .from(departments)
      .where(or(...conditions))
      .limit(1);
    return rows[0] ?? null;
  }

  async listCurrentAssignments(): Promise<OrganizationAssignment[]> {
    const today = new Date().toISOString().slice(0, 10);
    const rows = await this.db
      .select({
        assignmentId: positionAssignments.id,
        personId: people.id,
        personName: people.name,
        externalId: people.externalId,
        positionId: positions.id,
        positionTitle: positions.title,
        departmentId: departments.id,
        departmentName: departments.name,
        departmentCode: departments.officialCode,
        assignmentType: positionAssignments.assignmentType,
        validFrom: positionAssignments.validFrom,
        validTo: positionAssignments.validTo,
        sourceRef: positionAssignments.sourceRef,
      })
      .from(positionAssignments)
      .innerJoin(people, eq(positionAssignments.personId, people.id))
      .innerJoin(positions, eq(positionAssignments.positionId, positions.id))
      .innerJoin(departments, eq(positionAssignments.departmentId, departments.id))
      .where(
        or(
          isNull(positionAssignments.validTo),
          sql`${positionAssignments.validTo} >= ${today}`,
        ),
      )
      .orderBy(asc(people.name));

    return rows.map((row) => ({
      ...row,
      role: deriveRoleFromPosition(row.positionTitle),
    }));
  }

  async listAssignmentsByDepartment(
    departmentId: string,
  ): Promise<OrganizationAssignment[]> {
    const dept = await this.findDepartmentById(departmentId);
    if (!dept) return [];
    const today = new Date().toISOString().slice(0, 10);

    const rows = await this.db
      .select({
        assignmentId: positionAssignments.id,
        personId: people.id,
        personName: people.name,
        externalId: people.externalId,
        positionId: positions.id,
        positionTitle: positions.title,
        departmentId: departments.id,
        departmentName: departments.name,
        departmentCode: departments.officialCode,
        assignmentType: positionAssignments.assignmentType,
        validFrom: positionAssignments.validFrom,
        validTo: positionAssignments.validTo,
        sourceRef: positionAssignments.sourceRef,
      })
      .from(positionAssignments)
      .innerJoin(people, eq(positionAssignments.personId, people.id))
      .innerJoin(positions, eq(positionAssignments.positionId, positions.id))
      .innerJoin(departments, eq(positionAssignments.departmentId, departments.id))
      .where(
        and(
          eq(positionAssignments.departmentId, dept.id),
          or(
            isNull(positionAssignments.validTo),
            sql`${positionAssignments.validTo} >= ${today}`,
          ),
        ),
      )
      .orderBy(asc(people.name));

    return rows.map((row) => ({
      ...row,
      role: deriveRoleFromPosition(row.positionTitle),
    }));
  }

  async findPersonById(id: string): Promise<Person | null> {
    const conditions = [eq(people.externalId, id)];
    if (isUuid(id)) {
      conditions.unshift(eq(people.id, id));
    }
    const rows = await this.db
      .select()
      .from(people)
      .where(or(...conditions))
      .limit(1);
    return rows[0] ?? null;
  }

  async listAssignmentsByPerson(
    personId: string,
  ): Promise<OrganizationAssignment[]> {
    const p = await this.findPersonById(personId);
    if (!p) return [];

    const rows = await this.db
      .select({
        assignmentId: positionAssignments.id,
        personId: people.id,
        personName: people.name,
        externalId: people.externalId,
        positionId: positions.id,
        positionTitle: positions.title,
        departmentId: departments.id,
        departmentName: departments.name,
        departmentCode: departments.officialCode,
        assignmentType: positionAssignments.assignmentType,
        validFrom: positionAssignments.validFrom,
        validTo: positionAssignments.validTo,
        sourceRef: positionAssignments.sourceRef,
      })
      .from(positionAssignments)
      .innerJoin(people, eq(positionAssignments.personId, people.id))
      .innerJoin(positions, eq(positionAssignments.positionId, positions.id))
      .innerJoin(departments, eq(positionAssignments.departmentId, departments.id))
      .where(eq(positionAssignments.personId, p.id))
      .orderBy(desc(positionAssignments.createdAt));

    return rows.map((row) => ({
      ...row,
      role: deriveRoleFromPosition(row.positionTitle),
    }));
  }

  async createDepartment(data: {
    name: string;
    shortName?: string;
    officialCode?: string;
  }): Promise<Department> {
    const [dept] = await this.db.insert(departments).values(data).returning();
    return dept;
  }

  async updateDepartment(
    id: string,
    data: { name?: string; shortName?: string; officialCode?: string },
  ): Promise<Department | null> {
    const target = await this.findDepartmentById(id);
    if (!target) return null;
    const [updated] = await this.db
      .update(departments)
      .set(data)
      .where(eq(departments.id, target.id))
      .returning();
    return updated ?? null;
  }

  async createPerson(data: {
    name: string;
    externalId?: string;
    sourceRef?: string;
  }): Promise<Person> {
    const [p] = await this.db.insert(people).values(data).returning();
    return p;
  }

  async updatePerson(
    id: string,
    data: { name?: string; externalId?: string; sourceRef?: string },
  ): Promise<Person | null> {
    const target = await this.findPersonById(id);
    if (!target) return null;
    const [updated] = await this.db
      .update(people)
      .set(data)
      .where(eq(people.id, target.id))
      .returning();
    return updated ?? null;
  }

  async findPositionById(id: string): Promise<Position | null> {
    const conditions = [eq(positions.title, id)];
    if (isUuid(id)) {
      conditions.unshift(eq(positions.id, id));
    }
    const rows = await this.db
      .select()
      .from(positions)
      .where(or(...conditions))
      .limit(1);
    return rows[0] ?? null;
  }

  async createAssignment(data: {
    personId: string;
    positionId: string;
    departmentId: string;
    assignmentType: "STAFF" | "SECONDMENT";
    validFrom?: string;
    sourceRef?: string;
  }): Promise<PositionAssignment> {
    const [assignment] = await this.db
      .insert(positionAssignments)
      .values(data)
      .returning();
    return assignment;
  }

  async endActiveAssignments(personId: string, validTo: string): Promise<void> {
    await this.db
      .update(positionAssignments)
      .set({ validTo })
      .where(
        and(
          eq(positionAssignments.personId, personId),
          isNull(positionAssignments.validTo),
        ),
      );
  }
}
