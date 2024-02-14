const prettier = require("eslint-config-prettier");
const reactHooks = require("eslint-plugin-react-hooks");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [".vite", "out", "public", "src/vite-env.d.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
      ecmaVersion: 2020,
    },
    plugins: {
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  prettier,
);
