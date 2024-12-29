import { makeConfig } from "@rad/publish/build.config.ts";
import { readFileSync } from "node:fs";
import { parse } from "node:path";
import type { IPackageJson } from "package-json-type";
import { packageUpSync } from "package-up";



const path = require.resolve("@antfu/eslint-config");
const p = packageUpSync({
    cwd: parse(path).dir,
});
const pkgJson = JSON.parse(readFileSync(p || "", "utf-8")) as IPackageJson;


export default makeConfig({
    entries: ["src/eslint.config"],
    // Currently there is an issue with one of the eslint plugins & Typescript
    declaration: false,
    rollup: {
        emitCJS:true
    },
    externals: [...Object.keys(pkgJson.devDependencies || [])],
});

