import {
  Box,
  Flex,
  Link,
  SkipNavContent,
  SkipNavLink
} from '@shinju-date/chakra-ui'
import NextLink from 'next/link'
import { ReactNode } from 'react'
import AuthButton from './auth-button'

export type Props = {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props): JSX.Element {
  return (
    <>
      <SkipNavLink>コンテンツにスキップ</SkipNavLink>

      <Box
        as="header"
        backdropBlur={15}
        borderBottomWidth={1}
        p={2}
        pos="sticky"
      >
        <Flex justify="space-between">
          <Flex alignItems="center">
            <Link
              _hover={{ textDecoration: 'none' }}
              as={NextLink}
              fontSize="2xl"
              fontWeight="bold"
              href="/"
            >
              Admin UI
            </Link>
          </Flex>
          <Flex alignItems="center" px="4" py={2}>
            <AuthButton />
          </Flex>
        </Flex>
      </Box>
      <SkipNavContent />
      <Box as="main">{children}</Box>
    </>
  )
}
