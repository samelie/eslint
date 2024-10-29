import { parse } from "node:path";
import { readFileSync } from "node:fs";
import { defineBuildConfig } from "unbuild";
import type { IPackageJson } from "package-json-type";

import { packageUpSync } from "package-up";

const path = require.resolve("@antfu/eslint-config");
const p = packageUpSync({
    cwd: parse(path).dir,
});
const pkgJson = JSON.parse(readFileSync(p || "", "utf-8")) as IPackageJson;

export default defineBuildConfig({
    entries: ["src/eslint.config"],
    outDir: "dist",
    failOnWarn: false,
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: true,
    },
    externals: ["eslint-flat-config-utils", ...Object.keys(pkgJson.devDependencies || [])],
});
