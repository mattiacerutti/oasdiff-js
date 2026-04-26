#!/usr/bin/env node
import {execFileSync} from "node:child_process";
import path from "node:path";
import {exit} from "node:process";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binaryName = process.platform === "win32" ? "oasdiff.exe" : "oasdiff";

try {
  const binaryPath = path.resolve(__dirname, binaryName);

  execFileSync(binaryPath, process.argv.slice(2), {
    stdio: "inherit",
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  exit(1);
}
