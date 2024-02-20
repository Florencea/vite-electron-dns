import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: Infinity,
    reportCompressedSize: false,
  },
  plugins: [
    react(),
    renderer({
      resolve: {
        electron: { type: "cjs" },
      },
    }),
  ],
});
