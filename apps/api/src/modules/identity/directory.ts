import type { Actor, Person } from "@/types";

export type DirectoryPerson = Actor & {
  title: string;
};

export interface DirectoryPort {
  findById(id: string): Promise<DirectoryPerson | null>;
  list(): Promise<DirectoryPerson[]>;
}

export function createStateDirectory(people: Person[]): DirectoryPort {
  const rows = people.map((person) => ({
    id: person.id,
    name: person.name,
    title: person.title,
    role: person.role,
    departmentId: person.departmentId,
  }));

  return {
    findById: async (id) => rows.find((person) => person.id === id) ?? null,
    list: async () => rows,
  };
}
