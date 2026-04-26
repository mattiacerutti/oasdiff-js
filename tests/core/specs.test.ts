import { describe, expect, it } from "vitest";
import { access, readFile } from "node:fs/promises";
import { withTempSpecs } from "@/core/specs";

describe("withTempSpecs", () => {
  it("writes specs to temp files and passes paths to callback", async () => {
    const base = { openapi: "3.0.0" };
    const revision = { openapi: "3.0.1" };

    const result = await withTempSpecs(
      base,
      revision,
      async (basePath, revisionPath) => {
        expect(basePath).toContain("base.json");
        expect(revisionPath).toContain("revision.json");

        const baseContent = JSON.parse(await readFile(basePath, "utf8"));
        const revisionContent = JSON.parse(
          await readFile(revisionPath, "utf8"),
        );

        expect(baseContent).toEqual(base);
        expect(revisionContent).toEqual(revision);

        return "callback-result";
      },
    );

    expect(result).toBe("callback-result");
  });

  it("cleans up temp files after callback", async () => {
    let capturedBasePath = "";

    await withTempSpecs({ a: 1 }, { b: 2 }, async (basePath) => {
      capturedBasePath = basePath;
      await access(basePath);
      return null;
    });

    await expect(access(capturedBasePath)).rejects.toThrow();
  });

  it("cleans up even when callback throws", async () => {
    let capturedBasePath = "";

    await expect(
      withTempSpecs({ a: 1 }, { b: 2 }, async (basePath) => {
        capturedBasePath = basePath;
        throw new Error("intentional");
      }),
    ).rejects.toThrow("intentional");

    await expect(access(capturedBasePath)).rejects.toThrow();
  });
});
