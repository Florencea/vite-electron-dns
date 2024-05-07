/* eslint-disable @typescript-eslint/no-var-requires */
const eslint = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const globals = require("globals");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["eslint.config.js", "postcss.config.js", "tailwind.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: [".vite", "out", "public", "src/vite-env.d.ts"],
  },
  prettier,
);
