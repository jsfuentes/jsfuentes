import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { coreContent } from 'pliny/utils/contentlayer'
import { fetchMilkAndCookiesRSS, fetchSpringWillComeAgainRSS } from '@/utils/rssFeeds'

export const metadata = genPageMetadata({ title: 'About' })

export default async function Main({ posts }) {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainAuthorContent = coreContent(author)
  const rssFeeds = await Promise.all([fetchMilkAndCookiesRSS(), fetchSpringWillComeAgainRSS()])
  const rssItems = [...rssFeeds[0], ...rssFeeds[1]]

  const combinedPosts = posts
    .map((post) => ({
      ...post,
      type: 'post',
    }))
    .concat(
      rssItems.map((item) => ({
        ...item,
        type: 'rss',
      }))
    )
    .sort(
      (a, b) => new Date(b.pubDate || b.date).getTime() - new Date(a.pubDate || a.date).getTime()
    )

  return (
    <>
      <AuthorLayout content={mainAuthorContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            All Posts
          </h1>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!combinedPosts.length && 'No posts or RSS items found.'}
          {combinedPosts.map((item, index) => {
            const { slug, date, title, link, pubDate, type } = item
            return (
              <li key={slug || index} className="py-4">
                <article className="flex items-center justify-between">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={date || pubDate}>
                        {formatDate(date || pubDate, siteMetadata.locale)}
                      </time>
                    </dd>
                  </dl>
                  <div>
                    <h2 className="text-xl font-bold leading-8 tracking-tight">
                      <Link
                        href={type === 'post' ? `/blog/${slug}` : link}
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {title}
                      </Link>
                    </h2>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
