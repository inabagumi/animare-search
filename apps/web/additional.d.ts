/// <reference types="mdx" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'

    readonly NEXT_PUBLIC_BASE_URL?: string
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    readonly NEXT_PUBLIC_SUPABASE_URL: string
  }
}

declare module 'next-pwa' {
  import { type NextConfig } from 'next'

  export default function withPWA(config: NextConfig): NextConfig
}
