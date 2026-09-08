import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "preload") {
    return {
      build: {
        ssr: "src/preload/index.ts",
        outDir: "dist/preload",
        rolldownOptions: {
          output: {
            format: "cjs",
            entryFileNames: "index.cjs",
          },
        },
      },
    };
  }

  return {
    base: "./",
    build: {
      outDir: "dist/renderer",
    },
    plugins: [react(), tailwindcss()],
  };
});
