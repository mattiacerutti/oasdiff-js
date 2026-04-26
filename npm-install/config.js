export const CONFIG = {
  name: "oasdiff",
  path: "./bin",
  url: "https://github.com/oasdiff/oasdiff/releases/download/v{{version}}/{{bin_name}}_{{version}}_{{platform}}_{{arch}}.tar.gz",
  darwinUrl:
    "https://github.com/oasdiff/oasdiff/releases/download/v{{version}}/{{bin_name}}_{{version}}_darwin_all.tar.gz",
};

export const ARCH_MAPPING = {
  x64: "amd64",
  arm64: "arm64",
};

export const PLATFORM_MAPPING = {
  darwin: "darwin",
  linux: "linux",
  win32: "windows",
};
