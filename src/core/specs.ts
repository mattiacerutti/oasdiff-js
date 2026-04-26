import {mkdtemp, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";

export async function withTempSpecs<T>(
  baseSpec: object,
  revisionSpec: object,
  fn: (basePath: string, revisionPath: string) => Promise<T>
): Promise<T> {
  const tempDir = await mkdtemp(path.join(tmpdir(), "oasdiff-wrapper-"));
  try {
    const basePath = path.join(tempDir, "base.json");
    const revisionPath = path.join(tempDir, "revision.json");
    await writeFile(basePath, JSON.stringify(baseSpec));
    await writeFile(revisionPath, JSON.stringify(revisionSpec));
    return await fn(basePath, revisionPath);
  } finally {
    await rm(tempDir, {force: true, recursive: true});
  }
}
