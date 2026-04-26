<h1 align="center">oasdiff-js</h1>

<p align="center">
  TypeScript/JavaScript wrapper for <a href="https://github.com/oasdiff/oasdiff">oasdiff</a> - a Go CLI for comparing OpenAPI specifications.
</p>

## Installation

```bash
npm install @oasdiff-js/oasdiff-js
```

```bash
yarn add @oasdiff-js/oasdiff-js
```

```bash
pnpm add @oasdiff-js/oasdiff-js
```

```bash
bun add @oasdiff-js/oasdiff-js
```

The oasdiff binary is downloaded automatically during install for your platform (macOS, Linux, Windows).

> **Note:** Some package managers block or skip lifecycle scripts. If the binary is not downloaded, see [Troubleshooting](#troubleshooting).

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

The package installs an `oasdiff` binary that you can use directly:

```bash
npx oasdiff breaking base.yaml revision.yaml
```

```bash
bunx oasdiff breaking base.yaml revision.yaml
```

For the full CLI reference, see the [oasdiff documentation](https://github.com/oasdiff/oasdiff).

## Troubleshooting

### Binary not found after install

If your package manager blocks or skips lifecycle scripts, the oasdiff binary may not be downloaded during install. This can happen with:

- **Bun**: blocks scripts by default for untrusted packages
- **npm / pnpm / yarn**: installed with `--ignore-scripts`
- **Corporate or CI environments**: scripts disabled for security

#### Bun

Run after install:

```bash
bun pm trust oasdiff-js
bun install
```

Or add to your `package.json`:

```json
{
  "trustedDependencies": ["oasdiff-js"]
}
```

Then reinstall:

```bash
rm -rf node_modules bun.lock
bun install
```

#### npm / pnpm / yarn

If you installed with `--ignore-scripts`, you can run the install script manually:

```bash
cd node_modules/oasdiff-js
node ./npm-install/postinstall.js
```

Or reinstall without ignoring scripts:

```bash
rm -rf node_modules package-lock.json
npm install
```

#### Other environments

If the above does not work, you can also download the correct binary manually from the [oasdiff releases page](https://github.com/oasdiff/oasdiff/releases) and pass its path to the programmatic API via the `binaryPath` option, or place it in `node_modules/oasdiff-js/bin/oasdiff` (or `oasdiff.exe` on Windows).

## License

[Apache-2.0](./LICENSE)
