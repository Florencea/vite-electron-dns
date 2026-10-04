import electron from "electron";
import path from "node:path";
import { APP_CONFIG } from "../shared/config";
import { fetchHost, resolveHost } from "./dns";
import { menu } from "./menu";

const { BrowserWindow, Menu, app, ipcMain, shell } = electron;

const icon = path.join(import.meta.dirname, "../../build/icon.png");

const createWindow = () => {
  const isDev = !app.isPackaged;
  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  const rendererHtml = path.join(import.meta.dirname, "../renderer/index.html");
  const preloadFile = path.join(import.meta.dirname, "../preload/index.cjs");

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 720,
    minHeight: 320,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: { preload: preloadFile },
    title: APP_CONFIG.title,
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev && rendererUrl !== undefined && rendererUrl.length > 0) {
    void mainWindow.loadURL(rendererUrl);
  } else {
    void mainWindow.loadFile(rendererHtml);
  }
};

async function bootstrap(): Promise<void> {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  await app.whenReady();
  app.setAppUserModelId(APP_CONFIG.appId);

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
}

Menu.setApplicationMenu(menu);

ipcMain.handle("doh", fetchHost);
ipcMain.handle("dns", resolveHost);

void bootstrap();
