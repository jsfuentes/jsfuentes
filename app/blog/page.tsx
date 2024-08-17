import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { fetchMilkAndCookiesRSS, fetchSpringWillComeAgainRSS } from '@/utils/rssFeeds'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const blogPosts = allCoreContent(sortPosts(allBlogs))
  const rssFeeds = await Promise.all([fetchMilkAndCookiesRSS(), fetchSpringWillComeAgainRSS()])
  const rssItems = [...rssFeeds[0], ...rssFeeds[1]]
  console.log('RSSITEMS', rssItems)

  const posts = blogPosts
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
    .sort(
      (a, b) => new Date(b.pubDate || b.date).getTime() - new Date(a.pubDate || a.date).getTime()
    )

  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
