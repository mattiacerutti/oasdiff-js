import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

declare const OASDIFF_JS_PACKAGE_BUILD: boolean | undefined;

const isPackageBuild =
  typeof OASDIFF_JS_PACKAGE_BUILD !== "undefined" && OASDIFF_JS_PACKAGE_BUILD;

const PLATFORM_PACKAGES: Record<string, Record<string, string>> = {
  darwin: {
    arm64: "@oasdiff-js/oasdiff-darwin-arm64",
    x64: "@oasdiff-js/oasdiff-darwin-x64",
  },
  linux: {
    arm64: "@oasdiff-js/oasdiff-linux-arm64",
    x64: "@oasdiff-js/oasdiff-linux-x64",
  },
  win32: {
    arm64: "@oasdiff-js/oasdiff-windows-arm64",
    x64: "@oasdiff-js/oasdiff-windows-x64",
  },
};

const DEV_BINARY_NAMES: Record<string, string> = {
  darwin: "oasdiff",
  linux: "oasdiff",
  win32: "oasdiff.exe",
};

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findPackageRoot(): Promise<string | undefined> {
  let current = moduleDir;

  while (current !== path.dirname(current)) {
    const packageJsonPath = path.join(current, "package.json");

    if (await fileExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          await readFile(packageJsonPath, "utf8"),
        ) as { name?: string };

        if (packageJson.name === "@oasdiff-js/oasdiff-js") {
          return current;
        }
      } catch {
        return undefined;
      }
    }

    current = path.dirname(current);
  }

  return undefined;
}

async function resolveDevBinary(root: string): Promise<string> {
  const packageJson = JSON.parse(
    await readFile(path.join(root, "package.json"), "utf8"),
  ) as { oasdiffVersion?: string };

  if (!packageJson.oasdiffVersion) {
    throw new Error("Missing oasdiffVersion in package.json");
  }

  const binName = DEV_BINARY_NAMES[process.platform];
  const binaryPath = binName ? path.join(root, ".oasdiff-bin", binName) : "";
  const versionPath = path.join(root, ".oasdiff-bin", "version");

  if (
    !binName ||
    !(await fileExists(binaryPath)) ||
    !(await fileExists(versionPath))
  ) {
    throw new Error(
      `Local oasdiff binary is not synced. Run bun run sync-binaries to download oasdiff ${packageJson.oasdiffVersion}.`,
    );
  }

  const syncedVersion = (await readFile(versionPath, "utf8")).trim();
  if (syncedVersion !== packageJson.oasdiffVersion) {
    throw new Error(
      `Local oasdiff binary is ${syncedVersion}, but package.json requires ${packageJson.oasdiffVersion}. Run bun run sync-binaries.`,
    );
  }

  return binaryPath;
}

export async function resolveBinary(binaryPath?: string): Promise<string> {
  if (binaryPath) {
    if (!(await fileExists(binaryPath))) {
      throw new Error(`oasdiff binary not found at ${binaryPath}`);
    }
    return binaryPath;
  }

  const platform = process.platform;
  const arch = process.arch;

  const packageRoot = await findPackageRoot();
  if (packageRoot && !isPackageBuild) {
    return resolveDevBinary(packageRoot);
  }

  const pkgName = PLATFORM_PACKAGES[platform]?.[arch];
  if (!pkgName) {
    throw new Error(
      `Unsupported platform: ${platform} ${arch}. @oasdiff-js/oasdiff-js supports macOS (x64, arm64), Linux (x64, arm64), and Windows (x64, arm64).`,
    );
  }

  try {
    const mod = await import(pkgName);
    if (!(await fileExists(mod.binPath))) {
      throw new Error(
        `The oasdiff binary for ${platform} ${arch} could not be found. ` +
          `Please ensure that ${pkgName} is installed. ` +
          `If you disabled optional dependencies (e.g. --no-optional), re-install with them enabled.`,
      );
    }
    return mod.binPath;
  } catch (e) {
    if (e instanceof Error && e.message.includes("oasdiff binary")) {
      throw e;
    }
    throw new Error(
      `The oasdiff binary for ${platform} ${arch} could not be found. ` +
        `Please ensure that ${pkgName} is installed. ` +
        `If you disabled optional dependencies (e.g. --no-optional), re-install with them enabled.`,
    );
  }
}
