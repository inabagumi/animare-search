import { subHours } from 'date-fns'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { useState } from 'react'
import useSWR from 'swr'

import Spinner from 'components/atoms/spinner'
import Schedule from 'components/organisms/schedule '
import { useSiteMetadata } from 'context/site-context'
import SearchResponseBody from 'types/search-response-body'
import buildQueryString from 'utils/build-query-string'

import styles from 'styles/index.module.css'

const getRequestURL = (now = new Date()): string => {
  const apiURL = '/api/search'
  const queryString = buildQueryString({
    count: 100,
    since: subHours(now, 2).toJSON()
  })

  return queryString ? `${apiURL}?${queryString}` : apiURL
}

const IndexPage: NextPage = () => {
  const now = useState(() => new Date())[0]
  const { data: items } = useSWR<SearchResponseBody>(() => getRequestURL(now), {
    refreshInterval: 10 * 1000
  })
  const { baseURL, description, title } = useSiteMetadata()

  return (
    <>
      <NextSeo
        canonical={`${baseURL}/`}
        description={description}
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

      {items ? (
        <Schedule values={items} />
      ) : (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
    </>
  )
}

export default IndexPage
