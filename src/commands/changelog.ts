import {execOasdiff} from "@/core/exec";
import {addCommonBreakingFlags} from "@/core/flags";
import {withTempSpecs} from "@/core/specs";
import type {IOasdiffBreakingResult, IOasdiffChangelogOptions} from "@/types";

function parseChanges(stdout: string) {
  const content = stdout.trim();
  if (!content) return [];
  return JSON.parse(content);
}

export async function runOasdiffChangelog(basePath: string, revisionPath: string, options: IOasdiffChangelogOptions = {}): Promise<IOasdiffBreakingResult> {
  const format = options.format ?? "json";
  const args = ["changelog", "--format", format, basePath, revisionPath];
  addCommonBreakingFlags(args, options);
  if (options.level) args.push("--level", options.level);
  const result = await execOasdiff(args, options.binaryPath, options.maxBuffer);
  return {
    ...result,
    changes: format === "json" ? parseChanges(result.stdout) : [],
  };
}

export async function runOasdiffChangelogFromSpecs(baseSpec: object, revisionSpec: object, options: IOasdiffChangelogOptions = {}): Promise<IOasdiffBreakingResult> {
  return withTempSpecs(baseSpec, revisionSpec, (basePath, revisionPath) => runOasdiffChangelog(basePath, revisionPath, options));
}
