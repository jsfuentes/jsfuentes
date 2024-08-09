import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { allBooks } from 'contentlayer/generated'
import GoodreadsAllBooks from '@/components/GoodreadsAllBooks'
import goodreadsScrape from '@/../goodreadsScrape.json'

const MAX_REVIEW_LENGTH = 600

export const getStaticProps = async () => {
  const combinedBooks = goodreadsScrape.map((scrapeBook) => {
    const book = allBooks.find(
      (book) =>
        scrapeBook.short_title.toLowerCase() === book.title.split('-')[0].trim().toLowerCase()
    )

    return {
      ...book,
      ...scrapeBook,
    }
  })

  return {
    props: {
      books: combinedBooks,
    },
  }
}

export default function BlogPage({ books }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('BOOKS', books)
  // Group books by publish_year and sort by publish_date
  const groupedBooks = books.reduce((acc, book) => {
    const year = book.read_year || 'Unknown'
    if (!acc[year]) {
      acc[year] = []
    }

    acc[year].push(book)
    return acc
  }, {})

  // Sort books within each year by publish_date
  Object.keys(groupedBooks).forEach((year) => {
    //inplace sorting
    groupedBooks[year].sort((a, b) => {
      if (!a.read_date || !b.read_date) return 0
      return new Date(b.read_date) < new Date(a.read_date) ? -1 : 1
    })
  })

  // Sort years in descending order with Unknown at end
  const sortedYears = Object.keys(groupedBooks)
    .filter((year) => year !== 'Unknown')
    .sort((a, b) => b.localeCompare(a))
  sortedYears.push('Unknown')

  return (
    <>
      <PageSEO title={`Books - ${siteMetadata.author}`} description={siteMetadata.description} />
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-6xl md:leading-14">
        Books Read{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-400">({books.length})</span>
      </h1>
      <p className="mt-4 mb-6 text-xl text-gray-500 dark:text-gray-400">
        Reviews of every book I've read along with notes for most nonfiction books.
      </p>
      {/* <GoodreadsAllBooks /> */}
      {sortedYears.map((year) => {
        const bookCards = groupedBooks[year].map((book) => <BookCard key={book.slug} book={book} />)

        return (
          <div className="mb-8">
            <div className="mb-4 text-3xl font-bold text-primary-500">{year}</div>
            <div className="flex flex-row flex-wrap items-start justify-start">{bookCards}</div>
          </div>
        )
      })}
    </>
  )
}

function BookCard({ book }) {
  return (
    <Link href={`/booknotes/${book.slug}`}>
      <div className="hover:border-1 mb-2 flex w-full flex-col rounded-lg border border-transparent p-4 hover:cursor-pointer hover:border-gray-700  hover:bg-gray-800 md:w-1/2 md:flex-row">
        <div className="mb-2 whitespace-nowrap text-sm text-gray-400 md:mb-0 md:mr-4">
          {book.read_date}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            {book.book_image && (
              <div className="flex-none">
                <img
                  src={book.book_image}
                  alt={`Cover of ${book.title}`}
                  className="w-24 rounded-lg object-contain shadow-md" // Changed from w-32 to w-24
                />
              </div>
            )}
            <div className="ml-4 flex flex-col justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-300">by {book.author}</p>
                <p className="mb-2 text-xs text-gray-400">
                  {new Date(book.publish_date).getFullYear()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {book.rating_num &&
              [...Array(5)].map((_, i) => (
                <span key={i} className={i < book.rating_num ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            {book.review && (
              <div className="mt-1 text-sm">
                {book.review.slice(0, MAX_REVIEW_LENGTH).trim()}
                {book.review.length > MAX_REVIEW_LENGTH && (
                  <span className="text-gray-300">...</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
