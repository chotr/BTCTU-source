import type {
  Classification,
  EvaluationStatus,
  Role,
  TaskResultQualityLevel,
} from "@btctu/shared";
import { TASK_STATUSES } from "@btctu/shared";

export type ApiActor = {
  id: string;
  name: string;
  role: Role;
  departmentId: string | null;
};

export type ApiSessionUser = {
  id: string;
  email: string;
  accountRole: "USER" | "ACCOUNT_ADMIN" | "ROOT";
  mustChangePassword: boolean;
};

export type ApiDepartment = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  sourceRef: string | null;
  sourceClass: string;
};

export type ApiPerson = {
  id: string;
  name: string;
  title: string;
  role: Role;
  departmentId: string;
  positionRefId: string;
  sourceRef: string | null;
  sourceClass: string;
};

export type ApiCatalogItem = {
  id: string;
  version: string;
  title: string;
  departmentId: string;
  standardScore: number;
  coefficient: number;
  durationDays: number;
  sourceRef: string;
};

export type ApiTaskResult = {
  quantity: number;
  product: string;
  qualityLevel: TaskResultQualityLevel;
  note: string;
  submittedAt: string | null;
};

export type ApiTask = {
  id: string;
  title: string;
  description: string;
  catalogItemId: string;
  departmentId: string;
  assigneeId: string;
  assignerId: string;
  periodId: string;
  plannedQuantity: number;
  dueAt: string;
  status: (typeof TASK_STATUSES)[number];
  progress: number;
  result: ApiTaskResult | null;
};

export type ApiEvaluation = {
  id: string;
  periodId: string;
  subjectId: string;
  departmentId: string;
  status: EvaluationStatus;
  score: number;
  classification: Classification;
  blockerCount: number;
  selfComment: string | null;
  selfEvaluatedAt: string | null;
  reviewComment: string | null;
  reviewerId: string | null;
  reviewedAt: string | null;
  decisionNote: string | null;
  decidedById: string | null;
  decidedAt: string | null;
};

export type ApiPeriod = {
  id: string;
  label: string;
  lockedAt: string | null;
};

export type ApiAuditEvent = {
  id: string;
  requestId: string;
  actorId: string;
  action: string;
  resource: string;
  outcome: "SUCCESS" | "DENIED" | "FAILED";
  detail: string;
  at: string;
};

export type ApiReportSummary = {
  period: ApiPeriod;
};

export type ApiOrganization = {
  departments: ApiDepartment[];
  people: ApiPerson[];
};
