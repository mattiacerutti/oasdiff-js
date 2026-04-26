import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  runOasdiffBreaking,
  runOasdiffBreakingFromSpecs,
} from "@/commands/breaking";
import { execOasdiff } from "@/core/exec";

vi.mock("@/core/exec", () => ({
  execOasdiff: vi.fn(),
  resolveBinary: vi.fn(),
}));

const execMock = vi.mocked(execOasdiff);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("runOasdiffBreaking", () => {
  it("parses JSON changes when format is json", async () => {
    execMock.mockResolvedValueOnce({
      stdout: JSON.stringify([{ id: "test", level: 1 }]),
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffBreaking("base.yaml", "rev.yaml");
    expect(result.changes).toEqual([{ id: "test", level: 1 }]);
    expect(result.exitCode).toBe(0);
  });

  it("returns empty changes for non-json format", async () => {
    execMock.mockResolvedValueOnce({
      stdout: "some text output",
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffBreaking("base.yaml", "rev.yaml", {
      format: "text",
    });
    expect(result.changes).toEqual([]);
    expect(result.stdout).toBe("some text output");
  });

  it("returns empty changes on empty stdout", async () => {
    execMock.mockResolvedValueOnce({
      stdout: "",
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffBreaking("base.yaml", "rev.yaml");
    expect(result.changes).toEqual([]);
  });

  it("passes correct args with options", async () => {
    execMock.mockResolvedValueOnce({ stdout: "[]", stderr: "", exitCode: 0 });

    await runOasdiffBreaking("base.yaml", "rev.yaml", {
      format: "yaml",
      failOn: "ERR",
      includeChecks: ["check1"],
    });

    expect(execMock).toHaveBeenCalledWith(
      [
        "breaking",
        "--format",
        "yaml",
        "base.yaml",
        "rev.yaml",
        "--include-checks",
        "check1",
        "--fail-on",
        "ERR",
      ],
      undefined,
      undefined,
    );
  });
});

describe("runOasdiffBreakingFromSpecs", () => {
  it("serializes specs and runs breaking", async () => {
    execMock.mockResolvedValueOnce({
      stdout: JSON.stringify([{ id: "api-removed" }]),
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffBreakingFromSpecs(
      { openapi: "3.0.0", info: { title: "A", version: "1" }, paths: {} },
      {
        openapi: "3.0.0",
        info: { title: "A", version: "1" },
        paths: { "/x": {} },
      },
      { format: "json" },
    );

    expect(result.changes).toEqual([{ id: "api-removed" }]);
  });
});
