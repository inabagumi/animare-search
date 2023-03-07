'use client'

import theme from '@shinju-date/chakra-theme'
import { CacheProvider, ChakraProvider } from '@shinju-date/chakra-ui'
import { type Session } from '@supabase/auth-helpers-nextjs'
import { type ReactNode } from 'react'
import { SessionProvider } from './session'

type Props = {
  children: ReactNode
  session?: Session
}

export default function Provider({ children, session }: Props) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
