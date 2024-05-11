import { Menu, app, type MenuItemConstructorOptions } from "electron";

const isDev = !app.isPackaged;

const isMac = process.platform === "darwin";

const appName = import.meta.env.VITE_TITLE;

const menuMac: Array<MenuItemConstructorOptions> = [
  {
    role: "appMenu",
    label: appName,
    submenu: [
      { role: "about", label: `關於${appName}` },
      { type: "separator" },
      { role: "hide", label: `隱藏${appName}` },
      { role: "hideOthers", label: "隱藏其他" },
      { role: "unhide", label: "全部顯示" },
      { type: "separator" },
      { role: "quit", label: `結束${appName}` },
    ],
  },
  {
    role: "fileMenu",
    label: "檔案",
    submenu: [{ role: "close", label: "關閉視窗" }],
  },
  {
    role: "editMenu",
    label: "編輯",
    submenu: [
      { role: "undo", label: "復原" },
      { role: "redo", label: "取消復原" },
      { type: "separator" },
      { role: "cut", label: "剪下" },
      { role: "copy", label: "複製" },
      { role: "paste", label: "貼上" },
      { type: "separator" },
    ],
  },
  {
    label: "檢視",
    role: "viewMenu",
    submenu: [
      { role: "reload", label: "重新載入", visible: isDev, enabled: isDev },
      {
        role: "forceReload",
        label: "強制重新載入",
        visible: isDev,
        enabled: isDev,
      },
      {
        role: "toggleDevTools",
        label: "開發人員工具",
        visible: isDev,
        enabled: isDev,
      },
      { role: "resetZoom", label: "實際大小" },
      { role: "zoomIn", label: "放大" },
      { role: "zoomOut", label: "縮小" },
    ],
  },
  {
    label: "視窗",
    role: "windowMenu",
    submenu: [
      { role: "minimize", label: "最小化" },
      { role: "zoom", label: "縮放" },
      { type: "separator" },
      { role: "front", label: "全部移至最上層" },
    ],
  },
];

const menuWindows: Array<MenuItemConstructorOptions> = [
  {
    role: "fileMenu",
    label: "檔案",
    submenu: [{ role: "quit", label: `結束${appName}` }],
  },
  {
    role: "editMenu",
    label: "編輯",
    submenu: [
      { role: "undo", label: "復原" },
      { role: "redo", label: "取消復原" },
      { type: "separator" },
      { role: "cut", label: "剪下" },
      { role: "copy", label: "複製" },
      { role: "paste", label: "貼上" },
      { type: "separator" },
    ],
  },
  {
    label: "檢視",
    role: "viewMenu",
    submenu: [
      { role: "reload", label: "重新載入", visible: isDev, enabled: isDev },
      {
        role: "forceReload",
        label: "強制重新載入",
        visible: isDev,
        enabled: isDev,
      },
      {
        role: "toggleDevTools",
        label: "開發人員工具",
        visible: isDev,
        enabled: isDev,
      },
      { role: "resetZoom", label: "重設縮放" },
      { role: "zoomIn", label: "放大" },
      { role: "zoomOut", label: "縮小" },
    ],
  },
  {
    label: "視窗",
    role: "windowMenu",
    submenu: [
      { role: "minimize", label: "最小化" },
      { role: "zoom", label: "最大化" },
      { type: "separator" },
      { role: "close", label: "關閉視窗" },
    ],
  },
];

export const menu = Menu.buildFromTemplate(isMac ? menuMac : menuWindows);
