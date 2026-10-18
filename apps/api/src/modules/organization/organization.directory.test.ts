import { describe, expect, it } from "vitest";
import type { OrganizationStore } from "./organization.repository";
import { OrganizationDirectory } from "./organization.directory";

describe("OrganizationDirectory", () => {
  it("uses the internal person UUID, not the external integration ID", async () => {
    const store = {
      listCurrentAssignments: async () => [
        {
          assignmentId: "assignment-1",
          personId: "person-uuid",
          personName: "Nguyễn Văn A",
          externalId: "external-person-a",
          positionId: "position-1",
          positionTitle: "Nguyên Trưởng ban",
          departmentId: "department-1",
          departmentName: "Phòng Tổ chức",
          departmentCode: "TCCB",
          role: "cong_chuc" as const,
          assignmentType: "STAFF" as const,
          validFrom: "2026-01-01",
          validTo: null,
        },
      ],
    } as OrganizationStore;
    const directory = new OrganizationDirectory(store);

    expect(await directory.list()).toEqual([
      {
        id: "person-uuid",
        name: "Nguyễn Văn A",
        title: "Nguyên Trưởng ban",
        role: "cong_chuc",
        departmentId: "department-1",
      },
    ]);
  });
});
