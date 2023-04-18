import './globals.css'
import { type Metadata } from 'next'
import { type ReactNode } from 'react'
import { title as siteName } from '@/lib/constants'
import { SkipNavLink } from '@/ui/skip-nav'
import Analytics from './analytics'
import { lato } from './fonts'
import Footer from './footer'
import styles from './layout.module.css'
import Navbar from './navbar'
import Providers from './providers'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  themeColor: '#212121',
  title: {
    default: siteName,
    template: `%s - ${siteName}`
  }
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props): JSX.Element {
  return (
    <html className={lato.variable} lang="ja" suppressHydrationWarning>
      <head prefix="og: http://ogp.me/ns#">
        <link
          href="/opensearch.xml"
          rel="search"
          type="application/opensearchdescription+xml"
        />
      </head>
      <body>
        <Providers>
          <div className={styles.wrapper}>
            <SkipNavLink>コンテンツにスキップ</SkipNavLink>

            <Navbar />

            <div className="padding-bottom--xl">{children}</div>

            <Footer />
          </div>

          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
