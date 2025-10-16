import type { IPackageJson } from "package-json-type";
import { readFileSync } from "node:fs";

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineBuildConfig } from "unbuild";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pkgJson = JSON.parse(readFileSync(join(__dirname, "package.json") || "", "utf-8")) as IPackageJson;

export default defineBuildConfig({
    entries: ["src/eslint.config"],
    outDir: "dist",
    failOnWarn: false,
    declaration: true,
    clean: true,
    rollup: {
        emitCJS: true,
        cjsBridge: true,
    },
    externals: [...Object.keys(pkgJson.devDependencies || [])],
});
