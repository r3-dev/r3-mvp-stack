/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    pb: import('pocketbase').default
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_BACKEND_URL: string
  readonly INTERNAL_BACKEND_URL: string

  readonly PUBLIC_FRONTEND_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
