import { Temporal } from '@js-temporal/polyfill'
import { type Database } from '@shinju-date/schema'
import { NextResponse } from 'next/server'
import { captureException, defaultLogger as logger } from '@/lib/logging'
import { isDuplicate } from '@/lib/redis'
import { createErrorResponse } from '@/lib/session'
import { createSupabaseClient } from '@/lib/supabase'
import { youtubeClient } from '@/lib/youtube'

type Channel = Pick<
  Database['public']['Tables']['channels']['Row'],
  'name' | 'slug' | 'url'
>

export async function POST(): Promise<NextResponse> {
  const duration = Temporal.Duration.from({ hours: 2 })

  if (await isDuplicate('cron:channels:update', duration)) {
    return createErrorResponse(
      429,
      'There has been no interval since the last run.'
    )
  }

  const currentDateTime = Temporal.Now.instant()
  const supabaseClient = createSupabaseClient({
    token: process.env.SUPABASE_SERVICE_ROLE_KEY
  })
  const { data: channels, error } = await supabaseClient
    .from('channels')
    .select('name, slug, url')
    .is('deleted_at', null)

  if (error) {
    return createErrorResponse(500, error.message)
  }

  const {
    data: { items = [] }
  } = await youtubeClient.channels.list({
    id: channels.map((channel) => channel.slug),
    maxResults: channels.length,
    part: ['snippet']
  })

  const results = await Promise.allSettled(
    items.map<Promise<Channel | null>>(async (item) => {
      if (!item.id) {
        throw new TypeError('The ID not found.')
      }

      const channel = channels.find((channel) => channel.slug === item.id)

      if (!channel) {
        throw new TypeError('A channel does not exist.')
      }

      if (!item.snippet || !item.snippet.title) {
        throw new TypeError('A snippet is empty.')
      }

      const channelURL = item.snippet.customUrl
        ? `https://www.youtube.com/${item.snippet.customUrl}`
        : `https://www.youtube.com/channels/${item.id}`

      if (item.snippet.title === channel.name && channelURL === channel.url) {
        return null
      }

      const { data, error } = await supabaseClient
        .from('channels')
        .update({
          name: item.snippet.title,
          updated_at: currentDateTime.toJSON(),
          url: channelURL
        })
        .eq('slug', item.id)
        .select('name, slug, url')
        .single()

      if (error) {
        throw error
      }

      return data
    })
  )

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const newChannel = result.value
      const channelID = newChannel.slug
      const channel = channels.find((channel) => channel.slug === channelID)

      if (!channel) {
        continue
      }

      if (channel.name !== newChannel.name) {
        logger.info(
          'Change channel name from "%s" to "%s".',
          channel.name,
          newChannel.name
        )
      }

      if (channel.url !== newChannel.url) {
        logger.info(
          'Change channel URL from "%s" to "%s".',
          channel.url,
          newChannel.url
        )
      }
    } else if (result.status === 'rejected') {
      captureException(result.reason)
    }
  }

  return new NextResponse(null, {
    status: 204
  })
}

export const GET = POST
