import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://aborruso.github.io",
  base: "/pa_mi_senti/",
  trailingSlash: "always",
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ]
});
