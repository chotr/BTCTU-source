import { ApiError, apiRequest } from "../http-client";
import { getState, pushToast, setState } from "../store";
import type { ApiSessionUser } from "./contracts";
import { errorText } from "./feedback";
import { loadApiWorkspace } from "./workspace";

function clearSession(): void {
  setState((state) => ({
    ...state,
    user: null,
    account: null,
    passwordChangeRequired: false,
    departments: [],
    people: [],
    positions: [],
    responsibilities: [],
    catalog: [],
    activeCatalogVersion: "",
    tasks: [],
    evaluations: [],
    periods: [],
    audit: [],
    hydrated: true,
  }));
}

export const sessionActions = {
  async loginWithCredentials(
    email: string,
    password: string,
  ): Promise<{
    ok: boolean;
    message?: string;
    passwordChangeRequired?: boolean;
  }> {
    try {
      const login = await apiRequest<{
        user: ApiSessionUser;
        expiresIn: number;
      }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (login.data.user.mustChangePassword) {
        setState((state) => ({
          ...state,
          user: null,
          account: login.data.user,
          passwordChangeRequired: true,
          hydrated: true,
        }));
        return { ok: false, passwordChangeRequired: true };
      }

      await loadApiWorkspace();
      if (!getState().user) {
        const account = getState().account;
        if (
          account?.accountRole === "ROOT" ||
          account?.accountRole === "ACCOUNT_ADMIN"
        ) {
          pushToast("success", "Đã đăng nhập");
          return { ok: true };
        }
        return {
          ok: false,
          message:
            "Tài khoản đã xác thực nhưng chưa được gán hồ sơ nhân sự để sử dụng hệ thống.",
        };
      }

      pushToast("success", "Đã đăng nhập");
      return { ok: true };
    } catch (error) {
      clearSession();
      if (error instanceof ApiError) {
        if (error.status === 401) {
          return { ok: false, message: "Email hoặc mật khẩu không đúng." };
        }
        if (error.status === 403) {
          return {
            ok: false,
            message:
              "Tài khoản chưa được cấp quyền sử dụng hoặc chưa gắn với hồ sơ nhân sự.",
          };
        }
      }
      pushToast("error", errorText("Đăng nhập", error));
      return {
        ok: false,
        message: "Không thể kết nối tới hệ thống. Vui lòng thử lại sau.",
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Phiên có thể đã hết hạn.
    }
    clearSession();
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ ok: boolean; message?: string }> {
    try {
      await apiRequest("/api/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      clearSession();
      return { ok: true };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return { ok: false, message: "Mật khẩu hiện tại không đúng." };
      }
      return { ok: false, message: errorText("Đổi mật khẩu", error) };
    }
  },
};
