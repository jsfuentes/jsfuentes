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
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

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
        date: item.pubDate,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 dark:border-gray-700">
          {mainAuthorContent.avatar && (
            <Image
              src={mainAuthorContent.avatar}
              alt="avatar"
              width={192}
              height={192}
              className="h-42 w-42 rounded-full"
            />
          )}
          <div className="md:ml-5 flex flex-col items-center md:items-start">
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
              {mainAuthorContent.name}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">{mainAuthorContent.occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{mainAuthorContent.company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${mainAuthorContent.email}`} />
              <SocialIcon kind="github" href={mainAuthorContent.github} />
              <SocialIcon kind="linkedin" href={mainAuthorContent.linkedin} />
              <SocialIcon kind="twitter" href={mainAuthorContent.twitter} />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Writings
          </h1>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!combinedPosts.length && 'No posts or RSS items found.'}
          {combinedPosts.map((item, index) => {
            const { slug, date, title, link, pubDate, type } = item
            return (
              <li key={slug || index} className="py-4">
                <article className="flex flex-col md:flex-row items-center justify-between">
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
