import { ROLES, type TaskResultQualityLevel } from "@btctu/shared";
import type { AppState } from "../store";
import type {
  AuditEvent,
  CatalogItem,
  Department,
  Evaluation,
  EvaluationPeriod,
  Person,
  PositionRef,
  Task,
  TaskResult,
} from "../types";
import type {
  ApiAuditEvent,
  ApiCatalogItem,
  ApiDepartment,
  ApiEvaluation,
  ApiPeriod,
  ApiPerson,
  ApiTask,
  ApiTaskResult,
} from "./contracts";

export function qualityToApi(value: string): ApiTaskResult["qualityLevel"] {
  const mapped: Record<string, TaskResultQualityLevel> = {
    "Đáp ứng tốt": "A",
    "Đáp ứng": "B",
    "Cần hoàn thiện": "C",
    "Không đáp ứng": "D",
  };
  const quality = mapped[value];
  if (!quality) {
    throw new Error("Mức chất lượng không được hỗ trợ.");
  }
  return quality;
}

function qualityFromApi(value: ApiTaskResult["qualityLevel"]): string {
  return {
    A: "Đáp ứng tốt",
    B: "Đáp ứng",
    C: "Cần hoàn thiện",
    D: "Không đáp ứng",
  }[value];
}

export function mapApiCatalogItem(
  item: ApiCatalogItem,
  publishedVersion: string,
): CatalogItem {
  const complexity =
    item.coefficient >= 1.1
      ? "Cao"
      : item.coefficient < 0.9
        ? "Thấp"
        : "Trung bình";

  return {
    id: item.id,
    version: item.version,
    code: item.id.toUpperCase(),
    name: item.title,
    product: item.title,
    unit: "sản phẩm",
    complexity,
    standardScore: item.standardScore,
    coefficient: item.coefficient,
    durationDays: item.durationDays,
    sourceRef: item.sourceRef,
    status: item.version === publishedVersion ? "PUBLISHED" : "DRAFT",
  };
}

export function mapApiDepartment(
  item: ApiDepartment,
  people: ApiPerson[],
): Department {
  return {
    ...item,
    functionText: "API chưa cung cấp mô tả chức năng.",
    headId:
      people.find(
        (person) =>
          person.departmentId === item.id && person.role === ROLES.truongPhong,
      )?.id ?? "",
    responsibilityIds: [],
  };
}

export function mapApiPerson(item: ApiPerson): Person {
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    role: item.role,
    departmentId: item.departmentId,
    positionRefId: item.positionRefId,
    assignmentType: item.assignmentType,
    sourceRef: item.sourceRef,
    sourceClass: item.sourceClass,
  };
}

export function mapApiPositions(people: ApiPerson[]): PositionRef[] {
  return [
    ...new Map(
      people.map((person) => [
        person.positionRefId,
        {
          id: person.positionRefId,
          title: person.title,
          scope: "Danh mục do API cung cấp",
        },
      ]),
    ).values(),
  ];
}

export function mapApiPeriod(period: ApiPeriod): EvaluationPeriod {
  return {
    id: period.id,
    name: period.label,
    range: period.label,
    status: period.lockedAt ? "LOCKED" : "ACTIVE",
    lockedAt: period.lockedAt,
  };
}

type TaskContext = Pick<
  AppState,
  "catalog" | "departments" | "people" | "periods"
>;

