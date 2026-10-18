import type { Classification } from "@btctu/shared";
import { apiRequest } from "../http-client";
import { getState, pushToast, setState, upsertEvaluation } from "../store";
import type { ApiEvaluation, ApiPeriod } from "./contracts";
import { errorText } from "./feedback";
import { mapApiEvaluation, mapApiPeriod } from "./mappers";

async function updateEvaluation(
  path: string,
  body: unknown,
  successMessage: string,
): Promise<boolean> {
  try {
    const previous = getState().evaluations.find(
      (item) => item.id === path.split("/")[4],
    );
    const response = await apiRequest<ApiEvaluation>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    upsertEvaluation(mapApiEvaluation(response.data, getState(), previous));
    pushToast("success", successMessage);
    return true;
  } catch (error) {
    pushToast("error", errorText("Cập nhật hồ sơ", error));
    return false;
  }
}

export const evaluationActions = {
  async selfEvaluate(
    id: string,
    input: { comment: string; proposed: Classification },
  ): Promise<boolean> {
    return updateEvaluation(
      `/api/v1/evaluations/${encodeURIComponent(id)}/self`,
      input,
      "Đã nộp tự đánh giá",
    );
  },

  async reviewEvaluation(
    id: string,
    input: {
      comment: string;
      proposed: Classification;
      action: "propose" | "return";
    },
  ): Promise<boolean> {
    return updateEvaluation(
      `/api/v1/evaluations/${encodeURIComponent(id)}/review`,
      input,
      input.action === "propose" ? "Đã gửi đề xuất" : "Đã trả lại hồ sơ",
    );
  },

  async decideEvaluation(
    id: string,
    input: { classification: Classification; note: string },
  ): Promise<boolean> {
    return updateEvaluation(
      `/api/v1/evaluations/${encodeURIComponent(id)}/decision`,
      input,
      "Đã lưu quyết định",
    );
  },

  async lockPeriod(id: string): Promise<boolean> {
    try {
      const response = await apiRequest<ApiPeriod>(
        `/api/v1/periods/${encodeURIComponent(id)}/lock`,
        { method: "POST" },
      );
      const period = mapApiPeriod(response.data);
      setState((state) => ({
        ...state,
        periods: state.periods.map((item) =>
          item.id === period.id ? period : item,
        ),
        evaluations: state.evaluations.map((evaluation) =>
          evaluation.periodId === period.id && evaluation.status === "APPROVED"
            ? { ...evaluation, status: "LOCKED" }
            : evaluation,
        ),
      }));
      pushToast("success", "Đã khóa kỳ");
      return true;
    } catch (error) {
      pushToast("error", errorText("Khóa kỳ", error));
      return false;
    }
  },
};
