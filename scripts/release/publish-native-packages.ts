import fs from "node:fs/promises";
import { NATIVE_PACKAGES } from "../utils/oasdiff-packages";
import { findRepoRoot, repoPath } from "../utils/paths";

function packageExists(name: string, version: string): boolean {
  const result = Bun.spawnSync(
    ["npm", "view", `${name}@${version}`, "version"],
    {
      stdout: "ignore",
      stderr: "ignore",
    },
  );

  return result.exitCode === 0;
}

function publishPackage(packagePath: string): void {
  const result = Bun.spawnSync(
    ["npm", "publish", packagePath, "--access", "public"],
    { stdout: "inherit", stderr: "inherit" },
  );

  if (result.exitCode !== 0) {
    throw new Error(`Failed to publish ${packagePath}`);
  }
}

async function main(): Promise<void> {
  const root = await findRepoRoot(import.meta.url);

  for (const pkg of NATIVE_PACKAGES) {
    const packagePath = repoPath(root, "packages", pkg.packageDir);
    const packageJson = JSON.parse(
      await fs.readFile(repoPath(packagePath, "package.json"), "utf8"),
    ) as { version: string };
    const version = packageJson.version;

    if (packageExists(pkg.name, version)) {
      console.log(`${pkg.name}@${version} already exists, skipping.`);
      continue;
    }

    publishPackage(packagePath);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
