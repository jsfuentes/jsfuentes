import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import { PageSEO } from '@/components/SEO'
import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { allBooks } from 'contentlayer/generated'
import type { Book } from 'contentlayer/generated'
import GoodreadsAllBooks from '@/components/GoodreadsAllBooks'
import goodreadsScrape from '@/../goodreadsScrape.json'

export const getStaticProps = async () => {
  const books = allBooks
  console.log('goodreadsScrape', goodreadsScrape)

  //Combine goodreadsScrape and allBooks by the goodreadsScrape.short_title and allBooks.title where the allBooks.title is everything before the `-`
  const combinedBooks = goodreadsScrape
    .sort((a, b) => (a.title < b.title ? -1 : 1))
    .map((scrapeBook) => {
      const book = allBooks.find(
        (book) =>
          scrapeBook.short_title.toLowerCase() === book.title.split('-')[0].trim().toLowerCase()
      )

      if (book) {
        console.log('FOund book', book, scrapeBook)
      }

      return {
        ...book,
        ...scrapeBook,
      }
    })

  console.log('Combined Books:', combinedBooks)

  // const browseAIData = await fetchBrowseAIData()
  // const robotTasks = browseAIData.result.robotTasks.items
  // const goodreadsDataRaw = robotTasks[robotTasks.length - 1].capturedLists['My Goodreads']
  // console.log('goodreadsData', goodreadsDataRaw)
  // const goodreadsData = await Promise.all(
  //   goodreadsDataRaw.map(async (book) => ({
  //     ...book,
  //     preview_image: await getPreviewImage(book.goodreads_link),
  //   }))
  // )

  return {
    props: {
      books: combinedBooks,
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
