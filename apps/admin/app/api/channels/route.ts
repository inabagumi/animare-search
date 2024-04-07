import { createErrorResponse } from '@shinju-date/helpers'
import { createSupabaseClient } from '@/lib/supabase'

export const revalidate = 0
export const maxDuration = 120

export async function GET(): Promise<Response> {
  const supabaseClient = createSupabaseClient()
  const { data: rawChannels, error } = await supabaseClient
    .from('channels')
    .select('name, slug')
    .is('deleted_at', null)

  if (error) {
    return createErrorResponse(error.message, { status: 500 })
  }

  const channels = rawChannels.map((channel) => ({
    id: channel.slug,
    name: channel.name
  }))

  return Response.json(channels, {
    headers: {
      'Cache-Control': 'max-age=60'
    }
  })
}
