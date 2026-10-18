import { apiRequest } from "../http-client";
import { getState, pushToast } from "../store";
import type { Department, Person } from "../types";
import { errorText, unsupportedMasterData } from "./feedback";
import { loadApiWorkspace } from "./workspace";

export const organizationActions = {
  async saveDepartment(
    input: Omit<Department, "id" | "responsibilityIds"> & { id?: string },
    _reason: string,
  ): Promise<void> {
    try {
      if (input.id) {
        await apiRequest(
          `/api/v1/departments/${encodeURIComponent(input.id)}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: input.name,
              shortName: input.shortName,
              officialCode: input.code,
            }),
          },
        );
      } else {
        await apiRequest("/api/v1/departments", {
          method: "POST",
          body: JSON.stringify({
            name: input.name,
            shortName: input.shortName,
            officialCode: input.code,
          }),
        });
      }
      await loadApiWorkspace();
      pushToast("success", "Đã lưu đơn vị");
    } catch (error) {
      pushToast("error", errorText("Lưu đơn vị", error));
      throw error;
    }
  },

  async removeDepartment(_id: string, _reason: string): Promise<void> {
    pushToast(
      "error",
      "Hệ thống bảo toàn lịch sử tổ chức, không hỗ trợ xóa cứng đơn vị.",
    );
  },

  async savePerson(
    input: Omit<Person, "id"> & { id?: string },
    _reason: string,
  ): Promise<void> {
    try {
      let personId = input.id;
      const current = input.id
        ? getState().people.find((person) => person.id === input.id)
        : undefined;
      if (personId) {
        await apiRequest(`/api/v1/people/${encodeURIComponent(personId)}`, {
          method: "PATCH",
          body: JSON.stringify({ name: input.name }),
        });
      } else {
        const response = await apiRequest<{ id: string }>("/api/v1/people", {
          method: "POST",
          body: JSON.stringify({ name: input.name }),
        });
        personId = response.data.id;
      }

      const assignmentChanged =
        !current ||
        current.departmentId !== input.departmentId ||
        current.positionRefId !== input.positionRefId;
      if (assignmentChanged && input.departmentId && input.positionRefId) {
        await apiRequest("/api/v1/assignments", {
          method: "POST",
          body: JSON.stringify({
            personId,
            departmentId: input.departmentId,
            positionId: input.positionRefId,
            assignmentType:
              input.assignmentType ?? current?.assignmentType ?? "STAFF",
          }),
        });
      }
      await loadApiWorkspace();
      pushToast("success", "Đã lưu nhân sự");
    } catch (error) {
      pushToast("error", errorText("Lưu nhân sự", error));
      throw error;
    }
  },

  async removePerson(_id: string, _reason: string): Promise<void> {
    pushToast(
      "error",
      "Hệ thống bảo toàn lịch sử nhân sự, không hỗ trợ xóa cứng nhân sự.",
    );
  },

  savePosition: unsupportedMasterData,
  removePosition: unsupportedMasterData,
  saveResponsibility: unsupportedMasterData,
  removeResponsibility: unsupportedMasterData,
  saveCatalog: unsupportedMasterData,
  removeCatalog: unsupportedMasterData,
  duplicateVersion: unsupportedMasterData,
  publishVersion: unsupportedMasterData,
  importCatalog: unsupportedMasterData,
};
