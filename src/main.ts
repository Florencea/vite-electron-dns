import { BrowserWindow, app, ipcMain, shell } from "electron";
import { promises } from "node:dns";
import path from "node:path";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

process.env.ROOT = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.ROOT, ".vite", "build");
process.env.VITE_PUBLIC = app.isPackaged
  ? path.join(process.env.ROOT, "renderer", MAIN_WINDOW_VITE_NAME)
  : process.env.DIST;
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

const preload = path.join(process.env.DIST, "preload.js");
const devUrl = MAIN_WINDOW_VITE_DEV_SERVER_URL;
const indexHtml = path.join(process.env.VITE_PUBLIC, "index.html");

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    title: "Loading...",
    width: 1440,
    height: 600,
    resizable: false,
    fullscreenable: false,
    icon: path.join(process.env.VITE_PUBLIC ?? "/", "icon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: !app.isPackaged,
    },
  });

  // disable windows menu bar
  // win.setMenu(null);

  if (app.isPackaged) {
    // disable macOS menu bar
    // Menu.setApplicationMenu(Menu.buildFromTemplate([]));
    win.loadFile(indexHtml);
  } else {
    // Open the DevTools.
    // win.webContents.openDevTools();
    win.loadURL(devUrl);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
};

app.whenReady().then(createWindow);

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${devUrl}/#${arg}`);
  }
});

interface DnsQueryT {
  server: string;
  ip: string;
  name: string;
  type: "A" | "AAAA";
}

interface AnsT {
  Answer: { type: number; data: string }[];
  Comment: string;
  nameServer: string;
}

const fetchDns = async ({ server, name, type }: DnsQueryT): Promise<string> => {
  try {
    if (server === "-") {
      return "";
    }
    const url = new URL(server);
    url.searchParams.set("name", name);
    url.searchParams.set("type", type);
    const t0 = performance.now();
    const res = await fetch(
      new Request(url, {
        method: "GET",
        headers: {
          Accept: "application/dns-json",
        },
      }),
    );
    const t1 = performance.now();
    if (!(res.status >= 200 && res.status < 300)) {
      throw new Error(`Request failed on status ${res.status}`);
    }
    const ans: AnsT = await res.json();
    if (!ans?.Answer) {
      return "";
    }
    const data = [
      `${(t1 - t0).toFixed(2)}ms`,
      ...(ans.Answer ?? []).map((d) => d.data),
    ].join("\n");
    return data;
  } catch {
    return "";
  }
};

const resolveDns = async ({ ip, name, type }: DnsQueryT) => {
  try {
    const resolver = new promises.Resolver();
    if (ip !== "-") {
      resolver.setServers([ip]);
    }
    if (type === "A") {
      const t0 = performance.now();
      const address = await resolver.resolve4(name);
      const t1 = performance.now();
      return [`${(t1 - t0).toFixed(2)}ms`, ...address].join("\n");
    } else {
      const t0 = performance.now();
      const address = await resolver.resolve6(name);
      const t1 = performance.now();
      return [`${(t1 - t0).toFixed(2)}ms`, ...address].join("\n");
    }
  } catch {
    return "";
  }
};

const fetchHost = (
  type: "A" | "AAAA",
  name: string,
  servers: { title: string; server: string; ip: string }[],
) =>
  name
    ? Promise.all(
        servers.map(({ server, ip }) => fetchDns({ server, name, type, ip })),
      )
    : Promise.resolve([]);

const resolveHost = (
  type: "A" | "AAAA",
  name: string,
  servers: { title: string; server: string; ip: string }[],
) =>
  name
    ? Promise.all(
        servers.map(({ server, ip }) => resolveDns({ server, name, type, ip })),
      )
    : Promise.resolve([]);

ipcMain.handle("doh", async (_, type, name, servers) => {
  const res = await fetchHost(type, name, servers);
  return res;
});

ipcMain.handle("dns", async (_, type, name, servers) => {
  const res = await resolveHost(type, name, servers);
  return res;
});
