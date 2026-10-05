export interface AppConfig {
  title: string;
  appId: string;
}

export const APP_CONFIG = {
  title: "VP Electron DNS",
  appId: "com.florencea.vpelectrondns",
} as const satisfies AppConfig;
