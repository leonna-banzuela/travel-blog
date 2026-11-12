import { defineConfig } from "astro/config";
import process from "node:process";

export default defineConfig({
  site: process.env.SITE_URL,
  devToolbar: {
    enabled: false,
  },
  output: "static",
  server: {
    host: "127.0.0.1",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
