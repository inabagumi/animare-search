import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'
import Header from '../components/organisms/header'
import { getTitle } from '../lib/title'

export default class extends App {
  render() {
    const { Component, pageProps } = this.props
    const { query } = pageProps
    const title = getTitle()

    return (
      <>
        <Head>
          <meta content="#212121" name="theme-color" />

          <link href="/static/favicon.png" rel="icon" />
          <link href="/manifest.json" rel="manifest" />
          <link
            href="/opensearch.xml"
            rel="search"
            title={title}
            type="application/opensearchdescription+xml"
          />
        </Head>

        <Container>
          <div className="wrapper">
            <Header query={query || ''} />

            <div className="content">
              <Component {...pageProps} />
            </div>

            <div className="footer">
              <p className="copyright">
                Copyright 2019{' '}
                <a
                  href="https://haneru.dev/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Haneru Developers
                </a>
              </p>
            </div>
          </div>
        </Container>

        <style jsx global>{`
          html,
          body,
          #__next {
            height: 100%;
          }

          body {
            font-family: Roboto, Noto Sans JP, sans-serif;
            margin: 0;
          }
        `}</style>

        <style jsx>{`
          .wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .content {
            flex-grow: 1;
          }

          .footer {
            background-color: #212121;
            color: #fafafa;
          }

          .copyright {
            font-size: 0.9rem;
            margin: 2rem 0.5rem;
            text-align: center;
          }

          .copyright a {
            color: inherit;
            text-decoration: none;
          }
        `}</style>
      </>
    )
  }
}
