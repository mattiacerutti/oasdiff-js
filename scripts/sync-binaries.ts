import fs from "node:fs/promises";
import {downloadOasdiffBinary} from "./utils/oasdiff-download";
import {getNativePackage, normalizeOasdiffVersion} from "./utils/oasdiff-packages";
import {findRepoRoot, repoPath} from "./utils/paths";

async function main(): Promise<void> {
  const root = await findRepoRoot(import.meta.url);
  const packageJson = JSON.parse(await fs.readFile(repoPath(root, "package.json"), "utf8")) as {oasdiffVersion?: string};

  if (!packageJson.oasdiffVersion) {
    throw new Error("Missing oasdiffVersion in package.json");
  }

  const version = normalizeOasdiffVersion(packageJson.oasdiffVersion);
  const pkg = getNativePackage(process.platform, process.arch);

  if (!pkg) {
    throw new Error(`Unsupported platform: ${process.platform} ${process.arch}`);
  }

  const binDir = repoPath(root, ".oasdiff-bin");
  const binaryPath = await downloadOasdiffBinary(version, pkg, binDir);
  await fs.writeFile(repoPath(binDir, "version"), `${version}\n`);

  console.log(`Synced oasdiff ${version} to ${binaryPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
