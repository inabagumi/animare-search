import SimpleDocument from '@/components/simple-document'
import { title as siteName } from '@/lib/constants'
import Privacy from './privacy.mdx'

const title = 'プライバシーポリシー'

export const dynamic = 'force-static'
export const revalidate = 120

export const metadata = {
  alternates: {
    canonical: '/privacy'
  },
  openGraph: {
    siteName,
    title,
    type: 'article'
  },
  title,
  twitter: {
    title: `${title} - ${siteName}`
  }
}

export default function NotFound(): JSX.Element {
  return (
    <SimpleDocument title={title} withBreadcrumbs>
      <div className="markdown">
        <Privacy />
      </div>
    </SimpleDocument>
  )
}
