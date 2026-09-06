import { BrowserWindow, Menu, app, ipcMain, shell, type IpcMainInvokeEvent } from "electron";
import { Resolver } from "node:dns/promises";
import { isIPv4, isIPv6 } from "node:net";
import { URL, fileURLToPath } from "node:url";
import icon from "../../resources/icon.png?asset";
import { menu } from "./menu";

const createWindow = () => {
  const isDev = !app.isPackaged;

  const indexUrl = process.env.ELECTRON_RENDERER_URL!;
  const indexFile = new URL("../renderer/index.html", import.meta.url).toString();
  const preloadFile = fileURLToPath(new URL("../preload/index.js", import.meta.url));

  const mainWindow = new BrowserWindow({
    name: "main-window",
    width: 800,
    height: 600,
    minWidth: 720,
    minHeight: 320,
    windowStatePersistence: true,
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
  // mainWindow.webContents.openDevTools();
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
}

Menu.setApplicationMenu(menu);

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
      new Request(url.toString(), {
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
      `${type === "A" ? "ipv4: " : "\nipv6: "}${(t1 - t0).toFixed(2)}ms`,
      ...(ans.Answer ?? [])
        .map((d) => d.data)
        .filter((ip) => {
          if (type === "A") {
            return isIPv4(ip);
          } else {
            return isIPv6(ip);
          }
        }),
    ].join("\n");
    return data;
  } catch {
    return "";
  }
};

const resolveDns = async ({ ip, name, type }: DnsQueryT) => {
  try {
    const resolver = new Resolver();
    if (ip !== "-") {
      resolver.setServers([ip]);
    }
    if (type === "A") {
      const t0 = performance.now();
      const address = await resolver.resolve4(name);
      const t1 = performance.now();
      return [`ipv4: ${(t1 - t0).toFixed(2)}ms`, ...address].join("\n");
    } else {
      const t0 = performance.now();
      const address = await resolver.resolve6(name);
      const t1 = performance.now();
      return [`\nipv6: ${(t1 - t0).toFixed(2)}ms`, ...address].join("\n");
    }
  } catch {
    return "";
  }
};

const fetchHost = (
  _: IpcMainInvokeEvent,
  type: DnsQueryT["type"],
  name: string,
  servers: { title: string; server: string; ip: string }[],
) =>
  name
    ? Promise.all(servers.map(({ server, ip }) => fetchDns({ server, name, type, ip })))
    : Promise.resolve([]);

const resolveHost = (
  _: IpcMainInvokeEvent,
  type: DnsQueryT["type"],
  name: string,
  servers: { title: string; server: string; ip: string }[],
) =>
  name
    ? Promise.all(servers.map(({ server, ip }) => resolveDns({ server, name, type, ip })))
    : Promise.resolve([]);

ipcMain.handle("doh", fetchHost);

ipcMain.handle("dns", resolveHost);
