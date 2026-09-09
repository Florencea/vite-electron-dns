import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { _electron as electron } from "playwright";

function findExecutable(): string {
  const releaseDir = path.resolve(process.cwd(), "release");
  if (!fs.existsSync(releaseDir)) {
    throw new Error(
      `Release directory not found at ${releaseDir}. Did you run "npm run pack"?`,
    );
  }

  if (process.platform === "darwin") {
    const entries = fs.readdirSync(releaseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith("mac")) {
        const macDir = path.join(releaseDir, entry.name);
        const appEntries = fs.readdirSync(macDir, { withFileTypes: true });
        for (const app of appEntries) {
          if (app.isDirectory() && app.name.endsWith(".app")) {
            const macOSDir = path.join(macDir, app.name, "Contents", "MacOS");
            if (fs.existsSync(macOSDir)) {
              const binEntries = fs.readdirSync(macOSDir);
              if (binEntries.length > 0) {
                return path.join(macOSDir, binEntries[0]);
              }
            }
          }
        }
      }
    }
  } else if (process.platform === "win32") {
    const winDir = path.join(releaseDir, "win-unpacked");
    if (fs.existsSync(winDir)) {
      const entries = fs.readdirSync(winDir);
      const exe = entries.find(
        (file) =>
          file.endsWith(".exe") && !file.toLowerCase().includes("uninstall"),
      );
      if (exe) {
        return path.join(winDir, exe);
      }
    }
  } else {
    // Linux
    const linuxDir = path.join(releaseDir, "linux-unpacked");
    if (fs.existsSync(linuxDir)) {
      const isExecutable = (filename: string): boolean => {
        try {
          const fullPath = path.join(linuxDir, filename);
          const stat = fs.statSync(fullPath);
          return stat.isFile() && (stat.mode & 0o111) !== 0;
        } catch {
          return false;
        }
      };

      const entries = fs.readdirSync(linuxDir);

      // Check package name or productName first
      const candidateNames: string[] = [];
      const pkgPath = path.resolve(process.cwd(), "package.json");
      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
            name?: string;
            productName?: string;
          };
          if (pkg.name) {
            candidateNames.push(pkg.name);
          }
          if (pkg.productName) {
            candidateNames.push(pkg.productName);
          }
        } catch {
          // ignore error and proceed with fallback
        }
      }
      if (process.env.VITE_TITLE) {
        candidateNames.push(process.env.VITE_TITLE);
      }

      for (const name of candidateNames) {
        if (entries.includes(name) && isExecutable(name)) {
          return path.join(linuxDir, name);
        }
      }

      // Fallback: exclude helper binaries, crashpad, and non-executable/dotted files
      const ignoredBinaries = new Set([
        "chrome-sandbox",
        "chrome_crashpad_handler",
        "crashpad_handler",
      ]);

      const exe = entries.find((file) => {
        if (
          file.includes(".") ||
          file.startsWith("chrome-") ||
          file.startsWith("chrome_") ||
          file.includes("crashpad") ||
          ignoredBinaries.has(file)
        ) {
          return false;
        }
        return isExecutable(file);
      });
      if (exe) {
        return path.join(linuxDir, exe);
      }
    }
  }

  throw new Error(
    `Unable to locate packaged executable for platform "${process.platform}" in ${releaseDir}`,
  );
}

async function runSmokeTest(): Promise<void> {
  const executablePath = findExecutable();
  console.log(`[smoke-test] Found packaged executable: ${executablePath}`);

  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && key !== "ELECTRON_RUN_AS_NODE") {
      env[key] = value;
    }
  }

  const pageErrors: Error[] = [];

  const app = await electron.launch({
    executablePath,
    env,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  try {
    console.log("[smoke-test] Waiting for first window...");
    const window = await app.firstWindow();

    window.on("pageerror", (error: Error) => {
      console.error("[smoke-test] Page error:", error);
      pageErrors.push(error);
    });

    console.log("[smoke-test] Waiting for DOMContentLoaded...");
    await window.waitForLoadState("domcontentloaded");

    const title = await window.title();
    console.log(`[smoke-test] Window title: "${title}"`);
    if (!title || title.trim().length === 0) {
      throw new Error(
        "Window title is empty! Document title was not properly set.",
      );
    }

    console.log("[smoke-test] Verifying #root element render...");
    const rootLocator = window.locator("#root");
    await rootLocator.waitFor({ state: "attached", timeout: 10_000 });

    const innerHtml = await rootLocator.innerHTML();
    if (innerHtml.trim().length === 0) {
      throw new Error(
        "Application #root element is empty! React failed to render UI.",
      );
    }

    if (pageErrors.length > 0) {
      const errorMessages = pageErrors.map((err) => err.message).join("; ");
      throw new Error(
        `Encountered page errors during launch: ${errorMessages}`,
      );
    }

    console.log(
      `[smoke-test] UI successfully rendered (${innerHtml.length.toString()} bytes of HTML).`,
    );
  } finally {
    console.log("[smoke-test] Closing application...");
    await app.close();
  }

  console.log("[smoke-test] Smoke test passed successfully!");
}

runSmokeTest().catch((error: unknown) => {
  console.error("[smoke-test] Test failed:", error);
  process.exit(1);
});
