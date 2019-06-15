import Link from 'next/link'
import Router from 'next/router'
import React, { ChangeEvent, FC, useCallback } from 'react'
import { normalize } from '../../../lib/search'
import { getTitle } from '../../../lib/title'
import SearchForm from '../../molecules/search-form'

interface HeaderProps {
  query: string
}

const Header: FC<HeaderProps> = ({ query }) => {
  const title = getTitle()

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const query = normalize(target.value)

      Router.replace(query ? `/search?q=${encodeURIComponent(query)}` : '/')
    },
    []
  )

  return (
    <>
      <header className="header">
        <div className="header__content">
          <h1 className="title">
            <Link href="/">
              <a className="title__link" tabIndex={-1}>
                <img
                  alt={title}
                  height="48"
                  src="/static/logo.png"
                  width="120"
                />
              </a>
            </Link>
          </h1>

          <SearchForm onChange={handleChange} query={query} />
        </div>
      </header>

      <style jsx>{`
        .header {
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          height: 60px;
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 2;
        }

        .header__content {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          height: 100%;
          justify-content: space-between;
          line-height: 1;
          margin: 0 auto;
          max-width: 1024px;
          padding: 0 0.5rem 0 0;
        }

        @media (min-width: 500px) {
          .header__content {
            padding: 0.5rem 1rem;
          }
        }

        .title {
          font-size: 1.5rem;
          font-weight: 700;
          padding: 0;
          margin: 0 1rem 0 0;
        }

        @media (min-width: 500px) {
          .title {
            margin: 0.5rem 1rem 0 0;
          }
        }

        .title__link {
          color: inherit;
          display: block;
          -webkit-tap-highlight-color: transparent;
          text-decoration: none;
        }

        .title__link:focus {
          outline: 0;
        }

        .title__logo {
          border: 0;
          display: block;
        }
      `}</style>
    </>
  )
}

export default Header
