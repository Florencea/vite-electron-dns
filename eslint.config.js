import eslint from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  /**
   * base
   */
  eslint.configs.recommended,
  /**
   * typescript
   */
  ...tseslint.configs.recommended,
  /**
   * react
   */
  {
    files: ["src/renderer/src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  /**
   * ignore
   */
  {
    ignores: ["build", "dist", "out", "resources", "assets"],
  },
);

export default config;
