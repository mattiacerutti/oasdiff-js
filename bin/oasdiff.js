#!/usr/bin/env node
import {execFileSync} from "node:child_process";
import path from "node:path";
import {exit} from "node:process";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binaryName = process.platform === "win32" ? "oasdiff.exe" : "oasdiff";

try {
  execFileSync(path.resolve(__dirname, binaryName), process.argv.slice(2), {
    stdio: "inherit",
  });
} catch {
  exit(1);
}
