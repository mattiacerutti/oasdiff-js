import { execOasdiff } from "@/core/exec";
import { addCommonDiffFlags } from "@/core/flags";
import { withTempSpecs } from "@/core/specs";
import type { IOasdiffRunResult, IOasdiffSummaryOptions } from "@/types";

export async function runOasdiffSummary(
  basePath: string,
  revisionPath: string,
  options: IOasdiffSummaryOptions = {},
): Promise<IOasdiffRunResult> {
  const args = [
    "summary",
    "--format",
    options.format ?? "yaml",
    basePath,
    revisionPath,
  ];
  addCommonDiffFlags(args, options);
  if (options.failOnDiff) args.push("--fail-on-diff");
  return execOasdiff(args, options.binaryPath, options.maxBuffer);
}

export async function runOasdiffSummaryFromSpecs(
  baseSpec: object,
  revisionSpec: object,
  options: IOasdiffSummaryOptions = {},
): Promise<IOasdiffRunResult> {
  return withTempSpecs(baseSpec, revisionSpec, (basePath, revisionPath) =>
    runOasdiffSummary(basePath, revisionPath, options),
  );
}
