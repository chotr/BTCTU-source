import { ApiError, apiRequest } from "../http-client";
import { setState } from "../store";
import type {
  ApiActor,
  ApiAuditEvent,
  ApiCatalogItem,
  ApiEvaluation,
  ApiOrganization,
  ApiReportSummary,
  ApiSessionUser,
  ApiTask,
} from "./contracts";
import {
  mapApiAuditEvent,
  mapApiCatalogItem,
  mapApiDepartment,
  mapApiEvaluation,
  mapApiPeriod,
  mapApiPerson,
  mapApiPositions,
  mapApiTask,
} from "./mappers";

async function loadAudit(): Promise<ApiAuditEvent[]> {
  try {
    return (await apiRequest<ApiAuditEvent[]>("/api/v1/audit")).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) return [];
    throw error;
  }
}

function clearWorkspace(
  account: ApiSessionUser | null,
  passwordChangeRequired: boolean,
): void {
  setState((state) => ({
    ...state,
    user: null,
    account,
    passwordChangeRequired,
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
    storageError: null,
  }));
}

async function loadActor(): Promise<ApiActor | null> {
  try {
    return (await apiRequest<ApiActor>("/api/v1/me")).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearWorkspace(null, false);
      return null;
    }

    if (
      error instanceof ApiError &&
      error.status === 403 &&
      (error.code === "password_change_required" ||
        error.code === "actor_not_provisioned")
    ) {
      const session = await apiRequest<{ user: ApiSessionUser }>(
        "/api/v1/auth/session",
      );
      clearWorkspace(
        session.data.user,
        error.code === "password_change_required",
      );
      return null;
    }

    throw error;
  }
}

export async function loadApiWorkspace(): Promise<void> {
  const actor = await loadActor();
  if (!actor) return;

  const [
    organizationResponse,
    catalogResponse,
    taskResponse,
    evaluationResponse,
    summaryResponse,
    audit,
    sessionResponse,
  ] = await Promise.all([
    apiRequest<ApiOrganization>("/api/v1/organizations"),
    apiRequest<ApiCatalogItem[]>("/api/v1/catalog"),
    apiRequest<ApiTask[]>("/api/v1/tasks"),
    apiRequest<ApiEvaluation[]>("/api/v1/evaluations"),
    apiRequest<ApiReportSummary>("/api/v1/reports/summary"),
    loadAudit(),
    apiRequest<{ user: ApiSessionUser }>("/api/v1/auth/session"),
  ]);

  const organization = organizationResponse.data;
  const catalogData = catalogResponse.data ?? [];
  const taskData = taskResponse.data ?? [];
  const evaluationData = evaluationResponse.data ?? [];
  const publishedVersion =
    typeof catalogResponse.meta?.publishedVersion === "string"
      ? catalogResponse.meta.publishedVersion
      : (catalogData[0]?.version ?? "");

  const people = organization.people.map(mapApiPerson);
  const departments = organization.departments.map((department) =>
    mapApiDepartment(department, organization.people),
  );
  const catalog = catalogData.map((item) =>
    mapApiCatalogItem(item, publishedVersion),
  );
  const periods = [mapApiPeriod(summaryResponse.data.period)];
  const taskContext = { catalog, departments, people, periods };

  setState((state) => ({
    ...state,
    user: {
      ...actor,
      title:
        organization.people.find((person) => person.id === actor.id)?.title ??
        "",
      departmentName:
        departments.find((department) => department.id === actor.departmentId)
          ?.name ?? null,
    },
    account: sessionResponse.data.user,
    passwordChangeRequired: false,
    departments,
    people,
    positions: mapApiPositions(organization.people),
    responsibilities: [],
    catalog,
    activeCatalogVersion: publishedVersion,
    tasks: taskData.map((task) => mapApiTask(task, taskContext)),
    periods,
    evaluations: evaluationData.map((evaluation) =>
      mapApiEvaluation(evaluation, { people }),
    ),
    audit: audit.map(mapApiAuditEvent),
    hydrated: true,
    storageError: null,
  }));
}
