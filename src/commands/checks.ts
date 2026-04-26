import { execOasdiff } from "../core/exec.js";
import type {
  IOasdiffChecksOptions,
  IOasdiffChecksResult,
} from "../types/index.js";

function parseChecks(stdout: string) {
  const content = stdout.trim();
  if (!content) return [];
  return JSON.parse(content);
}

export async function runOasdiffChecks(
  options: IOasdiffChecksOptions = {},
): Promise<IOasdiffChecksResult> {
  const format = options.format ?? "json";
  const args = ["checks", "--format", format];
  if (options.lang) args.push("--lang", options.lang);
  if (options.severity?.length)
    args.push("--severity", options.severity.join(","));
  if (options.tags?.length) args.push("--tags", options.tags.join(","));
  const result = await execOasdiff(args, options.binaryPath, options.maxBuffer);
  return {
    ...result,
    checks: format === "json" ? parseChecks(result.stdout) : [],
  };
}
