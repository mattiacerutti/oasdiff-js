import { defineConfig } from "tsup";

export default defineConfig({
  define: {
    OASDIFF_JS_PACKAGE_BUILD: "true",
  },
  entry: ["src/index.ts", "src/cli.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
