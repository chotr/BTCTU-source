import { Router, type NextFunction, type Request, type Response } from "express";
import { ROLES } from "@btctu/shared";
import { formatIssues, problem } from "@/shared/problem";
import type { OrganizationStore } from "./organization.repository";
import {
  assignPositionSchema,
  createDepartmentSchema,
  createPersonSchema,
  updateDepartmentSchema,
  updatePersonSchema,
} from "./organization.schema";

export type OrganizationRouterOptions = {
  store: OrganizationStore;
};

function requireLeader(req: Request, res: Response, next: NextFunction): void {
  if (req.actor?.role === ROLES.lanhDao) {
    next();
    return;
  }
  problem(
    req,
    res,
    403,
    "Forbidden",
    "Chỉ Lãnh đạo Ban mới có quyền cập nhật danh mục tổ chức.",
    "forbidden",
  );
}

export function createOrganizationRouter(options: OrganizationRouterOptions): Router {
  const router = Router();
  const store = options.store;

  router.get("/organizations", async (req, res, next) => {
    try {
      const [depts, assignments] = await Promise.all([
        store.listDepartments(),
        store.listCurrentAssignments(),
      ]);

      if (depts.length === 0 && req.state) {
        res.json({
          data: {
            departments: req.state.departments,
            people: req.state.people,
          },
          meta: { sourceRef: "QĐ 01, Điều 2–7" },
        });
        return;
      }

      const departments = depts.map((d) => ({
        id: d.id,
        code: d.officialCode ?? d.shortName ?? d.id,
        name: d.name,
        shortName: d.shortName ?? d.name,
        officialCode: d.officialCode,
        sourceRef: "01-QĐ/BTCTU, Điều 2–6",
      }));

      const people = assignments.map((a) => ({
        id: a.externalId ?? a.personId,
        personId: a.personId,
        name: a.personName,
        title: a.positionTitle,
        role: a.role,
        departmentId: a.departmentId,
        departmentCode: a.departmentCode,
        positionRefId: a.positionId,
        assignmentType: a.assignmentType,
        sourceRef: a.sourceRef ?? "01-QĐ/BTCTU, Điều 7",
      }));

      res.json({
        data: { departments, people },
        meta: {
          sourceRef: "01-QĐ/BTCTU, Điều 2–7",
          sourceClass: "FACT",
          totalDepartments: departments.length,
          totalPeople: people.length,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/organizations/:departmentId", async (req, res, next) => {
    try {
      const dept = await store.findDepartmentById(req.params.departmentId);
      if (!dept) {
        problem(
          req,
          res,
          404,
          "Not found",
          "Department does not exist.",
          "department_not_found",
        );
        return;
      }

      const members = await store.listAssignmentsByDepartment(dept.id);

      res.json({
        data: {
          id: dept.id,
          code: dept.officialCode ?? dept.shortName ?? dept.id,
          name: dept.name,
          shortName: dept.shortName,
          officialCode: dept.officialCode,
          sourceRef: "01-QĐ/BTCTU, Điều 2–6",
          members: members.map((m) => ({
            id: m.externalId ?? m.personId,
            personId: m.personId,
            name: m.personName,
            title: m.positionTitle,
            role: m.role,
            assignmentType: m.assignmentType,
            positionId: m.positionId,
            validFrom: m.validFrom,
            validTo: m.validTo,
            sourceRef: m.sourceRef,
          })),
        },
        meta: {
          sourceRef: "01-QĐ/BTCTU, Điều 2–7",
          totalMembers: members.length,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/people/:personId", async (req, res, next) => {
    try {
      const person = await store.findPersonById(req.params.personId);
      if (!person) {
        problem(
          req,
          res,
          404,
          "Not found",
          "Person does not exist.",
          "person_not_found",
        );
        return;
      }

      const history = await store.listAssignmentsByPerson(person.id);
      const today = new Date().toISOString().slice(0, 10);
      const currentAssignment =
        history.find((a) => !a.validTo || a.validTo >= today) ??
        history[0] ??
        null;

      res.json({
        data: {
          id: person.id,
          name: person.name,
          externalId: person.externalId,
          sourceRef: person.sourceRef ?? "01-QĐ/BTCTU, Điều 2–7",
          currentAssignment: currentAssignment
            ? {
                assignmentId: currentAssignment.assignmentId,
                departmentId: currentAssignment.departmentId,
                departmentName: currentAssignment.departmentName,
                departmentCode: currentAssignment.departmentCode,
                positionId: currentAssignment.positionId,
                positionTitle: currentAssignment.positionTitle,
                role: currentAssignment.role,
                assignmentType: currentAssignment.assignmentType,
                validFrom: currentAssignment.validFrom,
                validTo: currentAssignment.validTo,
                sourceRef: currentAssignment.sourceRef,
              }
            : null,
          history: history.map((h) => ({
            assignmentId: h.assignmentId,
            departmentId: h.departmentId,
            departmentName: h.departmentName,
            departmentCode: h.departmentCode,
            positionId: h.positionId,
            positionTitle: h.positionTitle,
            role: h.role,
            assignmentType: h.assignmentType,
            validFrom: h.validFrom,
            validTo: h.validTo,
            sourceRef: h.sourceRef,
          })),
        },
        meta: {
          sourceRef: person.sourceRef ?? "01-QĐ/BTCTU, Điều 2–7",
        },
      });
    } catch (error) {
      next(error);
    }
  });

  const handleCreateDept = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = createDepartmentSchema.safeParse(req.body);
    if (!parsed.success) {
      problem(req, res, 422, "Validation failed", formatIssues(parsed.error), "validation_failed");
      return;
    }
    try {
      const dept = await store.createDepartment(parsed.data);
      res.status(201).json({ data: dept });
    } catch (error) {
      next(error);
    }
  };
  router.post("/departments", requireLeader, handleCreateDept);
  router.post("/organizations/departments", requireLeader, handleCreateDept);

  const handleUpdateDept = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = updateDepartmentSchema.safeParse(req.body);
    if (!parsed.success) {
      problem(req, res, 422, "Validation failed", formatIssues(parsed.error), "validation_failed");
      return;
    }
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const dept = await store.updateDepartment(id, parsed.data);
      if (!dept) {
        problem(req, res, 404, "Not found", "Department does not exist.", "department_not_found");
        return;
      }
      res.json({ data: dept });
    } catch (error) {
      next(error);
    }
  };
  router.patch("/departments/:id", requireLeader, handleUpdateDept);
  router.patch("/organizations/departments/:id", requireLeader, handleUpdateDept);

  router.post("/people", requireLeader, async (req, res, next) => {
    const parsed = createPersonSchema.safeParse(req.body);
    if (!parsed.success) {
      problem(req, res, 422, "Validation failed", formatIssues(parsed.error), "validation_failed");
      return;
    }
    try {
      const person = await store.createPerson(parsed.data);
      res.status(201).json({ data: person });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/people/:id", requireLeader, async (req, res, next) => {
    const parsed = updatePersonSchema.safeParse(req.body);
    if (!parsed.success) {
      problem(req, res, 422, "Validation failed", formatIssues(parsed.error), "validation_failed");
      return;
    }
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const person = await store.updatePerson(id, parsed.data);
      if (!person) {
        problem(req, res, 404, "Not found", "Person does not exist.", "person_not_found");
        return;
      }
      res.json({ data: person });
    } catch (error) {
      next(error);
    }
  });

  router.post("/assignments", requireLeader, async (req, res, next) => {
    const parsed = assignPositionSchema.safeParse(req.body);
    if (!parsed.success) {
      problem(req, res, 422, "Validation failed", formatIssues(parsed.error), "validation_failed");
      return;
    }
    try {
      const [person, dept, pos] = await Promise.all([
        store.findPersonById(parsed.data.personId),
        store.findDepartmentById(parsed.data.departmentId),
        store.findPositionById(parsed.data.positionId),
      ]);
      if (!person) {
        problem(req, res, 404, "Not found", "Person does not exist.", "person_not_found");
        return;
      }
      if (!dept) {
        problem(req, res, 404, "Not found", "Department does not exist.", "department_not_found");
        return;
      }
      if (!pos) {
        problem(req, res, 404, "Not found", "Position does not exist.", "position_not_found");
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      await store.endActiveAssignments(person.id, today);
      const assignment = await store.createAssignment({
        personId: person.id,
        departmentId: dept.id,
        positionId: pos.id,
        assignmentType: parsed.data.assignmentType,
        validFrom: parsed.data.validFrom ?? today,
        sourceRef: parsed.data.sourceRef ?? "01-QĐ/BTCTU, Điều 7",
      });
      res.status(201).json({ data: assignment });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
