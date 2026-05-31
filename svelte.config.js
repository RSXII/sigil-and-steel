import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
    }),
    paths: {
      // BASE_PATH is set to '/sigil-and-steel' in CI for GitHub Pages deployment.
      // Leave empty for local dev or custom domain.
      base: process.env.BASE_PATH || "",
    },
  },
};
