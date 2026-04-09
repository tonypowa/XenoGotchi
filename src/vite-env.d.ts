/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GC_USER: string;
  readonly VITE_GC_PASS: string;
  readonly VITE_GC_URL: string;
  readonly VITE_METRICS_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
