import {execOasdiff} from "@/core/exec";
import {addCommonDiffFlags} from "@/core/flags";
import {withTempSpecs} from "@/core/specs";
import type {IOasdiffDiffOptions, IOasdiffRunResult} from "@/types";

export async function runOasdiffDiff(basePath: string, revisionPath: string, options: IOasdiffDiffOptions = {}): Promise<IOasdiffRunResult> {
  const args = ["diff", "--format", options.format ?? "yaml", basePath, revisionPath];
  addCommonDiffFlags(args, options);
  if (options.failOnDiff) args.push("--fail-on-diff");
  return execOasdiff(args, options.binaryPath, options.maxBuffer);
}

export async function runOasdiffDiffFromSpecs(baseSpec: object, revisionSpec: object, options: IOasdiffDiffOptions = {}): Promise<IOasdiffRunResult> {
  return withTempSpecs(baseSpec, revisionSpec, (basePath, revisionPath) => runOasdiffDiff(basePath, revisionPath, options));
}
