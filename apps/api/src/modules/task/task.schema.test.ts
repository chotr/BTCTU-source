import { describe, expect, it } from "vitest";
import { resultSchema } from "./task.schema";

describe("task result schema", () => {
  it("keeps the not-met quality level distinct", () => {
    const result = resultSchema.parse({
      quantity: 1,
      product: "Báo cáo",
      qualityLevel: "D",
      note: "Không đạt yêu cầu",
      submit: true,
    });

    expect(result.qualityLevel).toBe("D");
  });
});
