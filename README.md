# @adddog/eslint

> Shared ESLint configuration for the monorepo, built on [@antfu/eslint-config](https://github.com/antfu/eslint-config)

![Overview](https://raw.githubusercontent.com/samradical/readme-images/refs/heads/main/overview-fs8.png)

This package provides a TypeScript-focused ESLint configuration that emphasizes:

- **Type Safety**: Strict enforcement against `any` types
- **Code Quality**: Sensible defaults with flexibility for real-world patterns
- **Developer Experience**: 4-space indentation, double quotes, semicolons
- **Modern Patterns**: Support for declaration merging, hoisting, and functional programming

## Installation

### From npm

```bash
npm install --save-dev @adddog/eslint
# or
pnpm add -D @adddog/eslint
# or
yarn add -D @adddog/eslint
```

Then add to your `package.json`:

```json
{
  "devDependencies": {
    "@adddog/eslint": "^0.0.1"
  }
}
```

### From GitHub

Install directly from the GitHub repository:

```bash
npm install --save-dev github:samelie/eslint
# or
pnpm add -D github:samelie/eslint
# or
yarn add -D github:samelie/eslint
```

Or specify a specific tag/commit:

```bash
npm install --save-dev github:samelie/eslint#v0.0.1
```

### In Monorepo (Workspace)

For internal monorepo use with workspace protocol:

```json
{
  "devDependencies": {
    "@adddog/eslint": "workspace:*"
  }
}
```

### Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "@eslint/js": "^9.37.0",
  "typescript": "^5.9.3"
}
```

Install them if not already present:

```bash
pnpm add -D eslint typescript
```

## Usage

### Basic Setup

Create an `eslint.config.mjs` in your package:

```js
import radEslint from "@adddog/eslint";

export default radEslint();
```

### With Custom Ignores

```js
import radEslint from "@adddog/eslint";

export default radEslint({
  ignores: ["**/generated/**", "**/fixtures/**"]
});
```

### With Additional Rules

```js
import radEslint from "@adddog/eslint";

export default radEslint(
  {
    // Base options
    typescript: true,
  },
  // Additional config objects
  {
    rules: {
      "no-console": "error",
    },
  }
);
```

## Configuration Philosophy

### What's Different from antfu's Defaults?

#### Stylistic Preferences
- **Indentation**: 4 spaces (default: 2)
- **Quotes**: Double quotes (default: single)
- **Semicolons**: Required (default: none)
- **Arrow Parens**: As needed (default: varies)
- **Brace Style**: 1TBS with single-line exception

#### Type Safety (Stricter)
- `ts/no-explicit-any`: **error** (default: off) - No `any` allowed
- `ts/unified-signatures`: **error** (default: off) - Combine overloads

#### Flexibility (More Permissive)
- `antfu/curly`: **off** - Allow single-line if statements
- `antfu/top-level-function`: **off** - Allow arrow functions at top level
- `ts/consistent-type-definitions`: **off** - Allow both `type` and `interface`
- `ts/no-redeclare`: **off** - Allow declaration merging
- `ts/no-use-before-define`: **off** - Allow hoisting

### Custom Plugins

1. **@adddog/eslint-plugin-rules**
   - `rad/no-incorrect-pkg-imports`: Enforces correct package imports

2. **eslint-plugin-no-barrel-files**
   - Prevents barrel file patterns (index re-exports)

## Key Rules Reference

### Enforced for Type Safety

```ts
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: unknown = fetchData();
const validated = DataSchema.parse(data);
```

### Unused Variables Pattern

Use underscore prefix for intentionally unused variables:

```ts
// ✅ Good
const [_first, second] = array;
const { removed: _removed, ...rest } = object;

function handler(_unusedParam: string, used: number) {
  return used * 2;
}

try {
  // ...
} catch (_error) {
  // Error intentionally ignored
}
```

### Declaration Merging Allowed

```ts
// ✅ Allowed
interface User {
  name: string;
}

namespace User {
  export function create(name: string): User {
    return { name };
  }
}
```

### Flexible Function Styles

```ts
// ✅ All allowed at top level
export function declarationStyle() {}

export const arrowStyle = () => {};

export const namedCallback = array.map(function process(item) {
  // Named for better stack traces
  return item * 2;
});
```

## Architecture Decisions

### Why These Overrides?

**`ts/no-explicit-any`: error**
- Prevents type safety holes
- Forces explicit typing with `unknown`
- Aligns with TypeScript's strict mode philosophy

**`antfu/top-level-function`: off**
- Modern codebases often prefer const exports
- Tree-shaking works well with arrow functions
- Consistency with internal module patterns

**`ts/no-redeclare`: off**
- TypeScript's declaration merging is powerful
- Needed for namespace + interface patterns
- Type-safe when used correctly

**`ts/no-use-before-define`: off**
- Functions can be hoisted for better organization
- TypeScript catches actual usage errors
- Allows grouping related functions naturally

### Disabled Stylistic Rules

These are turned off for pragmatic reasons:

- `antfu/consistent-list-newline`: Can be too strict with large objects
- `style/operator-linebreak`: Allows flexible multi-line expressions
- `accessor-pairs`: Getters without setters are valid patterns

## Type-Aware Linting

To enable advanced type-aware rules (requires project setup):

```js
import radEslint from "@adddog/eslint";

export default radEslint({
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
```

This enables rules like:
- `ts/await-thenable` - Only await promises
- `ts/no-floating-promises` - Require promise handling
- `ts/no-unnecessary-type-assertion` - Remove redundant assertions
- `ts/strict-boolean-expressions` - Strict conditionals

See the [config source](./src/eslint.config.ts) for a complete list of available type-aware rules.

## Development

### Scripts

| Script      | Description                          |
|-------------|--------------------------------------|
| `build`     | Build the package with unbuild       |
| `lint`      | Lint the package source              |
| `lint:fix`  | Auto-fix linting issues              |
| `types`     | Type-check the package               |
| `knip`      | Check for unused dependencies        |

### Testing Changes

After making changes to the config:

1. **Build the package**:
   ```bash
   pnpm build
   ```

2. **Test in a consuming package**:
   ```bash
   cd ../../park-app  # or any app
   pnpm lint
   ```

3. **Verify no regressions**:
   ```bash
   pnpm lint  # From monorepo root
   ```

### Publishing to npm

The package includes `prepublishOnly` hooks that automatically run linting, type-checking, and building before publishing:

1. **Update version in package.json**:
   ```bash
   npm version patch  # or minor, major
   ```

2. **Publish to npm**:
   ```bash
   npm publish
   ```

The `prepublishOnly` script will automatically:
- Run `pnpm lint` - Ensure code quality
- Run `pnpm types` - Verify TypeScript types
- Run `pnpm build` - Build distribution files

If any step fails, the publish will be aborted.

## Extending the Config

### Adding New Rules

Edit `src/eslint.config.ts`:

```ts
.override("antfu/typescript/rules", {
  rules: {
    // Add your rule here
    "ts/explicit-function-return-type": ["error", {
      allowExpressions: true,
    }],
  },
})
```

### Per-Package Overrides

In consuming packages, override specific rules:

```js
import radEslint from "@adddog/eslint";

export default radEslint(
  {},
  {
    files: ["**/*.test.ts"],
    rules: {
      "ts/no-explicit-any": "off", // Allow any in tests
    },
  }
);
```

## Resources

- [antfu/eslint-config](https://github.com/antfu/eslint-config) - Base configuration
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) - Modern config format
- [@stylistic/eslint-plugin](https://eslint.style/) - Stylistic rules
- [typescript-eslint](https://typescript-eslint.io/) - TypeScript rules

## FAQ

### Why not use Prettier?

This config uses `@stylistic/eslint-plugin` for formatting, which:
- Integrates seamlessly with ESLint
- Allows gradual adoption of formatting rules
- Provides better TypeScript-specific formatting

### Can I use this outside the monorepo?

Yes! This package can be installed from npm or directly from GitHub:

```bash
# From npm (when published)
pnpm add -D @adddog/eslint

# From GitHub
pnpm add -D github:samelie/eslint
```

See the [Installation](#installation) section for more details.

### How do I disable a rule temporarily?

```ts
// eslint-disable-next-line ts/no-explicit-any
const legacy: any = oldApi();
```

Or for a whole file:

```ts
/* eslint-disable ts/no-explicit-any */
// File with many legacy patterns
```

### Why are barrel files forbidden?

Barrel files (index re-exports) can:
- Harm tree-shaking
- Create circular dependencies
- Slow down builds
- Make imports ambiguous

Prefer direct imports: `import { foo } from "./foo"` instead of `import { foo } from "./index"`

## License

See [LICENSE](./LICENSE) for details.
