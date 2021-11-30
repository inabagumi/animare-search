/// <reference types="mdx" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'

    readonly NEXT_PUBLIC_ALGOLIA_APPLICATION_ID: string
    readonly NEXT_PUBLIC_ALGOLIA_API_KEY: string
    readonly NEXT_PUBLIC_ALGOLIA_CHANNELS_INDEX_NAME: string
    readonly NEXT_PUBLIC_ALGOLIA_INDEX_NAME: string
    readonly NEXT_PUBLIC_BASE_URL: string
    readonly NEXT_PUBLIC_DESCRIPTION: string
    readonly NEXT_PUBLIC_GA_TRACKING_ID?: string
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    readonly NEXT_PUBLIC_SUPABASE_URL: string

    readonly IMGIX_BASE_PATH?: string
  }
}

declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  export default function withPWA(config: NextConfig): NextConfig
}

declare module '*.svg' {
  import { SVGProps, VFC } from 'react'

  type Props = SVGProps<SVGSVGElement>
  const content: VFC<Props>

  export default content
}
