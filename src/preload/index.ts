import electron from "electron";
import { SERVERS } from "../shared/servers";
import type { ModeT, WindowApi } from "../shared/types";
const { contextBridge, ipcRenderer } = electron;

const api: WindowApi = {
  servers: SERVERS,
  queryIpv4: (mode: ModeT, name: string) =>
    ipcRenderer.invoke(mode, "A", name, SERVERS) as Promise<string[]>,
  queryIpv6: (mode: ModeT, name: string) =>
    ipcRenderer.invoke(mode, "AAAA", name, SERVERS) as Promise<string[]>,
};

try {
  contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error(error);
}
