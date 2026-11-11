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
];
