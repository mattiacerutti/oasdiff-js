import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function findRepoRoot(fromUrl: string): Promise<string> {
  let current = path.dirname(fileURLToPath(fromUrl));

  while (current !== path.dirname(current)) {
    const packageJsonPath = path.join(current, "package.json");

    if (await fileExists(packageJsonPath)) {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8"),
      ) as { name?: string };

      if (packageJson.name === "@oasdiff-js/oasdiff-js") {
        return current;
      }
    }

    current = path.dirname(current);
  }

  throw new Error("Could not find @oasdiff-js/oasdiff-js repository root");
}

export const repoPath = (root: string, ...segments: string[]): string =>
  path.join(root, ...segments);
