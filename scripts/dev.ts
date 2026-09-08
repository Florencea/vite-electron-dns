import electronPath from "electron";
import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { build, createServer } from "vite";

// 1. Build main and preload for development
await build({
  build: {
    ssr: "src/main/index.ts",
    outDir: "dist/main",
  },
  configFile: false,
});
await build({ mode: "preload" });

// 2. Start Vite dev server for renderer
const server = await createServer();
await server.listen();

const url = server.resolvedUrls?.local[0] ?? "http://localhost:5173";

const env: Record<string, string | undefined> = {
  ...process.env,
  ELECTRON_RENDERER_URL: url,
};
delete env.ELECTRON_RUN_AS_NODE;

const electronProcess: ChildProcess = spawn(
  electronPath as unknown as string,
  ["."],
  {
    stdio: "inherit",
    env,
  },
);

electronProcess.on("close", (code: number | null) => {
  void server.close().then(() => {
    process.exit(code ?? 0);
  });
});
