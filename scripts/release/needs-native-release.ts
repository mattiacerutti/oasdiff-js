import fs from "node:fs/promises";
import {NATIVE_PACKAGES, normalizeOasdiffVersion} from "../utils/oasdiff-packages";
import {findRepoRoot, repoPath} from "../utils/paths";

function packageExists(name: string, version: string): boolean {
  const result = Bun.spawnSync(["npm", "view", `${name}@${version}`, "version"], {
    stdout: "ignore",
    stderr: "ignore",
  });

  return result.exitCode === 0;
}

async function main(): Promise<void> {
  const root = await findRepoRoot(import.meta.url);
  const rootPackage = JSON.parse(await fs.readFile(repoPath(root, "package.json"), "utf8")) as {
    oasdiffVersion?: string;
    optionalDependencies?: Record<string, string>;
  };

  if (!rootPackage.oasdiffVersion) {
    throw new Error("Missing oasdiffVersion in package.json");
  }

  const version = normalizeOasdiffVersion(rootPackage.oasdiffVersion);
  const optionalDependencies = rootPackage.optionalDependencies ?? {};

  let versionsMatch = true;
  for (const pkg of NATIVE_PACKAGES) {
    const packageJson = JSON.parse(await fs.readFile(repoPath(root, "packages", pkg.packageDir, "package.json"), "utf8")) as {version?: string};

    if (optionalDependencies[pkg.name] !== version || packageJson.version !== version) {
      versionsMatch = false;
      break;
    }
  }

  if (!versionsMatch) {
    console.log("true");
    return;
  }

  const allPublished = NATIVE_PACKAGES.every((pkg) => packageExists(pkg.name, version));

  console.log(allPublished ? "false" : "true");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
