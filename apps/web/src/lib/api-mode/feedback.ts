import { ApiError } from "../http-client";
import { pushToast } from "../store";

export function errorText(action: string, error: unknown): string {
  const requestId =
    error instanceof ApiError && error.requestId
      ? ` Mã yêu cầu: ${error.requestId}.`
      : "";
  return `${action} không thành công.${requestId}`;
}

export function unsupported(): false {
  pushToast("error", "API chưa hỗ trợ thao tác này.");
  return false;
}

export function unsupportedMasterData(): never {
  throw new Error("API chưa hỗ trợ thao tác này.");
}
