import electron from "electron";
import { URL, fileURLToPath } from "node:url";
import { fetchHost, resolveHost } from "./dns";
import { menu } from "./menu";
const { BrowserWindow, Menu, app, ipcMain, shell } = electron;

const icon = fileURLToPath(new URL("../../build/icon.png", import.meta.url));

const createWindow = () => {
  const isDev = !app.isPackaged;

  const indexUrl = process.env.ELECTRON_RENDERER_URL ?? "";
  const indexFile = new URL(
    "../renderer/index.html",
    import.meta.url,
  ).toString();
  const preloadFile = fileURLToPath(
    new URL("../preload/index.cjs", import.meta.url),
  );

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 720,
    minHeight: 320,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: { preload: preloadFile },
    title: import.meta.env.VITE_TITLE,
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  void mainWindow.loadURL(isDev ? indexUrl : indexFile);
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  void app.whenReady().then(() => {
    app.setAppUserModelId(import.meta.env.VITE_APPID);

    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
}

Menu.setApplicationMenu(menu);

ipcMain.handle("doh", fetchHost);
ipcMain.handle("dns", resolveHost);
