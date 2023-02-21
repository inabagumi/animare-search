import merge from 'lodash.merge'
import baseMetadata from '@/app/metadata'
import SimpleDocument from '@/ui/simple-document'
import Privacy from './privacy'

const title = 'プライバシーポリシー'

export const revalidate = 120

export const metadata = merge(baseMetadata, {
  alternates: {
    canonical: '/privacy'
  },
  openGraph: {
    title,
    type: 'article'
  },
  title,
  twitter: {
    title: `${title} - SHINJU DATE`
  }
})

export default function NotFound(): JSX.Element {
  return (
    <SimpleDocument title={title} withBreadcrumbs>
      <div className="markdown">
        <Privacy />
      </div>
    </SimpleDocument>
  )
}
