import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import type { IOasdiffRunResult } from "@/types";

const execFileAsync = promisify(execFile);

function getBinaryName() {
  return process.platform === "win32" ? "oasdiff.exe" : "oasdiff";
}

function getPackageBinaryPath() {
  return path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "bin",
    getBinaryName(),
  );
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveBinary(binaryPath?: string) {
  if (binaryPath) {
    if (!(await fileExists(binaryPath))) {
      throw new Error(`oasdiff binary not found at ${binaryPath}`);
    }
    return binaryPath;
  }

  const packageBinaryPath = getPackageBinaryPath();
  if (await fileExists(packageBinaryPath)) {
    return packageBinaryPath;
  }

  throw new Error(
    "oasdiff binary not found. Run `npm install` or `bun install` to trigger the postinstall script, or provide a binaryPath option.",
  );
}

export async function execOasdiff(
  args: string[],
  binaryPath: string | undefined,
  maxBuffer: number | undefined,
): Promise<IOasdiffRunResult> {
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

  return { stdout, stderr, exitCode };
}
