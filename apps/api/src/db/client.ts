import { AsyncLocalStorage } from "node:async_hooks";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { RequestHandler } from "express";
import * as schema from "./schema";
import { normalizePostgresUrl } from "../env";

export type Database = ReturnType<typeof createDatabase>;
type RequestDatabase = {
  database: Database;
  middleware: RequestHandler;
};

export function createDatabase(
  connectionString: string,
  options: { max?: number } = {},
) {
  return drizzle({
    client: new Pool({
      connectionString: normalizePostgresUrl(connectionString),
      max: options.max ?? 10,
    }),
    schema,
  });
}

/**
 * Cloudflare Workers do not allow database sockets to be reused across request
 * invocations. Keep one lazy pg pool per HTTP request and expose its Drizzle
 * instance through AsyncLocalStorage so repositories can remain request-agnostic.
 */
export function createRequestDatabase(
  connectionString: string,
): RequestDatabase {
  const normalizedConnectionString = normalizePostgresUrl(connectionString);
  const storage = new AsyncLocalStorage<Database>();

  const database = new Proxy({} as Database, {
    get(_target, property) {
      const current = storage.getStore();
      if (!current) {
        throw new Error("Database accessed outside an HTTP request");
      }

      const value = Reflect.get(current, property, current);
      return typeof value === "function" ? value.bind(current) : value;
    },
  });

  const middleware: RequestHandler = (_req, res, next) => {
    const pool = new Pool({
      connectionString: normalizedConnectionString,
      max: 1,
    });
    const current = drizzle({ client: pool, schema });
    let closed = false;

    const close = () => {
      if (closed) return;
      closed = true;
      void pool.end().catch((error: unknown) => {
        console.error(
          JSON.stringify({
            scope: "database",
            event: "pool_close_failed",
            error: error instanceof Error ? error.message : String(error),
          }),
        );
      });
    };

    res.once("finish", close);
    res.once("close", close);
    storage.run(current, next);
  };

  return { database, middleware };
}
