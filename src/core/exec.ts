import {execFile} from "node:child_process";
import {promisify} from "node:util";
import type {IOasdiffRunResult} from "@/types";
import {resolveBinary} from "@/core/binary";

const execFileAsync = promisify(execFile);

export async function execOasdiff(args: string[], binaryPath: string | undefined, maxBuffer: number | undefined): Promise<IOasdiffRunResult> {
  const resolved = await resolveBinary(binaryPath);

  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  try {
    const result = await execFileAsync(resolved, args, {
      maxBuffer: maxBuffer ?? 1024 * 1024 * 10,
    });
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (error: unknown) {
    const execError = error as {
      stdout?: string;
      stderr?: string;
      code?: number;
    };
    stdout = execError.stdout ?? "";
    stderr = execError.stderr ?? "";
    exitCode = typeof execError.code === "number" ? execError.code : 1;
  }

  return {stdout, stderr, exitCode};
}
