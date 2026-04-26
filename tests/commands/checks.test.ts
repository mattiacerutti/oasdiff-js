import { beforeEach, describe, expect, it, vi } from "vitest";
import { runOasdiffChecks } from "@/commands/checks";
import { execOasdiff } from "@/core/exec";

vi.mock("@/core/exec", () => ({
  execOasdiff: vi.fn(),
  resolveBinary: vi.fn(),
}));

const execMock = vi.mocked(execOasdiff);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("runOasdiffChecks", () => {
  it("parses JSON checks", async () => {
    execMock.mockResolvedValueOnce({
      stdout: JSON.stringify([
        { id: "check1", level: "error" },
        { id: "check2", level: "warn" },
      ]),
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffChecks();
    expect(result.checks).toHaveLength(2);
    expect(result.checks[0].id).toBe("check1");
  });

  it("returns empty checks for non-json format", async () => {
    execMock.mockResolvedValueOnce({
      stdout: "text output",
      stderr: "",
      exitCode: 0,
    });

    const result = await runOasdiffChecks({ format: "text" });
    expect(result.checks).toEqual([]);
  });

  it("passes correct args", async () => {
    execMock.mockResolvedValueOnce({ stdout: "[]", stderr: "", exitCode: 0 });

    await runOasdiffChecks({
      lang: "en",
      severity: ["error", "warn"],
      tags: ["request", "response"],
    });

    expect(execMock).toHaveBeenCalledWith(
      [
        "checks",
        "--format",
        "json",
        "--lang",
        "en",
        "--severity",
        "error,warn",
        "--tags",
        "request,response",
      ],
      undefined,
      undefined,
    );
  });
});
