import { execOasdiff } from "../core/exec.js";
import { addCommonBreakingFlags } from "../core/flags.js";
import { withTempSpecs } from "../core/specs.js";
import type {
  IOasdiffBreakingOptions,
  IOasdiffBreakingResult,
} from "../types/index.js";

function parseChanges(stdout: string) {
  const content = stdout.trim();
  if (!content) return [];
  return JSON.parse(content);
}

export async function runOasdiffBreaking(
  basePath: string,
  revisionPath: string,
  options: IOasdiffBreakingOptions = {},
): Promise<IOasdiffBreakingResult> {
  const format = options.format ?? "json";
  const args = ["breaking", "--format", format, basePath, revisionPath];
  addCommonBreakingFlags(args, options);
  const result = await execOasdiff(args, options.binaryPath, options.maxBuffer);
  return {
    ...result,
    changes: format === "json" ? parseChanges(result.stdout) : [],
  };
}

export async function runOasdiffBreakingFromSpecs(
  baseSpec: object,
  revisionSpec: object,
  options: IOasdiffBreakingOptions = {},
): Promise<IOasdiffBreakingResult> {
  return withTempSpecs(baseSpec, revisionSpec, (basePath, revisionPath) =>
    runOasdiffBreaking(basePath, revisionPath, options),
  );
}
