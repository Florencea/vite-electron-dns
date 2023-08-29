import { BrowserWindow, app, ipcMain, shell } from "electron";
import path from "node:path";
import { getDnsResults } from "./libs/dns";

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
    icon: path.join(process.env.VITE_PUBLIC, "icon.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
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
ipcMain.handle("open-win", (event, arg) => {
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

ipcMain.handle(
  "dns",
  async (_, reqData: { hosts: string; servers: string[] }) => {
    try {
      const resultsStr = await Promise.all(
        reqData.servers.map(async (server) => {
          const results = await getDnsResults({ hosts: reqData.hosts, server });
          return results;
        }),
      );
      return { msg: "ok", data: resultsStr };
    } catch (error) {
      return { msg: `DNS ERROR|${error.message}` };
    }
  },
);
