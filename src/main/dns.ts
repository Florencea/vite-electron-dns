import type { IpcMainInvokeEvent } from "electron";
import { Resolver } from "node:dns/promises";
import { isIPv4, isIPv6 } from "node:net";
import { URL } from "node:url";
import { SERVERS } from "../shared/servers";

export interface DnsQueryT {
  server: string;
  ip: string;
  name: string;
  type: "A" | "AAAA";
}

interface AnsT {
  Answer?: { type: number; data: string }[];
  Comment?: string;
  nameServer?: string;
}

export const fetchDns = async ({
  server,
  name,
  type,
}: DnsQueryT): Promise<string> => {
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
    if (!res.ok) {
      throw new Error(`Request failed on status ${res.status.toString()}`);
    }
    const ans = (await res.json()) as AnsT;
    if (!ans.Answer) {
      return "";
    }
    const data = [
      `${type === "A" ? "ipv4: " : "\nipv6: "}${(t1 - t0).toFixed(2)}ms`,
      ...ans.Answer.map((d) => d.data).filter((ip) => {
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

export const resolveDns = async ({
  ip,
  name,
  type,
}: DnsQueryT): Promise<string> => {
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

export const fetchHost = (
  _: IpcMainInvokeEvent,
  type: DnsQueryT["type"],
  name: string,
  servers: { title: string; server: string; ip: string }[] = SERVERS,
): Promise<string[]> =>
  name
    ? Promise.all(
        servers.map(({ server, ip }) => fetchDns({ server, name, type, ip })),
      )
    : Promise.resolve([]);

export const resolveHost = (
  _: IpcMainInvokeEvent,
  type: DnsQueryT["type"],
  name: string,
  servers: { title: string; server: string; ip: string }[] = SERVERS,
): Promise<string[]> =>
  name
    ? Promise.all(
        servers.map(({ server, ip }) => resolveDns({ server, name, type, ip })),
      )
    : Promise.resolve([]);
