"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui";
import type { AppState } from "@/lib/store";
import { isApiWorkspace } from "@/lib/workspace-runtime";
import { apiRequest } from "@/lib/http-client";

type MembershipHistory = {
  departmentId: string;
  positionRefId: string;
  at: string;
  reason: string;
};

type ApiAssignmentHistory = {
  assignmentId: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  role: string;
  assignmentType: string;
  validFrom: string | null;
  validTo: string | null;
  sourceRef: string | null;
  sourceClass: string;
};

/** Modal lịch sử thành viên của một nhân sự. */
export function HistoryModal({
  personId,
  state,
  onClose,
}: {
  personId: string | null;
  state: AppState;
  onClose: () => void;
}) {
  const [apiHistory, setApiHistory] = useState<ApiAssignmentHistory[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!personId || !isApiWorkspace()) {
      setApiHistory(null);
      return;
    }
    let active = true;
    setLoading(true);
    apiRequest<{
      id: string;
      name: string;
      history: ApiAssignmentHistory[];
    }>(`/api/v1/people/${personId}`)
      .then((res) => {
        if (active) setApiHistory(res.data.history);
      })
      .catch(() => {
        if (active) setApiHistory([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [personId]);

  const mockHistory =
    (
      state.people.find((p) => p.id === personId) as
        | { membershipHistory?: MembershipHistory[] }
        | undefined
    )?.membershipHistory ?? [];

  return (
    <Modal
      open={personId !== null}
      title="Lịch sử vị trí / đơn vị"
      onClose={onClose}
    >
      {loading ? (
        <p className="text-xs text-ink-3">Đang tải lịch sử phân công…</p>
      ) : isApiWorkspace() ? (
        apiHistory && apiHistory.length > 0 ? (
          apiHistory.map((h) => (
            <div key={h.assignmentId} className="bg-fill p-3 text-xs">
              <p className="font-medium text-ink">
                {h.departmentName} · {h.positionTitle}
              </p>
              <p className="mt-1 text-ink-3">
                Thời gian:{" "}
                {h.validFrom
                  ? `${h.validFrom} → ${h.validTo ?? "Hiện tại"}`
                  : h.validTo
                    ? `Đến ${h.validTo}`
                    : "Đang công tác"}
                {h.assignmentType === "SECONDMENT" ? " (Biệt phái)" : ""}
              </p>
              {h.sourceRef && (
                <p className="mt-0.5 text-[11px] text-ink-3">
                  Căn cứ: {h.sourceRef}
                </p>
              )}
              {h.sourceClass === "UNVERIFIED" && (
                <p className="mt-0.5 text-[11px] text-warn-700">
                  Nguồn chưa được xác minh
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-ink-3">
            Chưa có lịch sử thay đổi vị trí công tác.
          </p>
        )
      ) : (
        mockHistory.map((h, i) => (
          <div key={i} className="bg-fill p-3 text-xs">
            <p>
              {state.departments.find((d) => d.id === h.departmentId)?.name} ·{" "}
              {state.positions.find((p) => p.id === h.positionRefId)?.title}
            </p>
            <p className="mt-1 text-ink-3">
              {h.at} · {h.reason}
            </p>
          </div>
        ))
      )}
      <p className="text-xs text-ink-3">
        Dữ liệu phân công và điều động được quản lý tập trung và bảo toàn theo
        từng mốc thời gian.
      </p>
    </Modal>
  );
}
