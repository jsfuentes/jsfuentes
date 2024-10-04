import Link from 'next/link'
import Image from 'next/image'
import { combinedBooks } from '@/utils/combinedBooks'
import { genPageMetadata } from 'app/seo'

const MAX_REVIEW_LENGTH = 400

export const metadata = genPageMetadata({ title: 'Book Notes' })

export default async function BlogPage() {
  const books = combinedBooks

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
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-6xl md:leading-14">
        Books Read{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-400">({books.length})</span>
      </h1>
      <p className="mb-6 mt-4 text-xl text-gray-500 dark:text-gray-400">
        Reviews of every book I've read along with notes for most nonfiction books.
      </p>
      {/* <GoodreadsAllBooks /> */}
      {sortedYears.map((year) => {
        const bookCards = groupedBooks[year].map((book) => <BookCard key={book.slug} book={book} />)

        return (
          <div className="mb-8" key={year}>
            <div className="mb-4 text-3xl font-bold text-primary-500">
              {year}{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                ({bookCards.length})
              </span>
            </div>
            <div className="flex flex-row flex-wrap items-start justify-start">{bookCards}</div>
          </div>
        )
      })}
    </>
  )
}

function BookCard({ book }) {
  return (
    <Link
      href={`/booknotes/${book.slug}`}
      className="hover:border-1 mb-2 flex w-full flex-col rounded-lg border border-transparent p-4 hover:cursor-pointer hover:border-gray-300 hover:bg-gray-100 hover:dark:border-gray-700  hover:dark:bg-gray-800 md:w-1/2 md:flex-row"
    >
      <div className="mb-2 whitespace-nowrap text-sm text-gray-400 md:mb-0 md:mr-4">
        {book.read_date}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          {book.book_image && (
            <div className="flex-none">
              <Image
                src={book.book_image}
                alt={`Cover of ${book.title}`}
                width={96}
                height={144}
                className="rounded-lg object-contain shadow-md"
              />
            </div>
          )}
          <div className="ml-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="mb-1 text-gray-300">by {book.author}</p>
              {book.publish_date && (
                <p className="mb-2 text-xs text-gray-400">
                  {new Date(book.publish_date).getFullYear()}
                </p>
              )}
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
              {book.review.length > MAX_REVIEW_LENGTH && <span className="text-gray-300">...</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
