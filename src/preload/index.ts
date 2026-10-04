import electron from "electron";
import { SERVERS } from "../shared/servers";
import type { ModeT, WindowApi } from "../shared/types";

const { contextBridge, ipcRenderer } = electron;

const queryIpv4 = async (mode: ModeT, name: string): Promise<string[]> => {
  const result: unknown = await ipcRenderer.invoke(mode, "A", name, SERVERS);
  if (Array.isArray(result)) {
    return result.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const queryIpv6 = async (mode: ModeT, name: string): Promise<string[]> => {
  const result: unknown = await ipcRenderer.invoke(mode, "AAAA", name, SERVERS);
  if (Array.isArray(result)) {
    return result.filter((item): item is string => typeof item === "string");
  }
  return [];
};

const api: WindowApi = {
  servers: SERVERS,
  queryIpv4,
  queryIpv6,
};

try {
  contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error(error);
}
