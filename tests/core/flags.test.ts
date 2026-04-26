import { describe, expect, it } from "vitest";
import { addCommonDiffFlags, addCommonBreakingFlags } from "@/core/flags";

describe("addCommonDiffFlags", () => {
  it("returns empty args when no options", () => {
    const args: string[] = [];
    addCommonDiffFlags(args, {});
    expect(args).toEqual([]);
  });

  it("adds boolean flags", () => {
    const args: string[] = [];
    addCommonDiffFlags(args, {
      composed: true,
      includePathParams: true,
      flattenAllOf: true,
      flattenParams: true,
      caseInsensitiveHeaders: true,
    });
    expect(args).toEqual([
      "--composed",
      "--include-path-params",
      "--flatten-allof",
      "--flatten-params",
      "--case-insensitive-headers",
    ]);
  });

  it("adds string flags", () => {
    const args: string[] = [];
    addCommonDiffFlags(args, {
      matchPath: "/api/v1",
      unmatchPath: "/internal",
      filterExtension: "x-internal",
      prefixBase: "/base",
      prefixRevision: "/rev",
      stripPrefixBase: "/old",
      stripPrefixRevision: "/new",
    });
    expect(args).toEqual([
      "--match-path",
      "/api/v1",
      "--unmatch-path",
      "/internal",
      "--filter-extension",
      "x-internal",
      "--prefix-base",
      "/base",
      "--prefix-revision",
      "/rev",
      "--strip-prefix-base",
      "/old",
      "--strip-prefix-revision",
      "/new",
    ]);
  });

  it("adds array flags", () => {
    const args: string[] = [];
    addCommonDiffFlags(args, {
      excludeExtensions: ["x-internal", "x-beta"],
      excludeElements: ["examples", "description"],
    });
    expect(args).toEqual([
      "--exclude-extensions",
      "x-internal,x-beta",
      "--exclude-elements",
      "examples,description",
    ]);
  });

  it("adds allow-external-refs=false only when explicitly false", () => {
    const argsTrue: string[] = [];
    addCommonDiffFlags(argsTrue, { allowExternalRefs: true });
    expect(argsTrue).not.toContain("--allow-external-refs=false");

    const argsFalse: string[] = [];
    addCommonDiffFlags(argsFalse, { allowExternalRefs: false });
    expect(argsFalse).toEqual(["--allow-external-refs=false"]);
  });
});

describe("addCommonBreakingFlags", () => {
  it("inherits diff flags", () => {
    const args: string[] = [];
    addCommonBreakingFlags(args, { composed: true });
    expect(args).toContain("--composed");
  });

  it("adds breaking-specific flags", () => {
    const args: string[] = [];
    addCommonBreakingFlags(args, {
      lang: "en",
      errIgnoreFile: "/tmp/err.ignore",
      warnIgnoreFile: "/tmp/warn.ignore",
      includeChecks: ["check1", "check2"],
      deprecationDaysBeta: 14,
      deprecationDaysStable: 30,
      color: "never",
      severityLevels: "/tmp/levels.yaml",
      attributes: ["x-custom"],
      template: "/tmp/template.tmpl",
      failOn: "ERR",
    });
    expect(args).toEqual([
      "--lang",
      "en",
      "--err-ignore",
      "/tmp/err.ignore",
      "--warn-ignore",
      "/tmp/warn.ignore",
      "--include-checks",
      "check1,check2",
      "--deprecation-days-beta",
      "14",
      "--deprecation-days-stable",
      "30",
      "--color",
      "never",
      "--severity-levels",
      "/tmp/levels.yaml",
      "--attributes",
      "x-custom",
      "--template",
      "/tmp/template.tmpl",
      "--fail-on",
      "ERR",
    ]);
  });
});
