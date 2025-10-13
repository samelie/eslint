/**
 * ESLint Configuration based on @antfu/eslint-config
 *
 * This configuration extends Anthony Fu's ESLint config with custom overrides for:
 * - Stylistic preferences (4-space indent, double quotes, semicolons)
 * - Type safety (strict any prevention)
 * - Flexible code organization (allow declaration merging, hoisting)
 * - Custom plugins (rad rules, no-barrel-files)
 *
 * Structure:
 * 1. Base config with stylistic preferences
 * 2. Custom plugin rules
 * 3. General rule overrides
 * 4. Unicorn plugin overrides
 * 5. Stylistic rule overrides
 * 6. TypeScript rule overrides
 *
 * Reference: https://github.com/antfu/eslint-config
 */

import radPlguins from "@adddog/eslint-plugin-rules";
import antfu from "@antfu/eslint-config";

import eslintPluginNoBarrelFiles from "eslint-plugin-no-barrel-files";

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
        // ========================================
        // General overrides
        // ========================================
        {
            rules: {
                // ---- Core ESLint Rules ----

                // max-len: Not part of antfu's config by default (would need separate plugin)
                // Turned off to avoid line length restrictions
                "max-len": "off",

                // curly: Not enforced by default in antfu's config
                // Turned off to allow single-line if statements without braces
                "curly": "off",

                // func-style: Not enforced by default
                // Turned off to allow both function declarations and expressions
                "func-style": "off",

                // antfu/curly: Default "error" (enforces curly braces with specific style)
                // Turned off to be less opinionated about brace style
                "antfu/curly": "off",

                // accessor-pairs: Default ["error", { enforceForClassMembers: true, setWithoutGet: true }]
                // Turned off to allow getters without corresponding setters
                "accessor-pairs": "off",

                // antfu/if-newline: Default "error" (enforces newline after if statement)
                // Turned off for more flexible if statement formatting
                "antfu/if-newline": "off",

                // antfu/consistent-list-newline: Default "error" (enforces consistent newlines in arrays/objects)
                // Turned off to allow mixed single-line and multi-line arrays/objects
                "antfu/consistent-list-newline": "off",

                // ---- TypeScript Rules ----

                // ts/consistent-type-definitions: Default ["error", "interface"]
                // Turned off to allow both "interface" and "type" for type definitions
                "ts/consistent-type-definitions": "off",

                // ts/no-redeclare: Default ["error", { builtinGlobals: false }]
                // Turned off to allow declaration merging (interfaces, namespaces)
                "ts/no-redeclare": "off",

                // ts/no-unused-expressions: Default ["error", { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true }]
                // Turned off to allow expressions like optional chaining that may not have side effects
                "ts/no-unused-expressions": "off",

                // ts/no-explicit-any: Default "off" in antfu's config
                // Set to "error" to enforce strict typing and prevent use of "any"
                "ts/no-explicit-any": "error",

                // prefer-arrow-callback: Default ["error", { allowNamedFunctions: false, allowUnboundThis: true }]
                // Modified to allow named function expressions in callbacks for better stack traces
                "prefer-arrow-callback": [
                    "error",
                    {
                        allowNamedFunctions: true, // Changed from false
                        allowUnboundThis: true,
                    },
                ],
            },
        },
        ...userConfigs,
    )
        // ========================================
        // Unicorn plugin overrides
        // ========================================
        .override("antfu/unicorn/rules", {
            rules: {
                // unicorn/no-new-array: Default "error" (enforces array literals over new Array())
                // Turned off to allow new Array(length) for creating arrays with specific length
                "unicorn/no-new-array": "off",

                // Other unicorn rules enabled by default in antfu's config (for reference):
                // - unicorn/consistent-empty-array-spread: "error"
                // - unicorn/error-message: "error" (require error messages)
                // - unicorn/escape-case: "error" (enforce uppercase hex escapes)
                // - unicorn/new-for-builtins: "error" (enforce new for builtins)
                // - unicorn/no-instanceof-builtins: "error"
                // - unicorn/no-new-buffer: "error" (use Buffer.from/Buffer.alloc)
                // - unicorn/number-literal-case: "error" (enforce lowercase for number literals)
                // - unicorn/prefer-dom-node-text-content: "error"
                // - unicorn/prefer-includes: "error" (prefer includes over indexOf)
                // - unicorn/prefer-node-protocol: "error" (enforce node: protocol)
                // - unicorn/prefer-number-properties: "error" (prefer Number.isNaN over isNaN)
                // - unicorn/prefer-string-starts-ends-with: "error"
                // - unicorn/prefer-type-error: "error"
                // - unicorn/throw-new-error: "error" (require new when throwing errors)
            },
        })
        // ========================================
        // Stylistic overrides
        // ========================================
        .override("antfu/stylistic/rules", {
            rules: {
                // antfu/top-level-function: Default "error" (enforces function declarations at top level)
                // Reference: https://github.com/antfu/eslint-config/blob/main/src/configs/stylistic.ts#L61
                // Turned off to allow const/arrow functions at top level
                "antfu/top-level-function": "off",

                // style/arrow-parens: Default depends on stylistic config
                // Set to "as-needed" to only require parens when necessary (multiple params, etc)
                "style/arrow-parens": ["error", "as-needed"],

                // style/operator-linebreak: Default enforces operators at end/beginning of line
                // Turned off for flexible operator placement in multi-line expressions
                "style/operator-linebreak": "off",

                // style/array-element-newline: Default "off" in antfu's config
                // Reference: https://eslint.style/rules/default/array-element-newline
                // Kept off because it causes issues with large objects in arrays
                "style/array-element-newline": "off",

                // style/max-statements-per-line: Default { max: 1 }
                // Increased to 2 to allow simple statements on same line (e.g., case statements)
                "style/max-statements-per-line": ["error", {
                    max: 2,
                }],

                // style/function-call-argument-newline: Default varies
                // Set to "consistent" so all arguments are either inline or one-per-line
                "style/function-call-argument-newline": ["error", "consistent"],

                // style/brace-style: Default depends on stylistic preset
                // Set to "1tbs" (one true brace style) with single-line exception
                "style/brace-style": ["error", "1tbs", {
                    allowSingleLine: true,
                }],

                // Other notable stylistic rules from antfu's config (using your custom config):
                // - indent: 4 (default: 2)
                // - quotes: "double" (default: "single")
                // - semi: true (default: false)
                // - style/generator-star-spacing: ["error", { after: true, before: false }]
                // - style/yield-star-spacing: ["error", { after: true, before: false }]
                // - antfu/consistent-chaining: "error" (enforces consistent chaining style)
            },
        })
        // ========================================
        // TypeScript-specific overrides
        // ========================================
        // Rules are scoped to names
        // Reference: https://github.com/antfu/eslint-config/blob/93c9e772faf45295a4deb2633a4655954da74491/src/configs/typescript.ts#L110
        .override("antfu/typescript/rules", {
            rules: {
                // ts/no-use-before-define: Default ["error", { classes: false, functions: false, variables: true }]
                // Turned off to allow hoisting and more flexible declaration order
                "ts/no-use-before-define": "off",

                // ts/no-unsafe-declaration-merging: Default not explicitly set (likely "error")
                // Turned off to allow declaration merging patterns (e.g., interface + namespace)
                "ts/no-unsafe-declaration-merging": "off",

                // no-redeclare: Default ["error", { builtinGlobals: false }]
                // Turned off in favor of TypeScript's own redeclaration checks
                "no-redeclare": "off",

                // ts/no-redeclare: Default ["error", { builtinGlobals: false }]
                // Turned off to allow declaration merging (same as general overrides)
                "ts/no-redeclare": "off",

                // ts/no-explicit-any: Default "off" in antfu's config
                // Set to "error" to enforce strict typing and prevent use of "any"
                // This is a critical rule for type safety
                "ts/no-explicit-any": "error",

                // ts/unified-signatures: Default "off" in antfu's config
                // Set to "error" to enforce combining overloaded signatures where possible
                "ts/unified-signatures": "error",

                // ts/no-unused-vars: Default "off" in antfu's typescript config (handled by unused-imports plugin)
                // Reference: https://johnnyreilly.com/typescript-eslint-no-unused-vars
                // Configured with strict underscore-prefix ignore pattern for intentionally unused variables
                "ts/no-unused-vars": [
                    "error",
                    {
                        args: "all", // Check all arguments (default: "after-used")
                        argsIgnorePattern: "^_", // Allow _unused arguments
                        caughtErrors: "all", // Check caught errors (default: "none")
                        caughtErrorsIgnorePattern: "^_", // Allow _error in catch blocks
                        destructuredArrayIgnorePattern: "^_", // Allow [_skip, value] patterns
                        varsIgnorePattern: "^_", // Allow _unusedVar
                        ignoreRestSiblings: true, // Allow const { removed, ...rest } patterns
                    },
                ],

                // Other important TypeScript rules from antfu's config (for reference):
                // - ts/ban-ts-comment: ["error", { "ts-expect-error": "allow-with-description" }]
                // - ts/consistent-type-definitions: ["error", "interface"] (you override to "off")
                // - ts/consistent-type-imports: ["error", { disallowTypeAnnotations: false, fixStyle: "separate-type-imports", prefer: "type-imports" }]
                // - ts/method-signature-style: ["error", "property"] (prefer property syntax)
                // - ts/no-dupe-class-members: "error"
                // - ts/no-dynamic-delete: "off"
                // - ts/no-empty-object-type: ["error", { allowInterfaces: "always" }]
                // - ts/no-import-type-side-effects: "error"
                // - ts/no-invalid-void-type: "off"
                // - ts/no-non-null-assertion: "off"
                // - ts/no-require-imports: "error"
                // - ts/no-unused-expressions: ["error", { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true }]
                // - ts/no-useless-constructor: "off"
                // - ts/no-wrapper-object-types: "error"
                // - ts/triple-slash-reference: "off"

                // ========================================
                // Notable rules you might want to consider:
                // ========================================
                //
                // Type-aware rules (require tsconfigPath):
                // - ts/await-thenable: "error" - Only await thenables
                // - ts/no-floating-promises: "error" - Promises must be handled
                // - ts/no-misused-promises: "error" - Prevent common promise mistakes
                // - ts/no-unnecessary-type-assertion: "error" - Remove redundant assertions
                // - ts/no-unsafe-argument: "error" - Prevent any in function arguments
                // - ts/no-unsafe-assignment: "error" - Prevent assigning any to typed variables
                // - ts/no-unsafe-call: "error" - Prevent calling any as function
                // - ts/no-unsafe-member-access: "error" - Prevent accessing properties of any
                // - ts/no-unsafe-return: "error" - Prevent returning any from typed functions
                // - ts/strict-boolean-expressions: "error" - Strict boolean checks in conditions
                // - ts/switch-exhaustiveness-check: "error" - Ensure all cases handled in switch
                //
                // Naming conventions:
                // - ts/naming-convention: Configure consistent naming patterns
                //
                // Import organization:
                // - ts/consistent-type-imports: ["error", { prefer: "type-imports" }] (already enabled in antfu)
                // - perfectionist/sort-imports: "error" (available in antfu's perfectionist config)
                //
                // Code quality:
                // - complexity: ["error", 10] - Limit cyclomatic complexity
                // - max-depth: ["error", 4] - Limit nesting depth
                // - max-nested-callbacks: ["error", 3] - Limit callback nesting
            },
        });
}
