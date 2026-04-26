# oasdiff-js

TypeScript/JavaScript wrapper for [oasdiff](https://github.com/oasdiff/oasdiff) — a Go CLI for comparing OpenAPI specifications.

## Installation

```bash
npm install @oasdiff-js/oasdiff-js
```

The oasdiff binary is downloaded automatically during install for your platform (macOS, Linux, Windows).

## Usage

### Programmatic API

```typescript
import {runOasdiffBreaking} from "@oasdiff-js/oasdiff-js";

const result = await runOasdiffBreaking("base.yaml", "revision.yaml");

console.log(result.changes);
// [{ id: "api-removed-without-deprecation", text: "...", level: 3, ... }]
```

### From in-memory specs

```typescript
import {runOasdiffBreakingFromSpecs} from "@oasdiff-js/oasdiff-js";

const result = await runOasdiffBreakingFromSpecs(baseSpec, revisionSpec);
```

## API

### Comparison commands

| Function                                        | Description           |
| ----------------------------------------------- | --------------------- |
| `runOasdiffDiff(base, revision, options?)`      | Full structural diff  |
| `runOasdiffSummary(base, revision, options?)`   | Summary of changes    |
| `runOasdiffBreaking(base, revision, options?)`  | Breaking changes only |
| `runOasdiffChangelog(base, revision, options?)` | All changes (info+)   |

Each has a `*FromSpecs` variant that accepts objects instead of file paths.

### Checks

```typescript
import {runOasdiffChecks} from "@oasdiff-js/oasdiff-js";

const {checks} = await runOasdiffChecks();
```

### Options

All comparison functions accept options for format, filtering, flattening, deprecation rules, etc:

```typescript
await runOasdiffBreaking("base.yaml", "revision.yaml", {
  format: "json",
  failOn: "ERR",
  includeChecks: ["check-id"],
  flattenAllOf: true,
});
```

### Result shape

```typescript
interface IOasdiffRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// Breaking and changelog also include:
interface IOasdiffBreakingResult extends IOasdiffRunResult {
  changes: IOasdiffChange[];
}
```

## CLI

The package also installs an `oasdiff` binary:

```bash
npx oasdiff breaking base.yaml revision.yaml
```

## License

Apache-2.0
