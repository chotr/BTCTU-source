import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "@/app";
import type { Env } from "@/env";
import type { AuthPort } from "@/modules/auth/auth.types";
import type {
  Department,
  Person,
  Position,
  PositionAssignment,
} from "@/db/schema/organization";
import type {
  OrganizationAssignment,
  OrganizationStore,
} from "./organization.repository";
import { isAssignmentActive } from "./organization.repository";

const testEnv: Env = {
  environment: "production",
  corsOrigins: ["https://btctu.example"],
  port: 8787,
  publicBaseUrl: "https://api.btctu.example",
  problemTypeBase: "https://api.btctu.example/problems",
  requestBodyLimit: "1mb",
  databaseUrl: "postgres://unused",
  jwtAccessSecret: "access-secret-that-is-at-least-32-chars-long",
  jwtAccessIssuer: "btctu:test",
  jwtAccessAudience: "btctu:test",
  jwtAccessTtlSeconds: 900,
  refreshTokenTtlSeconds: 604800,
  cookiePolicy: { secure: true, sameSite: "Strict" },
  auth: {
    loginMaxAttempts: 5,
    loginWindowSeconds: 900,
    rotationGraceSeconds: 15,
  },
};

class MemoryOrganizationStore implements OrganizationStore {
  departments: Department[] = [
    {
      id: "dept-1",
      name: "Phòng Tổ chức cán bộ",
      shortName: "Tổ chức cán bộ",
      officialCode: "TCCB",
      sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
    {
      id: "dept-0",
      name: "Lãnh đạo Ban",
      shortName: "Lãnh đạo Ban",
      officialCode: "LĐB",
      sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
  ];

  people: Person[] = [
    {
      id: "person-1",
      name: "Nguyễn Thượng Hải",
      externalId: "p-nguyen-thuong-hai",
      sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
    {
      id: "person-2",
      name: "Trần Hải Triều",
      externalId: "p-tran-hai-trieu",
      sourceRef: "01-QĐ/BTCTU, Điều 4",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
  ];

  positions: Position[] = [
    {
      id: "pos-1",
      title: "Trưởng ban",
      externalId: "truong-ban",
      businessRole: "lanh_dao",
      createdAt: new Date(),
    },
    {
      id: "pos-2",
      title: "Trưởng phòng",
      externalId: "truong-phong",
      businessRole: "truong_phong",
      createdAt: new Date(),
    },
  ];

  assignments: Array<{
    id: string;
    personId: string;
    positionId: string;
    departmentId: string;
    assignmentType: "STAFF" | "SECONDMENT";
    validFrom: string | null;
    validTo: string | null;
    sourceRef: string | null;
    sourceClass: string | null;
    createdAt: Date;
  }> = [
    {
      id: "assign-1",
      personId: "person-1",
      positionId: "pos-1",
      departmentId: "dept-0",
      assignmentType: "STAFF",
      validFrom: "2025-01-01",
      validTo: null,
      sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
    {
      id: "assign-2",
      personId: "person-2",
      positionId: "pos-2",
      departmentId: "dept-1",
      assignmentType: "STAFF",
      validFrom: "2025-01-01",
      validTo: null,
      sourceRef: "01-QĐ/BTCTU, Điều 4",
      sourceClass: "FACT",
      createdAt: new Date(),
    },
  ];

  async listDepartments(): Promise<Department[]> {
    return this.departments;
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    return (
      this.departments.find(
        (d) => d.id === id || d.officialCode === id || d.shortName === id,
      ) ?? null
    );
  }

  async listCurrentAssignments(): Promise<OrganizationAssignment[]> {
    const today = new Date().toISOString().slice(0, 10);
    return this.assignments
      .filter((assignment) => isAssignmentActive(assignment, today))
      .map((a) => {
        const person = this.people.find((p) => p.id === a.personId)!;
        const position = this.positions.find((pos) => pos.id === a.positionId)!;
        const dept = this.departments.find((d) => d.id === a.departmentId)!;
        return {
          assignmentId: a.id,
          personId: person.id,
          personName: person.name,
          externalId: person.externalId,
          positionId: position.id,
          positionTitle: position.title,
          departmentId: dept.id,
          departmentName: dept.name,
          departmentCode: dept.officialCode,
          role: position.businessRole,
          assignmentType: a.assignmentType,
          validFrom: a.validFrom,
          validTo: a.validTo,
          sourceRef: a.sourceRef,
          sourceClass: a.sourceClass,
        };
      });
  }

  async listAssignmentsByDepartment(
    departmentId: string,
  ): Promise<OrganizationAssignment[]> {
    const current = await this.listCurrentAssignments();
    const dept = await this.findDepartmentById(departmentId);
    if (!dept) return [];
    return current.filter((c) => c.departmentId === dept.id);
  }

  async findPersonById(id: string): Promise<Person | null> {
    return this.people.find((p) => p.id === id) ?? null;
  }

  async listAssignmentsByPerson(
    personId: string,
  ): Promise<OrganizationAssignment[]> {
    const person = await this.findPersonById(personId);
    if (!person) return [];
    return this.assignments
      .filter((a) => a.personId === person.id)
      .map((a) => {
        const position = this.positions.find((pos) => pos.id === a.positionId)!;
        const dept = this.departments.find((d) => d.id === a.departmentId)!;
        return {
          assignmentId: a.id,
          personId: person.id,
          personName: person.name,
          externalId: person.externalId,
          positionId: position.id,
          positionTitle: position.title,
          departmentId: dept.id,
          departmentName: dept.name,
          departmentCode: dept.officialCode,
          role: position.businessRole,
          assignmentType: a.assignmentType,
          validFrom: a.validFrom,
          validTo: a.validTo,
          sourceRef: a.sourceRef,
          sourceClass: a.sourceClass,
        };
      });
  }

  async createDepartment(data: {
    name: string;
    shortName?: string;
    officialCode?: string;
  }): Promise<Department> {
    const created: Department = {
      id: `dept-${this.departments.length + 1}`,
      name: data.name,
      shortName: data.shortName ?? null,
      officialCode: data.officialCode ?? null,
      sourceRef: null,
      sourceClass: "UNVERIFIED",
      createdAt: new Date(),
    };
    this.departments.push(created);
    return created;
  }

  async updateDepartment(
    id: string,
    data: { name?: string; shortName?: string; officialCode?: string },
  ): Promise<Department | null> {
    const index = this.departments.findIndex(
      (d) => d.id === id || d.officialCode === id,
    );
    if (index === -1) return null;
    this.departments[index] = {
      ...this.departments[index],
      ...data,
    };
    return this.departments[index];
  }

  async createPerson(data: {
    name: string;
    externalId?: string;
    sourceRef?: string;
  }): Promise<Person> {
    const created: Person = {
      id: `person-${this.people.length + 1}`,
      name: data.name,
      externalId: data.externalId ?? null,
      sourceRef: data.sourceRef ?? null,
      sourceClass: "UNVERIFIED",
      createdAt: new Date(),
    };
    this.people.push(created);
    return created;
  }

  async updatePerson(
    id: string,
    data: { name?: string; externalId?: string; sourceRef?: string },
  ): Promise<Person | null> {
    const index = this.people.findIndex(
      (p) => p.id === id,
    );
    if (index === -1) return null;
    this.people[index] = {
      ...this.people[index],
      ...data,
    };
    return this.people[index];
  }

  async findPositionById(id: string): Promise<Position | null> {
    return (
      this.positions.find((pos) => pos.id === id || pos.title === id) ?? null
    );
  }

  async replaceAssignment(data: {
    personId: string;
    positionId: string;
    departmentId: string;
    assignmentType: "STAFF" | "SECONDMENT";
    validFrom: string;
    sourceRef?: string;
  }): Promise<PositionAssignment> {
    for (const assignment of this.assignments) {
      if (
        assignment.personId === data.personId &&
        isAssignmentActive(assignment, data.validFrom)
      ) {
        assignment.validTo = data.validFrom;
      }
    }
    const created: PositionAssignment = {
      id: `assign-${this.assignments.length + 1}`,
      personId: data.personId,
      positionId: data.positionId,
      departmentId: data.departmentId,
      assignmentType: data.assignmentType,
      validFrom: data.validFrom,
      validTo: null,
      sourceRef: data.sourceRef ?? null,
      sourceClass: "UNVERIFIED",
      createdAt: new Date(),
    };
    this.assignments.push(created);
    return created;
  }
}

function authMock(role: "lanh_dao" | "truong_phong" | "cong_chuc"): AuthPort {
  return {
    login: async () => {
      throw new Error("unused");
    },
    refresh: async () => {
      throw new Error("unused");
    },
    logout: async () => undefined,
    authenticate: async () => ({
      userId: "user-1",
      sessionId: "session-1",
    }),
    currentUser: async () => ({
      id: "user-1",
      email: "user@example.test",
      status: "ACTIVE",
      accountRole: role === "lanh_dao" ? "ROOT" : "USER",
      mustChangePassword: false,
      directoryActorId:
        role === "lanh_dao" ? "p-nguyen-thuong-hai" : "p-tran-hai-trieu",
    }),
    changePassword: async () => undefined,
  };
}

describe("organization HTTP routes", () => {
  it("GET /api/v1/organizations returns departments, people with assignments and traceability", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-nguyen-thuong-hai",
        name: "Nguyễn Thượng Hải",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .get("/api/v1/organizations")
      .set("Cookie", "btctu_access=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.data.departments).toHaveLength(2);
    expect(res.body.data.departments[0]).toMatchObject({
      id: "dept-1",
      name: "Phòng Tổ chức cán bộ",
      code: "TCCB",
      sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      sourceClass: "FACT",
    });
    expect(res.body.data.people).toHaveLength(2);
    expect(res.body.data.people[0]).toMatchObject({
      id: "person-1",
      name: "Nguyễn Thượng Hải",
      title: "Trưởng ban",
      role: "lanh_dao",
      departmentId: "dept-0",
    });
    expect(res.body.data.people[0].sourceClass).toBe("FACT");
  });

  it("GET /api/v1/organizations/:departmentId returns department detail and its members", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-nguyen-thuong-hai",
        name: "Nguyễn Thượng Hải",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .get("/api/v1/organizations/TCCB")
      .set("Cookie", "btctu_access=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      id: "dept-1",
      officialCode: "TCCB",
      name: "Phòng Tổ chức cán bộ",
    });
    expect(res.body.data.members).toHaveLength(1);
    expect(res.body.data.members[0]).toMatchObject({
      id: "person-2",
      name: "Trần Hải Triều",
      title: "Trưởng phòng",
      role: "truong_phong",
    });
  });

  it("GET /api/v1/organizations/:departmentId returns 404 for unknown department", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-nguyen-thuong-hai",
        name: "Nguyễn Thượng Hải",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .get("/api/v1/organizations/unknown-dept")
      .set("Cookie", "btctu_access=valid-token");

    expect(res.status).toBe(404);
    expect(res.body.type).toContain("department_not_found");
  });

  it("uses the assigned business role instead of interpreting the position title", async () => {
    const store = new MemoryOrganizationStore();
    store.positions[0] = {
      ...store.positions[0],
      title: "Nguyên Trưởng ban",
      businessRole: "cong_chuc",
    };
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "person-1",
        name: "Lãnh đạo",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .get("/api/v1/organizations")
      .set("Cookie", "btctu_access=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.data.people[0]).toMatchObject({
      title: "Nguyên Trưởng ban",
      role: "cong_chuc",
    });
  });

  it("GET /api/v1/people/:personId returns person profile and current assignment", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-nguyen-thuong-hai",
        name: "Nguyễn Thượng Hải",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .get("/api/v1/people/person-2")
      .set("Cookie", "btctu_access=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      name: "Trần Hải Triều",
      externalId: "p-tran-hai-trieu",
    });
    expect(res.body.data.currentAssignment).toMatchObject({
      departmentName: "Phòng Tổ chức cán bộ",
      positionTitle: "Trưởng phòng",
      role: "truong_phong",
      assignmentType: "STAFF",
    });
    expect(res.body.data.history).toHaveLength(1);
  });

