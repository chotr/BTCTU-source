import type { CreateTaskInput } from "@btctu/shared";
import { apiRequest } from "../http-client";
import { getState, pushToast, upsertTask } from "../store";
import type { TaskResult } from "../types";
import type { ApiTask } from "./contracts";
import { errorText } from "./feedback";
import { mapApiTask, qualityToApi } from "./mappers";

async function updateTask(
  path: string,
  init: RequestInit,
  successMessage: string,
): Promise<boolean> {
  try {
    const response = await apiRequest<ApiTask>(path, init);
    upsertTask(mapApiTask(response.data, getState()));
    pushToast("success", successMessage);
    return true;
  } catch (error) {
    pushToast("error", errorText("Cập nhật nhiệm vụ", error));
    return false;
  }
}

export const taskActions = {
  async createTask(input: CreateTaskInput): Promise<boolean> {
    return updateTask(
      "/api/v1/tasks",
      { method: "POST", body: JSON.stringify(input) },
      "Đã tạo nhiệm vụ",
    );
  },

  async saveResult(
    taskId: string,
    patch: Pick<TaskResult, "quantity" | "product" | "qualityLevel" | "note">,
    submit: boolean,
  ): Promise<boolean> {
    return updateTask(
      `/api/v1/tasks/${encodeURIComponent(taskId)}/result`,
      {
        method: "POST",
        body: JSON.stringify({
          quantity: patch.quantity,
          product: patch.product,
          qualityLevel: qualityToApi(patch.qualityLevel),
          note: patch.note,
          submit,
        }),
      },
      submit ? "Đã nộp kết quả" : "Đã lưu kết quả",
    );
  },

  async acceptTask(taskId: string): Promise<boolean> {
    return updateTask(
      `/api/v1/tasks/${encodeURIComponent(taskId)}/accept`,
      { method: "POST" },
      "Đã nghiệm thu nhiệm vụ",
    );
  },

  async returnTask(taskId: string, note: string): Promise<boolean> {
    return updateTask(
      `/api/v1/tasks/${encodeURIComponent(taskId)}/return`,
      { method: "POST", body: JSON.stringify({ note }) },
      "Đã trả lại nhiệm vụ",
    );
  },
};
