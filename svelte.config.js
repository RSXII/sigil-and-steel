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
      // Set this to your GitHub repo name if deploying to a subdirectory
      // e.g. base: '/sigil-and-steel'
      // Leave empty if deploying to a custom domain or root
      base: process.env.BASE_PATH || "",
    },
  },
};
