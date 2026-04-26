export type OasdiffFormat =
  | "json"
  | "yaml"
  | "text"
  | "markup"
  | "markdown"
  | "singleline"
  | "html"
  | "githubactions"
  | "junit"
  | "sarif";

export interface IOasdiffRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface IOasdiffChange {
  id?: string;
  text?: string;
  comment?: string;
  level?: number;
  operation?: string;
  operationId?: string;
  path?: string;
  source?: string;
  section?: string;
  attributes?: Record<string, unknown>;
  fingerprint?: string;
}

export interface IOasdiffBreakingResult extends IOasdiffRunResult {
  changes: IOasdiffChange[];
}

/** Flags shared by all comparison commands (diff, summary, breaking, changelog). */
export interface IOasdiffCommonDiffOptions {
  binaryPath?: string;
  maxBuffer?: number;
  composed?: boolean;
  matchPath?: string;
  unmatchPath?: string;
  filterExtension?: string;
  prefixBase?: string;
  prefixRevision?: string;
  stripPrefixBase?: string;
  stripPrefixRevision?: string;
  includePathParams?: boolean;
  flattenAllOf?: boolean;
  flattenParams?: boolean;
  caseInsensitiveHeaders?: boolean;
  excludeExtensions?: string[];
  allowExternalRefs?: boolean;
  excludeElements?: string[];
}

/** Flags shared by breaking and changelog commands. */
export interface IOasdiffCommonBreakingOptions extends IOasdiffCommonDiffOptions {
  lang?: string;
  errIgnoreFile?: string;
  warnIgnoreFile?: string;
  includeChecks?: string[];
  deprecationDaysBeta?: number;
  deprecationDaysStable?: number;
  color?: string;
  format?: OasdiffFormat;
  severityLevels?: string;
  attributes?: string[];
  template?: string;
  failOn?: string;
}

export interface IOasdiffDiffOptions extends IOasdiffCommonDiffOptions {
  format?: "json" | "yaml" | "text" | "markup" | "markdown" | "singleline" | "html";
  failOnDiff?: boolean;
}

export interface IOasdiffSummaryOptions extends IOasdiffCommonDiffOptions {
  format?: "json" | "yaml" | "text" | "markup" | "markdown" | "singleline" | "html";
  failOnDiff?: boolean;
}

export interface IOasdiffBreakingOptions extends IOasdiffCommonBreakingOptions {
  format?: "json" | "yaml" | "text" | "markup" | "markdown" | "singleline" | "html" | "githubactions" | "junit" | "sarif";
}

export interface IOasdiffChangelogOptions extends IOasdiffCommonBreakingOptions {
  format?: "json" | "yaml" | "text" | "markup" | "markdown" | "singleline" | "html" | "githubactions" | "junit" | "sarif";
  level?: string;
}

export interface IOasdiffCheck {
  id?: string;
  level?: string;
  direction?: string;
  location?: string;
  action?: string;
  description?: string;
  mitigation?: string;
}

export interface IOasdiffChecksOptions {
  binaryPath?: string;
  maxBuffer?: number;
  lang?: string;
  format?: "json" | "yaml" | "text";
  severity?: string[];
  tags?: string[];
}

export interface IOasdiffChecksResult extends IOasdiffRunResult {
  checks: IOasdiffCheck[];
}
