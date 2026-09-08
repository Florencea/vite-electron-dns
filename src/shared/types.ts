export type ModeT = "dns" | "doh";

export interface ServerT {
  title: string;
  description: string;
  document: string;
  server: string;
  ip: string;
}

export interface WindowApi {
  servers: ServerT[];
  queryIpv4: (mode: ModeT, name: string) => Promise<string[]>;
  queryIpv6: (mode: ModeT, name: string) => Promise<string[]>;
}
