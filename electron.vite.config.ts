import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

if (process.env.NODE_ENV === "production") {
  rmSync("out", { recursive: true, force: true });
  rmSync("dist", { recursive: true, force: true });
}

export default defineConfig({
  main: {},
  preload: {
    build: {
      rollupOptions: {
        output: {
          format: "cjs",
          entryFileNames: "index.js",
        },
      },
    },
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          main: resolve("src/renderer/index.html"),
        },
      },
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@resources": resolve("resources"),
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
