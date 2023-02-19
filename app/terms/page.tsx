import merge from 'lodash.merge'
import baseMetadata from '@/app/metadata'
import SimpleDocument from '@/ui/simple-document'
import Terms from './terms'

const title = '利用規約'

export const revalidate = 120

export const metadata = merge(baseMetadata, {
  alternates: {
    canonical: '/terms'
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
        <Terms />
      </div>
    </SimpleDocument>
  )
}
