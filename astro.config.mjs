import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const BASE_PATH = process.env.ASTRO_BASE ?? "/";

export default defineConfig({
  site: "https://aborruso.github.io",
  base: BASE_PATH,
  trailingSlash: "always",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ]
});
