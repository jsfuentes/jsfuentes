import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { fetchMilkAndCookiesRSS, fetchSpringWillComeAgainRSS } from '@/utils/rssFeeds'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page({ params }: { params: { page: string } }) {
  const blogPosts = allCoreContent(sortPosts(allBlogs))
  const rssFeeds = await Promise.all([fetchMilkAndCookiesRSS(), fetchSpringWillComeAgainRSS()])
  const rssItems = [...rssFeeds[0], ...rssFeeds[1]]
  console.log('RSSITEMS', rssItems)

  const posts = [
    ...blogPosts.map((post) => ({
      ...post,
      type: 'post',
    })),
    ...rssItems.map((item) => ({
      ...item,
      type: 'rss',
      date: item.pubDate || '',
      tags: [], // Assuming tags are not provided for RSS items
      readingTime: '', // Assuming readingTime is not applicable for RSS items
      slug: '', // Assuming slug is not applicable for RSS items
      path: '', // Assuming path is not applicable for RSS items
      structuredData: {}, // Assuming structuredData is not applicable for RSS items
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const pageNumber = parseInt(params.page as string)
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
      //@ts-ignore
      posts={posts}
      //@ts-ignore
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
