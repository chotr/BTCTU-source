import { httpServerHandler } from "cloudflare:node";
import { env as cloudflareEnv } from "cloudflare:workers";
import { createApp } from "./src/app";
import { readEnv } from "./src/env";

const config = cloudflareEnv as Record<string, string | undefined>;
const appEnv = readEnv({
  ...config,
  ENVIRONMENT: config.ENVIRONMENT ?? "production",
  CORS_ORIGINS: config.CORS_ORIGINS ?? config.CORS_ORIGIN,
  DATABASE_URL: config.DATABASE_URL,
  JWT_ACCESS_SECRET: config.JWT_ACCESS_SECRET,
  JWT_ACCESS_ISSUER: config.JWT_ACCESS_ISSUER ?? "btctu-api",
  JWT_ACCESS_AUDIENCE: config.JWT_ACCESS_AUDIENCE ?? "btctu-web",
});

const app = createApp(appEnv);
app.listen(8787);

export default httpServerHandler({ port: 8787 });
