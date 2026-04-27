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

The correct oasdiff binary for your platform is installed automatically via an optional dependency (macOS, Linux, Windows).

## Development

The upstream oasdiff version used by this repo is `oasdiffVersion` in `package.json`.

After changing it locally, sync the dev binary for your platform before running tests or examples:

```bash
bun run sync-binaries
```

Source code uses `.oasdiff-bin/`. Published packages use platform-specific optional dependencies instead.

### Versioning model

Native packages (`@oasdiff-js/oasdiff-*`) are versioned to match the upstream oasdiff binary they contain. The main `@oasdiff-js/oasdiff-js` package follows its own semver and pins exact native versions in `optionalDependencies`.

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

If the platform-specific optional dependency was not installed, the binary will be missing. This can happen when:

- **Optional dependencies are disabled**: some CI environments or lockfile generators skip optional dependencies
- **Unsupported platform**: your OS or architecture does not have a prebuilt binary

#### Reinstall with optional dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

For **pnpm**:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

For **bun**:

```bash
rm -rf node_modules bun.lock
bun install
```

#### Other environments

If the above does not work, you can also download the correct binary manually from the [oasdiff releases page](https://github.com/oasdiff/oasdiff/releases) and pass its path to the programmatic API via the `binaryPath` option.

## License

[Apache-2.0](./LICENSE)
