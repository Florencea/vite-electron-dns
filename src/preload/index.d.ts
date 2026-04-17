import type { ModeT, ServerT } from "../shared/types";

declare global {
  interface Window {
    api: {
      servers: ServerT[];
      queryIpv4: (mode: ModeT, name: string) => Promise<string[]>;
      queryIpv6: (mode: ModeT, name: string) => Promise<string[]>;
    };
  }
}
