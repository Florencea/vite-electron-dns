import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["build", "dist", "release", ".vitest"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow async functions in JSX event handlers
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      // Allow both type aliases and interfaces
      "@typescript-eslint/consistent-type-definitions": "off",
      // Ban @ts-ignore and require description for @ts-expect-error
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": true,
          "ts-expect-error": "allow-with-description",
          "ts-nocheck": true,
          "ts-check": false,
          minimumDescriptionLength: 5,
        },
      ],
    },
  },
  {
    files: ["src/renderer/**/*.{ts,tsx}", "test/renderer/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite()],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: [
      "src/main/**/*.{ts,tsx}",
      "src/preload/**/*.{ts,tsx}",
      "src/shared/**/*.{ts,tsx}",
      "test/main/**/*.{ts,tsx}",
      "test/canary/**/*.{ts,tsx}",
      "scripts/**/*.ts",
      "*.config.ts",
      "electron-builder-config.ts",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
