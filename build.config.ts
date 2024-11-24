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
    // Currently there is an issue with one of the eslint plugins & Typescript
    declaration: false,
    clean: true,
    rollup: {
        emitCJS: true,
    },
    externals: [ ...Object.keys(pkgJson.devDependencies || [])],
});
