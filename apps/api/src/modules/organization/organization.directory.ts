import type {
  DirectoryPerson,
  DirectoryPort,
} from "@/modules/identity/directory";
import {
  isAssignmentActive,
  type OrganizationAssignment,
  type OrganizationStore,
} from "./organization.repository";

function toDirectoryPerson(
  assignment: OrganizationAssignment,
): DirectoryPerson {
  return {
    id: assignment.personId,
    name: assignment.personName,
    title: assignment.positionTitle,
    role: assignment.role,
    departmentId: assignment.departmentId,
  };
}

export class OrganizationDirectory implements DirectoryPort {
  constructor(private readonly store: OrganizationStore) {}

  async findById(id: string): Promise<DirectoryPerson | null> {
    const person = await this.store.findPersonById(id);
    if (!person) return null;

    const today = new Date().toISOString().slice(0, 10);
    const assignments = await this.store.listAssignmentsByPerson(person.id);
    const current = assignments.find((assignment) =>
      isAssignmentActive(assignment, today),
    );
    return current ? toDirectoryPerson(current) : null;
  }

  async list(): Promise<DirectoryPerson[]> {
    const assignments = await this.store.listCurrentAssignments();
    return [
      ...new Map(
        assignments.map((assignment) => {
          const person = toDirectoryPerson(assignment);
          return [person.id, person];
        }),
      ).values(),
    ];
  }
}
