import antfu from "@antfu/eslint-config";
import radPlguins from "@adddog/eslint-plugin-rules";

import eslintPluginNoBarrelFiles from "eslint-plugin-no-barrel-files";
/*

Ideas:

Possible to import plugins and their rules

```

import eslintPluginDeprecate from "eslint-plugin-deprecate";

  plugins: {
            "deprecate-import": eslintPluginDeprecateImport,
        },
        rules: {
            ...eslintPluginDeprecateImport.rules,
}

}
```

*/

export const ignores = ["**/build/**", "**/dist/**", "README.md", "package.json", "**/dev-dist/**", "**.js", "**.vscode/.settings.json", "**/node_modules/**", "*.html"];

export default function (options?: Parameters<typeof antfu>[0] & { ignores?: string[] }, ...userConfigs: Parameters<typeof antfu>[1][]): ReturnType<typeof antfu> {
    return antfu(
        {
            stylistic: {
                indent: 4,
                quotes: "double",
                semi: true,
            },
            formatters: { css: true, xml: false },
            react: false,
            jsx: false,
            markdown: false,
            // TypeScript and Vue are auto-detected, you can also explicitly enable them:
            typescript: true,
            ignores: [...ignores, ...(options?.ignores || [])],
            // Disable jsonc and yaml support
            jsonc: false,
            yaml: false,
            vue: false,
            ...options,
        },
        {
            files: ["**/*.ts"],
            plugins: {
                "rad": radPlguins,
                "no-barrel-files": eslintPluginNoBarrelFiles,
            },
            rules: {
                "rad/no-incorrect-pkg-imports": "error",
                "no-barrel-files/no-barrel-files": "error",
            },
        },
        // overrides block
        {
            rules: {
                "max-len": "off",
                "curly": "off",
                "func-style": "off",
                "antfu/curly": "off",
                "accessor-pairs": "off",
                "antfu/if-newline": "off",
                "antfu/consistent-list-newline": "off",
                "ts/consistent-type-definitions": "off",
                "ts/no-redeclare": "off",
                "ts/no-unused-expressions": "off",
                "ts/no-explicit-any": "error",
                "prefer-arrow-callback": [
                    "error",
                    {
                        allowNamedFunctions: true,
                        allowUnboundThis: true,
                    },
                ],
            },
        },
        ...userConfigs,
    )
        .override("antfu/unicorn/rules", {
            rules: {
                "unicorn/no-new-array": "off",
            },
        })
        .override("antfu/stylistic/rules", {
            rules: {
                // https://github.com/antfu/eslint-config/blob/main/src/configs/stylistic.ts#L61
                "antfu/top-level-function": "off",
                "style/arrow-parens": ["error", "as-needed"],
                "style/operator-linebreak": "off",
                // https://eslint.style/rules/default/array-element-newline
                "style/array-element-newline": "off", // if on, causes issues with big object in array
                "style/max-statements-per-line": ["error", {
                    max: 2,
                }],
                "style/function-call-argument-newline": ["error", "consistent"],
                "style/brace-style": ["error", "1tbs", {
                    allowSingleLine: true,
                }],
            },
        })
    // Rules are scoped to names
    // see https://github.com/antfu/eslint-config/blob/93c9e772faf45295a4deb2633a4655954da74491/src/configs/typescript.ts#L110
        .override("antfu/typescript/rules", {
            rules: {
                "ts/no-use-before-define": "off",
                "ts/no-unsafe-declaration-merging": "off",
                "no-redeclare": "off",
                "ts/no-redeclare": "off",
                "ts/no-explicit-any": "error",
                "ts/unified-signatures": "error",
                // https://johnnyreilly.com/typescript-eslint-no-unused-vars
                "ts/no-unused-vars": [
                    "error",
                    {
                        args: "all",
                        argsIgnorePattern: "^_",
                        caughtErrors: "all",
                        caughtErrorsIgnorePattern: "^_",
                        destructuredArrayIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                        ignoreRestSiblings: true,
                    },
                ],
            },
        });
}
