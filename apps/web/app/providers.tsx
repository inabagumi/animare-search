'use client'

import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import { Provider as BalancerProvider } from 'react-wrap-balancer'

type Props = {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <IntlProvider locale="ja" timeZone="Asia/Tokyo">
      <ThemeProvider defaultTheme="system">
        <BalancerProvider>{children}</BalancerProvider>
      </ThemeProvider>
    </IntlProvider>
  )
}
