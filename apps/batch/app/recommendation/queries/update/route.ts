import * as Sentry from '@sentry/nextjs'
import { createErrorResponse, verifyCronRequest } from '@shinju-date/helpers'
import { defaultLogger as logger } from '@shinju-date/logging'
import { type NextRequest } from 'next/server'
import { recommendationQueriesUpdate as ratelimit } from '@/lib/ratelimit'
import { redisClient } from '@/lib/redis'
import { captureException } from '@/lib/sentry'
import { supabaseClient } from '@/lib/supabase'

const RECOMENDATION_QUERIES_KEY = 'recommendation_queries'

export const runtime = 'nodejs'
export const revalidate = 0
export const maxDuration = 120

async function getAllTerms({
  page = 1,
  perPage = 1_000
}: {
  perPage?: number
  page?: number
} = {}) {
  const { data: terms, error } = await supabaseClient
    .from('terms')
    .select('term')
    .order('updated_at', { ascending: true })
    .range((page - 1) * perPage, perPage * page - 1)

  if (error) {
    throw new TypeError(error.message, { cause: error })
  }

  if (terms.length === perPage) {
    const nextTerms = await getAllTerms({ page: page + 1, perPage })

    terms.push(...nextTerms)
  }

  return terms
}

export async function POST(request: NextRequest) {
  const cronSecure = process.env['CRON_SECRET']
  if (cronSecure && !verifyCronRequest(request, { cronSecure })) {
    return createErrorResponse('Unauthorized', { status: 401 })
  }

  const { success } = await ratelimit.limit('recommendation:queries:update')

  if (!success) {
    return createErrorResponse(
      'There has been no interval since the last run.',
      { status: 429 }
    )
  }

  try {
    await Sentry.withMonitor(
      '/recommendation/queries/update',
      async () => {
        const [terms, queries] = await Promise.all([
          getAllTerms(),
          redisClient.smembers(RECOMENDATION_QUERIES_KEY)
        ])
        const termValues = terms.map(({ term }) => term)
        const addableWords = termValues.filter(
          (term) => !queries.includes(term)
        )
        const deletableWords = queries.filter(
          (query) => !termValues.includes(query)
        )

        if (addableWords.length > 0 || deletableWords.length > 0) {
          const multi = redisClient.multi()

          if (addableWords.length > 0) {
            multi.sadd(RECOMENDATION_QUERIES_KEY, ...addableWords)
          }

          if (deletableWords.length > 0) {
            multi.srem(RECOMENDATION_QUERIES_KEY, ...deletableWords)
          }

          const results = await multi.exec<number[]>()

          if (results.some((result) => result > 0)) {
            logger.info('Update recommendation queries.', {
              added: addableWords,
              deleted: deletableWords
            })
          }
        }
      },
      {
        schedule: {
          type: 'crontab',
          value: '7/30 * * * *'
        },
        timezone: 'Etc/UTC'
      }
    )
  } catch (error) {
    captureException(error)

    // wait for logging
    await new Promise((resolve) => {
      setTimeout(resolve, 2_000)
    })

    const message =
      error instanceof Error ? error.message : 'Internal Server Error'

    return createErrorResponse(message, { status: 500 })
  }

  // wait for logging
  await new Promise((resolve) => {
    setTimeout(resolve, 2_000)
  })

  return new Response(null, { status: 204 })
}

export const GET = POST
