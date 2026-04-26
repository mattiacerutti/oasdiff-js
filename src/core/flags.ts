import type {IOasdiffCommonDiffOptions, IOasdiffCommonBreakingOptions} from "../types/index.js";

export function addCommonDiffFlags(args: string[], options: IOasdiffCommonDiffOptions) {
  if (options.composed) args.push("--composed");
  if (options.matchPath) args.push("--match-path", options.matchPath);
  if (options.unmatchPath) args.push("--unmatch-path", options.unmatchPath);
  if (options.filterExtension) args.push("--filter-extension", options.filterExtension);
  if (options.prefixBase) args.push("--prefix-base", options.prefixBase);
  if (options.prefixRevision) args.push("--prefix-revision", options.prefixRevision);
  if (options.stripPrefixBase) args.push("--strip-prefix-base", options.stripPrefixBase);
  if (options.stripPrefixRevision) args.push("--strip-prefix-revision", options.stripPrefixRevision);
  if (options.includePathParams) args.push("--include-path-params");
  if (options.flattenAllOf) args.push("--flatten-allof");
  if (options.flattenParams) args.push("--flatten-params");
  if (options.caseInsensitiveHeaders) args.push("--case-insensitive-headers");
  if (options.excludeExtensions?.length) args.push("--exclude-extensions", options.excludeExtensions.join(","));
  if (options.allowExternalRefs === false) args.push("--allow-external-refs=false");
  if (options.excludeElements?.length) args.push("--exclude-elements", options.excludeElements.join(","));
}

export function addCommonBreakingFlags(args: string[], options: IOasdiffCommonBreakingOptions) {
  addCommonDiffFlags(args, options);
  if (options.lang) args.push("--lang", options.lang);
  if (options.errIgnoreFile) args.push("--err-ignore", options.errIgnoreFile);
  if (options.warnIgnoreFile) args.push("--warn-ignore", options.warnIgnoreFile);
  if (options.includeChecks?.length) args.push("--include-checks", options.includeChecks.join(","));
  if (options.deprecationDaysBeta !== undefined) args.push("--deprecation-days-beta", String(options.deprecationDaysBeta));
  if (options.deprecationDaysStable !== undefined) args.push("--deprecation-days-stable", String(options.deprecationDaysStable));
  if (options.color) args.push("--color", options.color);
  if (options.format) args.push("--format", options.format);
  if (options.severityLevels) args.push("--severity-levels", options.severityLevels);
  if (options.attributes?.length) args.push("--attributes", options.attributes.join(","));
  if (options.template) args.push("--template", options.template);
  if (options.failOn) args.push("--fail-on", options.failOn);
}
