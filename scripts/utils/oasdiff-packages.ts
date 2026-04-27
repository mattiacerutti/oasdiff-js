export interface NativePackage {
  arch: NodeJS.Architecture;
  binName: string;
  name: string;
  os: NodeJS.Platform;
  packageDir: string;
  urlSuffix: string;
}

export const NATIVE_PACKAGES: NativePackage[] = [
  {
    arch: "arm64",
    binName: "oasdiff",
    name: "@oasdiff-js/oasdiff-darwin-arm64",
    os: "darwin",
    packageDir: "oasdiff-darwin-arm64",
    urlSuffix: "darwin_all",
  },
  {
    arch: "x64",
    binName: "oasdiff",
    name: "@oasdiff-js/oasdiff-darwin-x64",
    os: "darwin",
    packageDir: "oasdiff-darwin-x64",
    urlSuffix: "darwin_all",
  },
  {
    arch: "arm64",
    binName: "oasdiff",
    name: "@oasdiff-js/oasdiff-linux-arm64",
    os: "linux",
    packageDir: "oasdiff-linux-arm64",
    urlSuffix: "linux_arm64",
  },
  {
    arch: "x64",
    binName: "oasdiff",
    name: "@oasdiff-js/oasdiff-linux-x64",
    os: "linux",
    packageDir: "oasdiff-linux-x64",
    urlSuffix: "linux_amd64",
  },
  {
    arch: "arm64",
    binName: "oasdiff.exe",
    name: "@oasdiff-js/oasdiff-windows-arm64",
    os: "win32",
    packageDir: "oasdiff-windows-arm64",
    urlSuffix: "windows_arm64",
  },
  {
    arch: "x64",
    binName: "oasdiff.exe",
    name: "@oasdiff-js/oasdiff-windows-x64",
    os: "win32",
    packageDir: "oasdiff-windows-x64",
    urlSuffix: "windows_amd64",
  },
];

export function normalizeOasdiffVersion(version: string): string {
  const normalized = version.startsWith("v") ? version.slice(1) : version;

  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(normalized)) {
    throw new Error(`Invalid oasdiffVersion: ${version}`);
  }

  return normalized;
}

export function getNativePackage(
  os: NodeJS.Platform,
  arch: NodeJS.Architecture,
): NativePackage | undefined {
  return NATIVE_PACKAGES.find((pkg) => pkg.os === os && pkg.arch === arch);
}
