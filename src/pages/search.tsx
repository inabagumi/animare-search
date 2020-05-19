import swr, { useSWRPages } from '@ykzts/swr'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import SearchSkeleton from '@/components/molecules/SearchSkeleton'
import VideoCard from '@/components/molecules/VideoCard'
import { useSiteMetadata } from '@/context/SiteContext'
import type { SearchResponseBody } from '@/types'
import { buildQueryString, chunk, getValue } from '@/utils'

const SEARCH_RESULT_COUNT = 9

type Props = {
  keyword: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query
}) => {
  const keyword = getValue(query.q)

  return {
    props: {
      keyword
    }
  }
}

const SearchPage: NextPage<Props> = ({ keyword }) => {
  const { isEmpty, loadMore, pages } = useSWRPages<
    string | null,
    SearchResponseBody
  >(
    `search-page:${keyword}`,
    ({ offset, withSWR }) => {
      const queryString = buildQueryString({
        count: SEARCH_RESULT_COUNT,
        q: keyword,
        until: offset
      })
      const apiURL = queryString ? `/api/search?${queryString}` : '/api/search'

      const { data: items } = withSWR(swr(apiURL))

      if (!items) {
        return <SearchSkeleton />
      }

      return chunk(items, 3).map((values) => (
        <div className="row" key={values.map((value) => value.id).join(':')}>
          {values.map((value) => (
            <div
              className="col col--4 padding-bottom--lg padding-horiz--sm"
              key={value.id}
            >
              <VideoCard
                timeOptions={{
                  relativeTime: true
                }}
                value={value}
              />
            </div>
          ))}
        </div>
      ))
    },
    ({ data: items = [] }) =>
      items.length >= SEARCH_RESULT_COUNT
        ? items[items.length - 1].publishedAt
        : null,
    [keyword]
  )
  const [footerRef, inView] = useInView()
  const { baseURL, description, title: siteTitle } = useSiteMetadata()

  useEffect(() => {
    if (!inView) return

    loadMore()
  }, [inView, loadMore])

  const path = keyword ? `/search?q=${encodeURIComponent(keyword)}` : '/search'
  const title = [keyword, siteTitle].filter(Boolean).join(' - ')

  return (
    <>
      <NextSeo
        canonical={`${baseURL}${path}`}
        description={description}
        noindex
        openGraph={{
          images: [
            {
              height: 630,
              url: `${baseURL}/main-visual.jpg`,
              width: 1200
            }
          ],
          type: 'website'
        }}
        title={title}
        twitter={{
          cardType: 'summary_large_image'
        }}
      />

      <div className="container">
        {!isEmpty ? (
          <div className="margin-top--lg">{pages}</div>
        ) : (
          <div className="text--center margin-bottom--lg margin-top--lg padding-bottom--lg padding-top--lg">
            <h2>検索結果はありません</h2>
            <p>
              『{keyword}』で検索しましたが一致する動画は見つかりませんでした。
            </p>

            <Link href="/search">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="button button--lg button--outline button--primary"
                role="button"
              >
                新着動画を見る
              </a>
            </Link>
          </div>
        )}

        <div className="padding-bottom--lg" ref={footerRef} />
      </div>
    </>
  )
}

export default SearchPage
