import react from "@vitejs/plugin-react";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";
import { pluginExposeRenderer } from "./vite.base.config";

export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: {
      chunkSizeWarningLimit: Infinity,
      reportCompressedSize: false,
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      react(),
      renderer({
        resolve: {
          electron: { type: "cjs" },
        },
      }),
      pluginExposeRenderer(name),
    ],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
