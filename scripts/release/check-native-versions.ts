import fs from "node:fs/promises";
import {
  NATIVE_PACKAGES,
  normalizeOasdiffVersion,
} from "../utils/oasdiff-packages";
import { findRepoRoot, repoPath } from "../utils/paths";

async function packageExists(name: string, version: string): Promise<boolean> {
  const retries = 5;
  const delayMs = 3000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = Bun.spawnSync(
      ["npm", "view", `${name}@${version}`, "version"],
      {
        stdout: "ignore",
        stderr: "ignore",
      },
    );

    if (result.exitCode === 0) {
      return true;
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
}

async function main(): Promise<void> {
  const checkFiles = process.argv.includes("--files");
  const checkRegistry = process.argv.includes("--registry");
  const root = await findRepoRoot(import.meta.url);
  const rootPackage = JSON.parse(
    await fs.readFile(repoPath(root, "package.json"), "utf8"),
  ) as {
    oasdiffVersion?: string;
    optionalDependencies?: Record<string, string>;
  };

  if (!rootPackage.oasdiffVersion) {
    throw new Error("Missing oasdiffVersion in package.json");
  }

  const version = normalizeOasdiffVersion(rootPackage.oasdiffVersion);
  const optionalDependencies = rootPackage.optionalDependencies ?? {};
  const mismatches: string[] = [];

  for (const pkg of NATIVE_PACKAGES) {
    if (optionalDependencies[pkg.name] !== version) {
      mismatches.push(
        `${pkg.name}: ${optionalDependencies[pkg.name] ?? "missing"}`,
      );
    }

    const packageJson = JSON.parse(
      await fs.readFile(
        repoPath(root, "packages", pkg.packageDir, "package.json"),
        "utf8",
      ),
    ) as { version?: string };

    if (packageJson.version !== version) {
      mismatches.push(`${pkg.packageDir}/package.json: ${packageJson.version}`);
    }

    if (checkFiles) {
      const binaryPath = repoPath(
        root,
        "packages",
        pkg.packageDir,
        "bin",
        pkg.binName,
      );
      const licensePath = repoPath(
        root,
        "packages",
        pkg.packageDir,
        "bin",
        "LICENSE",
      );

      try {
        await fs.access(binaryPath);
        await fs.access(licensePath);
      } catch {
        mismatches.push(
          `${pkg.packageDir}: missing ${pkg.binName} or bin/LICENSE`,
        );
      }
    }
  }

  if (mismatches.length > 0) {
    throw new Error(
      `Native optionalDependencies must match oasdiffVersion ${version}:\n${mismatches.join("\n")}`,
    );
  }

  if (!checkRegistry) {
    return;
  }

  const missing: string[] = [];
  for (const pkg of NATIVE_PACKAGES) {
    if (!(await packageExists(pkg.name, version))) {
      missing.push(`${pkg.name}@${version}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Native packages are not published:\n${missing.join("\n")}`,
    );
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
