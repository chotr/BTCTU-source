export type CreateTaskInput = {
  catalogItemId: string;
  assigneeId: string;
  periodId: string;
  plannedQuantity: number;
  title: string;
  description?: string;
  dueAt: string;
};

export const TASK_RESULT_QUALITY_LEVELS = ["A", "B", "C", "D"] as const;

export type TaskResultQualityLevel =
  (typeof TASK_RESULT_QUALITY_LEVELS)[number];
