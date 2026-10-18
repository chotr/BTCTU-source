import { describe, expect, it } from "vitest";
import { isAssignmentActive } from "./organization.repository";

describe("assignment effective period", () => {
  it("uses an exclusive end date", () => {
    expect(
      isAssignmentActive(
        { validFrom: "2026-01-01", validTo: "2026-10-18" },
        "2026-10-18",
      ),
    ).toBe(false);
  });

  it("does not activate a future assignment", () => {
    expect(
      isAssignmentActive(
        { validFrom: "2026-10-19", validTo: null },
        "2026-10-18",
      ),
    ).toBe(false);
  });
});
