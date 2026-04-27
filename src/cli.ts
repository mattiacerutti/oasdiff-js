#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { exit } from "node:process";
import { resolveBinary } from "@/core/binary";

try {
  const binaryPath = await resolveBinary();
  execFileSync(binaryPath, process.argv.slice(2), {
    stdio: "inherit",
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  exit(1);
}
