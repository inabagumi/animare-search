import { Temporal } from '@js-temporal/polyfill'
import { SkipNavContent } from '@reach/skip-nav'
import { type GetStaticPaths, type GetStaticProps, type NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useCurrentGroup } from '../../../../components/group'
import Page, {
  DEFAULT_SKIP_NAV_CONTENT_ID
} from '../../../../components/layout'
import SearchResults, {
  fetchVideosByChannelIDs
} from '../../../../components/search-results'
import { type Video } from '../../../../lib/algolia'
import { type Group, getGroupBySlug } from '../../../../lib/supabase'
import { join as urlJoin } from '../../../../lib/url'

type Props = {
  baseTime: number
  group: Group
  query: string
  videos: Video[]
}

const VideosPage: NextPage<Props> = ({ group, baseTime, query, videos }) => {
  useCurrentGroup(group)

  const basePath = `/groups/${group.slug}`
  const title = query
    ? `『${query}』の検索結果 - ${group.name}`
    : `『${group.name}』の動画一覧`

  return (
    <Page basePath={basePath} baseTime={baseTime}>
      <NextSeo
        canonical={new URL(
          urlJoin(basePath, 'videos', query ? encodeURIComponent(query) : ''),
          process.env.NEXT_PUBLIC_BASE_URL
        ).toString()}
        noindex={!!query}
        title={title}
      />

      <SkipNavContent as="main" id={DEFAULT_SKIP_NAV_CONTENT_ID}>
        <SearchResults
          channels={group.channels}
          prefetchedData={[videos]}
          query={query}
          title={title}
        />
      </SkipNavContent>
    </Page>
  )
}

export default VideosPage

type Params = {
  queries?: string[]
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    fallback: 'blocking',
    paths: []
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (params) {
    const group = await getGroupBySlug(params.slug)

    if (group && group.channels.length > 0) {
      const baseTime = Temporal.Now.instant().epochSeconds
      const query = params.queries?.join('/') ?? ''
      const channelIDs = group.channels.map((channel) => channel.slug)
      const videos = await fetchVideosByChannelIDs({
        baseTime,
        channelIDs,
        query
      })

      return {
        props: { baseTime, group, query, videos },
        revalidate: query ? 600 : 60
      }
    }
  }

  return {
    notFound: true,
    revalidate: 60
  }
}
