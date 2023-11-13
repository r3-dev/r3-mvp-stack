/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    pb: import('@r3-dev/pocketbase/types').TypedPocketBase
  }
}

interface ImportMetaEnv {
  readonly INTERNAL_BACKEND_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
