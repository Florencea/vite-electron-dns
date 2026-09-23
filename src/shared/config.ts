export interface AppConfig {
  title: string;
  appId: string;
}

export const APP_CONFIG = {
  title: "Vite Electron DNS",
  appId: "com.florencea.viteelectrondns",
} as const satisfies AppConfig;
