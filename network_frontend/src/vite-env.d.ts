/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_NUM_PORTS: number;
  readonly VITE_UPDATE_INTERVAL: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
