import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const runRemotion = (args: string[]) => {
  const bin = path.join(root, "node_modules", ".bin", "remotion");
  const result = spawnSync(bin, args, { cwd: root, stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

export const flag = (args: string[], name: string, fallback?: string) => {
  const index = args.indexOf(name);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
};

export const concurrency = () => process.env.REMOTION_CONCURRENCY ?? "2";
