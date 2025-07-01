/// <reference types="vite/client" />

// Make sure TS sees these definitions:
declare global {
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    // add more VITE_… vars here if you have them
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}