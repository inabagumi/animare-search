import { Container } from '@shinju-date/chakra-ui'

// TODO: https://github.com/vercel/next.js/issues/43458
// export const runtime = 'edge'

type Params = {
  id: string
}

type Props = {
  params: Params
}

export default function ChannelPage({ params }: Props): JSX.Element {
  return (
    <Container maxW="full" w="container.xl">
      <p>{params.id}</p>
    </Container>
  )
}
