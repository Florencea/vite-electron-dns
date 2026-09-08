import electronPath from "electron";
import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { build, createServer } from "vite";

type BuildWatcher = Extract<Awaited<ReturnType<typeof build>>, { on: unknown }>;
type WatcherEvent = { code: string };

// 1. Start Vite dev server for renderer
const server = await createServer();
await server.listen();

const url = server.resolvedUrls?.local[0] ?? "http://localhost:5173";

const env: Record<string, string | undefined> = {
  ...process.env,
  ELECTRON_RENDERER_URL: url,
};
delete env.ELECTRON_RUN_AS_NODE;

let electronProcess: ChildProcess | null = null;
let isRestarting = false;

function setupWatcher(
  watcher: BuildWatcher,
  onRebuild: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    let isFirstBuild = true;
    watcher.on("event", (event: WatcherEvent) => {
      if (event.code === "BUNDLE_END") {
        if (isFirstBuild) {
          isFirstBuild = false;
          resolve();
        } else {
          onRebuild();
        }
      }
    });
  });
}

// 2. Watch main process
const mainWatcher = (await build({
  build: {
    ssr: "src/main/index.ts",
    outDir: "dist/main",
    watch: {},
  },
  configFile: false,
})) as BuildWatcher;

const mainReady = setupWatcher(mainWatcher, () => {
  console.log("[main] changes detected, restarting Electron...");
  startElectron();
});

// 3. Watch preload process
const preloadWatcher = (await build({
  mode: "preload",
  build: {
    watch: {},
  },
})) as BuildWatcher;

const preloadReady = setupWatcher(preloadWatcher, () => {
  console.log("[preload] changes detected, reloading renderer...");
  server.ws.send({ type: "full-reload" });
});

async function cleanExit(code = 0): Promise<never> {
  if (electronProcess) {
    electronProcess.removeAllListeners("close");
    electronProcess.kill();
    electronProcess = null;
  }
  try {
    await Promise.all([
      mainWatcher.close(),
      preloadWatcher.close(),
      server.close(),
    ]);
  } catch {
    // Ignore cleanup errors on exit
  } finally {
    process.exit(code);
  }
}

function startElectron() {
  if (electronProcess) {
    isRestarting = true;
    electronProcess.removeAllListeners("close");
    electronProcess.kill();
    electronProcess = null;
  }

  const proc = spawn(electronPath as unknown as string, ["."], {
    stdio: "inherit",
    env,
  });

  proc.on("close", (code: number | null) => {
    if (!isRestarting) {
      void cleanExit(code ?? 0);
    }
    isRestarting = false;
  });

  electronProcess = proc;
}

// 4. Launch Electron after both main and preload initial builds complete
await Promise.all([preloadReady, mainReady]);
startElectron();

process.on("SIGINT", () => {
  void cleanExit(0);
});

process.on("SIGTERM", () => {
  void cleanExit(0);
});
