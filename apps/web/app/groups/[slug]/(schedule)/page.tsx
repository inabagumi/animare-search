import { type Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NoResults from '@/components/no-results'
import SimpleDocument from '@/components/simple-document'
import Timeline from '@/components/timeline'
import { title as siteName } from '@/lib/constants'
import { fetchNotEndedVideos } from '@/lib/fetchers'
import { getChannelsByGroup, getGroupBySlug } from '@/lib/supabase'

export const runtime = 'edge'
export const revalidate = 60

type Params = {
  slug: string
}

type Props = {
  params: Params
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata | null> {
  const group = await getGroupBySlug(params.slug)

  if (!group) {
    return null
  }

  const title = group.name

  return {
    alternates: {
      canonical: `/groups/${group.slug}`
    },
    openGraph: {
      siteName,
      title,
      type: 'article'
    },
    title,
    twitter: {
      title: `${title} - ${siteName}`
    }
  }
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const group = await getGroupBySlug(params.slug)

  if (!group) {
    notFound()
  }

  const channels = getChannelsByGroup(group)
  const videos = await fetchNotEndedVideos({
    channelIDs: channels.map((channel) => channel.slug)
  })

  return (
    <SimpleDocument
      button={
        <Link
          className="button button--lg button--secondary"
          href={`/groups/${group.slug}/videos`}
          role="button"
        >
          動画一覧
        </Link>
      }
      title={group.name}
    >
      <h2 className="margin-top--lg">今後の配信予定</h2>

      {videos.length > 0 ? (
        <Timeline channels={channels} prefetchedData={videos} />
      ) : (
        <NoResults
          basePath={`/groups/${group.slug}`}
          message="YouTubeに登録されている配信予定の動画がありません。"
        />
      )}
    </SimpleDocument>
  )
}