  it("POST /api/v1/departments rejects non-leader with 403 Forbidden", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("truong_phong"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-tran-hai-trieu",
        name: "Trần Hải Triều",
        role: "truong_phong",
        departmentId: "dept-1",
      }),
    });

    const res = await request(app)
      .post("/api/v1/departments")
      .set("Cookie", "btctu_access=valid-token")
      .send({ name: "Phòng Mới" });

    expect(res.status).toBe(403);
    expect(res.body.type).toContain("forbidden");
  });

  it("allows leader to create department, update person, and assign position", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "p-nguyen-thuong-hai",
        name: "Nguyễn Thượng Hải",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    // 1. Create department
    const deptRes = await request(app)
      .post("/api/v1/departments")
      .set("Cookie", "btctu_access=valid-token")
      .send({ name: "Phòng Tổng hợp mới", officialCode: "THM" });
    expect(deptRes.status).toBe(201);
    expect(deptRes.body.data).toMatchObject({
      name: "Phòng Tổng hợp mới",
      officialCode: "THM",
    });

    // 2. Create person
    const personRes = await request(app)
      .post("/api/v1/people")
      .set("Cookie", "btctu_access=valid-token")
      .send({ name: "Lê Văn Mới", externalId: "p-le-van-moi" });
    expect(personRes.status).toBe(201);
    const newPersonId = personRes.body.data.id;

    // 3. Assign position
    const assignRes = await request(app)
      .post("/api/v1/assignments")
      .set("Cookie", "btctu_access=valid-token")
      .send({
        personId: newPersonId,
        departmentId: deptRes.body.data.id,
        positionId: "pos-2",
        assignmentType: "STAFF",
      });
    expect(assignRes.status).toBe(201);

    // 4. Verify detail via GET /api/v1/people/:personId
    const getPersonRes = await request(app)
      .get(`/api/v1/people/${newPersonId}`)
      .set("Cookie", "btctu_access=valid-token");
    expect(getPersonRes.status).toBe(200);
    expect(getPersonRes.body.data.currentAssignment).toMatchObject({
      departmentName: "Phòng Tổng hợp mới",
      positionTitle: "Trưởng phòng",
    });
  });

  it("does not allow changing an external integration ID through the people API", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "person-1",
        name: "Lãnh đạo",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .patch("/api/v1/people/person-1")
      .set("Cookie", "btctu_access=valid-token")
      .send({ externalId: "another-external-id" });

    expect(res.status).toBe(422);
    expect(store.people[0].externalId).toBe("p-nguyen-thuong-hai");
  });

  it("does not accept backdated assignments through the operational API", async () => {
    const store = new MemoryOrganizationStore();
    const app = createApp(testEnv, {
      auth: authMock("lanh_dao"),
      organizationStore: store,
      actorResolver: () => ({
        id: "person-1",
        name: "Lãnh đạo",
        role: "lanh_dao",
        departmentId: "dept-0",
      }),
    });

    const res = await request(app)
      .post("/api/v1/assignments")
      .set("Cookie", "btctu_access=valid-token")
      .send({
        personId: "person-2",
        departmentId: "dept-0",
        positionId: "pos-1",
        validFrom: "2026-01-01",
      });

    expect(res.status).toBe(422);
  });
});
