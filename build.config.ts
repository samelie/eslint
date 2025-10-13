import type { IPackageJson } from "package-json-type";
import { readFileSync } from "node:fs";
import { parse } from "node:path";
import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";
import { packageUpSync } from "package-up";

const path = require.resolve("@antfu/eslint-config");
const p = packageUpSync({
    cwd: parse(path).dir,
});
const pkgJson = JSON.parse(readFileSync(p || "", "utf-8")) as IPackageJson;

export default makeUnbuildConfig({
    entries: ["src/eslint.config"],
    // Currently there is an issue with one of the eslint plugins & Typescript
    declaration: true,
    rollup: {
        emitCJS: true,
    },
    externals: [...Object.keys(pkgJson.devDependencies || [])],
});
