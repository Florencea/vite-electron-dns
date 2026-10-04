import electronPath from "electron";
import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import type { Plugin, ViteDevServer } from "vite";
import { build } from "vite";

type BuildWatcher = Extract<Awaited<ReturnType<typeof build>>, { on: unknown }>;
type WatcherEvent = { code: string };

function isWatcher(result: unknown): result is BuildWatcher {
  return (
    typeof result === "object" &&
    result !== null &&
    "on" in result &&
    typeof result.on === "function"
  );
}

function setupWatcher(watcher: BuildWatcher, onRebuild: () => void): Promise<void> {
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

export function electronDevPlugin(): Plugin {
  return {
    name: "vite-electron-dev",
    apply(_config, { command, mode }) {
      return command === "serve" && !process.env.VITEST && mode !== "test";
    },
    configureServer(server: ViteDevServer) {
      server.httpServer?.once("listening", async () => {
        const address = server.httpServer?.address();
        let port = 5173;
        if (address && typeof address === "object") {
          port = address.port;
        }

        const protocol = server.config.server.https ? "https" : "http";
        const url = `${protocol}://localhost:${port}`;

        const env: Record<string, string | undefined> = {
          ...process.env,
          ELECTRON_RENDERER_URL: url,
        };
        delete env.ELECTRON_RUN_AS_NODE;

        let electronProcess: ChildProcess | null = null;
        let isRestarting = false;

        async function cleanExit(code = 0) {
          if (electronProcess) {
            electronProcess.removeAllListeners("close");
            electronProcess.kill();
            electronProcess = null;
          }
          try {
            await Promise.all([mainWatcher.close(), preloadWatcher.close(), server.close()]);
          } catch {
            // Ignore cleanup errors
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

          const binPath = typeof electronPath === "string" ? electronPath : "electron";
          const proc = spawn(binPath, ["."], {
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

        const mainBuildResult = await build({
          mode: "main",
          build: {
            watch: {},
          },
        });
        if (!isWatcher(mainBuildResult)) {
          throw new Error("Expected build watcher for main process");
        }
        const mainWatcher = mainBuildResult;

        const mainReady = setupWatcher(mainWatcher, () => {
          console.log("[main] changes detected, restarting Electron...");
          startElectron();
        });

        const preloadBuildResult = await build({
          mode: "preload",
          build: {
            watch: {},
          },
        });
        if (!isWatcher(preloadBuildResult)) {
          throw new Error("Expected build watcher for preload process");
        }
        const preloadWatcher = preloadBuildResult;

        const preloadReady = setupWatcher(preloadWatcher, () => {
          console.log("[preload] changes detected, reloading renderer...");
          server.ws.send({ type: "full-reload" });
        });

        await Promise.all([preloadReady, mainReady]);
        startElectron();

        process.on("SIGINT", () => {
          void cleanExit(0);
        });
        process.on("SIGTERM", () => {
          void cleanExit(0);
        });
      });
    },
  };
}
