import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/playground", component: "playground" },
  ],
  npmClient: "pnpm",
  publicPath: "/free-code.github.io/",
});
