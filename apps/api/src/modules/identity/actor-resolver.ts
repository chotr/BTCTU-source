import type { Actor } from "@/types";
import type { DirectoryPort } from "./directory";

export type ActorResolver = (
  userId: string,
) => Promise<Actor | null> | Actor | null;

export function createDirectoryActorResolver(
  directory: DirectoryPort,
): ActorResolver {
  return (userId: string) => directory.findById(userId);
}
