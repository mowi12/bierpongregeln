import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js, tseslint, react: pluginReact },
    extends: [
      "js/recommended",
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
