import { defineKnipConfig } from "@adddog/monorepo-consistency";

export default defineKnipConfig({
    project: ["src/**/*.ts", "*.mjs"],
}, {
    ignoreDependencies: [
        "@adddog/monorepo-consistency",
        "@adddog/eslint-plugin-rules",
    ],
    ignoreBinaries: [
        "knip",
    ],
});
