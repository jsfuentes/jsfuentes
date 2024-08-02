import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { allBooks } from 'contentlayer/generated'
import type { Book } from 'contentlayer/generated'
import GoodreadsAllBooks from '@/components/GoodreadsAllBooks'

export const getStaticProps = async () => {
  const books = allBooks

  return {
    props: {
      books: allCoreContent(books),
    },
  }
}

export default function BlogPage({ books }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('BOOKS', books)

  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <GoodreadsAllBooks />
      {books.map((book) => (
        <Link href={`/booknotes/${book.slug}`} key={book.slug}>
          <div className="mb-2 cursor-pointer text-xl font-semibold">{book.title}</div>
        </Link>
      ))}
    </>
  )
}
