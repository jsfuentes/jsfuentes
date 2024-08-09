import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { allBlogs } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'
import Link from 'next/link'
import { formatDate } from 'pliny/utils/formatDate'

export const getStaticProps = async () => {
  const posts = sortedBlogPost(allBlogs) as Blog[]
  return {
    props: {
      posts: allCoreContent(posts),
    },
  }
}

export default function BlogPage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="space-y-2 py-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          All Posts
        </h1>
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
        <ul className="mt-8">
          {posts.map((post) => (
            <li key={post.slug} className="py-2">
              <article className="flex items-start space-x-6">
                <dl className="w-36 flex-shrink-0">
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
                  </dd>
                </dl>
                <div>
                  <h2 className="text-xl font-semibold">
                    <Link href={`/blog/${post.slug}`} className="text-gray-900 dark:text-gray-100">
                      {post.title}
                    </Link>
                  </h2>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
