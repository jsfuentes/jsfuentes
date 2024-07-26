import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { allBooks } from 'contentlayer/generated'
import type { Book } from 'contentlayer/generated'
import GoodreadsAllBooks from '@/components/GoodreadsAllBooks'

export const POSTS_PER_PAGE = 5

export const getStaticProps = async () => {
  const books = allBooks

  const initialDisplayPosts = books.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(books.length / POSTS_PER_PAGE),
  }

  return {
    props: {
      initialDisplayPosts: allCoreContent(initialDisplayPosts),
      books: allCoreContent(books),
      pagination,
    },
  }
}

export default function BlogPage({
  books,
  initialDisplayPosts,
  pagination,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // console.log('BOOKS', books)

  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <GoodreadsAllBooks />
      {books.map((book) => (
        <div>{JSON.stringify(book)}</div>
      ))}
    </>
  )
}
