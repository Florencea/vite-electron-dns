export type ModeT = "dns" | "doh";

export interface ServerT {
  title: string;
  description: string;
  document: string;
  server: string;
  ip: string;
}
