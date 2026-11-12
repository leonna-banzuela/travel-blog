import eslint from "@eslint/js";
import astro from "eslint-plugin-astro";

export default [
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  eslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["tools/studio/studio.js"],
    languageOptions: {
      globals: {
        Headers: "readonly",
        clearTimeout: "readonly",
        crypto: "readonly",
        document: "readonly",
        Error: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
  },
  {
    files: ["tools/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
];
