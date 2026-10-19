export type AppEnvironment = "development" | "staging" | "production";

function appEnvironment(value: string | undefined): AppEnvironment {
  if (value === "production" || value === "staging") return value;
  return "development";
}

const productionBuild = process.env.NODE_ENV === "production";
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
  /\/+$/,
  "",
);

export const runtimeConfig = Object.freeze({
  // Localhost is useful only while developing locally. A production build must
  // receive NEXT_PUBLIC_API_BASE_URL at build time from the deployment platform.
  apiBaseUrl:
    configuredApiBaseUrl ??
    (productionBuild ? undefined : "http://localhost:8787"),
  environment: appEnvironment(
    process.env.NEXT_PUBLIC_APP_ENV ??
      (productionBuild ? "production" : undefined),
  ),
});

export function environmentLabel(): string {
  const environment = {
    development: "Phát triển",
    staging: "Kiểm thử",
    production: "Chính thức",
  }[runtimeConfig.environment];
  return environment;
}
