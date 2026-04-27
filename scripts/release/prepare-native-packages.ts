import fs from "node:fs/promises";
import { downloadOasdiffBinary } from "../utils/oasdiff-download";
import {
  NATIVE_PACKAGES,
  normalizeOasdiffVersion,
} from "../utils/oasdiff-packages";
import { findRepoRoot, repoPath } from "../utils/paths";

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main(): Promise<void> {
  const root = await findRepoRoot(import.meta.url);
  const rootPackagePath = repoPath(root, "package.json");
  const rootPackage = JSON.parse(
    await fs.readFile(rootPackagePath, "utf8"),
  ) as {
    oasdiffVersion?: string;
    optionalDependencies?: Record<string, string>;
  };

  if (!rootPackage.oasdiffVersion) {
    throw new Error("Missing oasdiffVersion in package.json");
  }

  const version = normalizeOasdiffVersion(rootPackage.oasdiffVersion);
  rootPackage.oasdiffVersion = version;
  rootPackage.optionalDependencies ??= {};

  for (const pkg of NATIVE_PACKAGES) {
    const packageJsonPath = repoPath(
      root,
      "packages",
      pkg.packageDir,
      "package.json",
    );
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, "utf8"),
    ) as { version: string };

    packageJson.version = version;
    rootPackage.optionalDependencies[pkg.name] = version;

    await writeJson(packageJsonPath, packageJson);
    await downloadOasdiffBinary(
      version,
      pkg,
      repoPath(root, "packages", pkg.packageDir, "bin"),
    );
  }

  await writeJson(rootPackagePath, rootPackage);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
