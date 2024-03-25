import { Temporal } from '@js-temporal/polyfill'
import { createErrorResponse, verifyCronRequest } from '@shinju-date/helpers'
import {
  type DefaultDatabase,
  createSupabaseClient
} from '@shinju-date/supabase'
import { captureException, defaultLogger as logger } from '@/lib/logging'
import { channelsUpdate as ratelimit } from '@/lib/ratelimit'
import { youtubeClient } from '@/lib/youtube'

export const runtime = 'nodejs'
export const revalidate = 0
export const maxDuration = 120

type Channel = Pick<
  DefaultDatabase['public']['Tables']['channels']['Row'],
  'name' | 'slug' | 'url'
>

export async function POST(request: Request): Promise<Response> {
  const cronSecure = process.env['CRON_SECRET']
  if (cronSecure && !verifyCronRequest(request, { cronSecure })) {
    return createErrorResponse('Unauthorized', { status: 401 })
  }

  const { success } = await ratelimit.limit('channels:update')

  if (!success) {
    return createErrorResponse(
      'There has been no interval since the last run.',
      { status: 429 }
    )
  }

  const currentDateTime = Temporal.Now.instant()
  const supabaseClient = createSupabaseClient(
    undefined,
    process.env['SUPABASE_SERVICE_ROLE_KEY']
  )
  const { data: channels, error } = await supabaseClient
    .from('channels')
    .select('name, slug, url')
    .is('deleted_at', null)

  if (error) {
    return createErrorResponse(error.message, { status: 500 })
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

      const changedColumns: Partial<typeof channel> = {}

      if (channel.name !== newChannel.name) {
        changedColumns.name = `${channel.name} -> ${newChannel.name}`
      }

      if (channel.url !== newChannel.url) {
        changedColumns.url = `${channel.url} -> ${newChannel.url}`
      }

      logger.info('Channel information has been updated.', changedColumns)
    } else if (result.status === 'rejected') {
      captureException(result.reason)
    }
  }

  return new Response(null, {
    status: 204
  })
}

export const GET = POST
