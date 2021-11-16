import { NextSeo } from 'next-seo'
import Page from '../components/layout'
import SearchResults, {
  SEARCH_RESULT_COUNT
} from '../components/search-results'
import { getVideosByQuery } from '../lib/algolia'
import { getQueryValue } from '../lib/url'
import type { Channel, Video } from '../lib/algolia'
import type { GetServerSideProps, NextPage } from 'next'

type Props = {
  channel?: Channel
  query: string
  videos: Video[]
}

const VideosPage: NextPage<Props> = ({ query, videos }) => {
  const title = query ? `『${query}』の検索結果` : '動画一覧'

  return (
    <Page>
      <NextSeo
        canonical={new URL(
          query ? `/videos?q=${encodeURIComponent(query)}` : '/videos',
          process.env.NEXT_PUBLIC_BASE_URL
        ).toString()}
        noindex
        title={title}
      />

      <SearchResults
        basePath="/video"
        prefetchedData={[videos]}
        query={query}
        title={title}
      />
    </Page>
  )
}

export default VideosPage

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const q = getQueryValue('q', query) ?? ''

  const videos = await getVideosByQuery({
    limit: SEARCH_RESULT_COUNT,
    page: 1,
    query: q
  })

  return {
    props: {
      query: q,
      videos
    }
  }
}
