import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
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
    server: {
      watch: {
        ignored: ["**/src/main/**", "**/src/preload/**"],
      },
    },
    build: {
      outDir: "dist/renderer",
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      tailwindcss(),
    ],
  };
});
