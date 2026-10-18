import { exportReport } from "../exports";
import { PROFILES, previewPayload } from "../integration";
import { catalogCsvTemplate, previewCatalogCsv } from "../master-data";
import { pushToast } from "../store";
import type { AppUser } from "../types";
import { evaluationActions } from "./evaluation-actions";
import { errorText, unsupported } from "./feedback";
import { organizationActions } from "./organization-actions";
import { sessionActions } from "./session-actions";
import { taskActions } from "./task-actions";
import { loadApiWorkspace } from "./workspace";

export const apiModeActions = {
  ...sessionActions,
  ...taskActions,
  ...evaluationActions,
  ...organizationActions,

  async resetWorkspace(): Promise<void> {
    try {
      await loadApiWorkspace();
      pushToast("success", "Đã tải lại dữ liệu từ API");
    } catch (error) {
      pushToast("error", errorText("Tải lại dữ liệu", error));
    }
  },

  updateProgress: async (): Promise<boolean> => unsupported(),
  addEvidence: async (): Promise<boolean> => unsupported(),
  removeEvidence: async (): Promise<boolean> => unsupported(),
  reassignTask: async (): Promise<boolean> => unsupported(),
  cancelTask: async (): Promise<boolean> => unsupported(),
  createEvaluation: async (): Promise<null> => {
    unsupported();
    return null;
  },
  calculateEvaluation: async (): Promise<boolean> => unsupported(),
  updateConditions: async (): Promise<boolean> => unsupported(),
  reopenPeriod: async (): Promise<boolean> => unsupported(),
  createPeriod: async (): Promise<boolean> => unsupported(),
  saveMappings: (): boolean => unsupported(),
  simulateSync: async (): Promise<boolean> => unsupported(),
  exportReport,
  catalogTemplate: catalogCsvTemplate,
  previewCatalogCsv,
  profiles: PROFILES,
  previewPayload,
  accounts: (): AppUser[] => [],
  login: async (): Promise<boolean> => unsupported(),
  deniedAccess: async (resource: string): Promise<void> => {
    pushToast("error", `Không có quyền truy cập: ${resource}`);
  },
};
