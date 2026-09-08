/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_APPID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