export function mapApiTask(task: ApiTask, state: TaskContext): Task {
  const catalog = state.catalog.find((item) => item.id === task.catalogItemId);
  const person = state.people.find((item) => item.id === task.assigneeId);
  const department = state.departments.find(
    (item) => item.id === task.departmentId,
  );
  const period = task.periodId
    ? state.periods.find((item) => item.id === task.periodId)
    : undefined;
  const result: TaskResult | null = task.result
    ? {
        quantity: task.result.quantity,
        unit: catalog?.unit ?? "sản phẩm",
        product: task.result.product,
        qualityLevel: qualityFromApi(task.result.qualityLevel),
        note: task.result.note,
        submittedAt: task.result.submittedAt ?? "",
      }
    : null;

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    catalogItemId: task.catalogItemId,
    departmentId: task.departmentId,
    assigneeId: task.assigneeId,
    assignerId: task.assignerId,
    positionRefId: person?.positionRefId ?? "",
    period: period?.name ?? "",
    periodId: task.periodId,
    plannedQuantity: task.plannedQuantity,
    catalogSnapshot: catalog
      ? {
          id: catalog.id,
          version: catalog.version,
          code: catalog.code,
          name: catalog.name,
          product: catalog.product,
          unit: catalog.unit,
          standardScore: catalog.standardScore,
          coefficient: catalog.coefficient,
          durationDays: catalog.durationDays,
          sourceRef: catalog.sourceRef,
        }
      : undefined,
    assignmentSnapshot: {
      assigneeName: person?.name ?? task.assigneeId,
      positionTitle: person?.title ?? "",
      departmentName: department?.name ?? task.departmentId,
      assignedAt: null,
    },
    dueAt: task.dueAt,
    status: task.status,
    progress: task.progress,
    result,
    evidence: [],
    history: [],
    evidenceLoaded: false,
    historyLoaded: false,
  };
}

export function mapApiEvaluation(
  evaluation: ApiEvaluation,
  state: Pick<AppState, "people">,
  previous?: Evaluation,
): Evaluation {
  const person = state.people.find((item) => item.id === evaluation.subjectId);
  const isLeader =
    person?.role === ROLES.truongPhong || person?.role === ROLES.lanhDao;
  const base: Evaluation =
    previous ??
    ({
      id: evaluation.id,
      periodId: evaluation.periodId,
      subjectId: evaluation.subjectId,
      subjectType: "PERSON",
      departmentId: evaluation.departmentId,
      status: evaluation.status,
      isLeader,
      generalScore: null,
      generalMax: 30,
      axes: [],
      calc: {
        ruleVersion: "api",
        formulaText: "API chưa cung cấp thành phần điểm",
        kpiText: "Tổng điểm do API cung cấp",
        averageAxes: null,
        textTotal: evaluation.score,
        arithmeticTotal: evaluation.score,
        note: null,
      },
      self: null,
      review: null,
      decision: null,
      conditions: [],
      history: [],
    } satisfies Evaluation);

  return {
    ...base,
    periodId: evaluation.periodId,
    subjectId: evaluation.subjectId,
    departmentId: evaluation.departmentId,
    status: evaluation.status,
    isLeader: base.isLeader,
    generalScore: base.generalScore,
    calc: {
      ...base.calc,
      textTotal: evaluation.score,
      arithmeticTotal: evaluation.score,
    },
    self: evaluation.selfComment
      ? {
          comment: evaluation.selfComment,
          proposed: evaluation.classification,
          at: evaluation.selfEvaluatedAt,
        }
      : null,
    review: evaluation.reviewComment
      ? {
          comment: evaluation.reviewComment,
          proposed: evaluation.classification,
          reviewerId: evaluation.reviewerId ?? "",
          at: evaluation.reviewedAt ?? "",
        }
      : null,
    decision: evaluation.decisionNote
      ? {
          classification: evaluation.classification,
          decidedById: evaluation.decidedById ?? "",
          at: evaluation.decidedAt ?? "",
          note: evaluation.decisionNote,
        }
      : null,
    conditions: [
      {
        id: "api-blockers",
        label: "Điều kiện chặn",
        detail:
          evaluation.blockerCount > 0
            ? `${evaluation.blockerCount} điều kiện chưa đạt`
            : "Không có điều kiện chặn",
        passed: evaluation.blockerCount === 0,
        blocking: true,
      },
    ],
  };
}

export function mapApiAuditEvent(event: ApiAuditEvent): AuditEvent {
  return {
    ...event,
    outcome:
      event.outcome === "SUCCESS"
        ? "OK"
        : event.outcome === "FAILED"
          ? "FAILED"
          : "DENIED",
  };
}
