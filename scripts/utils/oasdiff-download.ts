import fs from "node:fs/promises";
import path from "node:path";
import * as tar from "tar";
import type { NativePackage } from "./oasdiff-packages";

export async function downloadOasdiffBinary(
  version: string,
  pkg: NativePackage,
  binDir: string,
): Promise<string> {
  const url = `https://github.com/oasdiff/oasdiff/releases/download/v${version}/oasdiff_${version}_${pkg.urlSuffix}.tar.gz`;
  const binaryPath = path.join(binDir, pkg.binName);

  console.log(`Downloading ${pkg.name} from ${url}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error(`Response body is null for ${url}`);
  }

  await fs.rm(binDir, { force: true, recursive: true });
  await fs.mkdir(binDir, { recursive: true });

  const tarFile = path.join(binDir, "download.tar.gz");
  const buffer = await response.arrayBuffer();
  await fs.writeFile(tarFile, new Uint8Array(buffer));
  await tar.x({ cwd: binDir, file: tarFile });
  await fs.rm(tarFile, { force: true });

  await fs.access(path.join(binDir, "LICENSE"));

  if (pkg.os !== "win32") {
    await fs.chmod(binaryPath, 0o755);
  }

  return binaryPath;
}
