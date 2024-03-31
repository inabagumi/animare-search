import { Temporal } from 'temporal-polyfill'
import {
  createCalendarResponse,
  createEventAttributesList,
  createNotFoundResponse
} from '@/lib/calendar'
import { supabaseClient } from '@/lib/supabase'

export const dynamic = 'force-static'
export const revalidate = 60

type Params = {
  slug: string
}

type Props = {
  params: Params
}

export async function GET(_req: Request, { params }: Props): Promise<Response> {
  const { count, error } = await supabaseClient
    .from('channels')
    .select('*', { count: 'exact', head: true })
    .eq('slug', params.slug)

  if (error) {
    return new Response(error.message, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8'
      },
      status: 500
    })
  }

  if (!count || count < 1) {
    return createNotFoundResponse()
  }

  const timeZone = Temporal.TimeZone.from('UTC')
  const now = Temporal.Now.zonedDateTimeISO(timeZone)
  const { data: videos, error: secondError } = await supabaseClient
    .from('videos')
    .select(
      `
        channels!inner (
          name,
          slug
        ),
        duration,
        published_at,
        slug,
        title,
        url
      `
    )
    .eq('channels.slug', params.slug)
    .lt('published_at', now.add({ days: 7 }).toInstant().toJSON())
    .order('published_at', { ascending: false })
    .limit(100)

  if (secondError) {
    return new Response(secondError.message, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8'
      },
      status: 500
    })
  }

  const events = createEventAttributesList(videos, { now })

  return createCalendarResponse(events)
}
