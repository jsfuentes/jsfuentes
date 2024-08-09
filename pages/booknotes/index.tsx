import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { allBooks } from 'contentlayer/generated'
import GoodreadsAllBooks from '@/components/GoodreadsAllBooks'
import goodreadsScrape from '@/../goodreadsScrape.json'

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
      {/* <GoodreadsAllBooks /> */}
      {sortedYears.map((year) => {
        const links = groupedBooks[year].map((book) => <BookCard book={book} />)

        return (
          <div className="mb-8">
            <div className="mb-4 text-xl font-medium text-blue-500">{year}</div>
            {links}
          </div>
        )
      })}
    </>
  )
}

function BookCard({ book }) {
  return (
    <div className="mb-8 flex flex-col md:flex-row">
      <div className="md:w-1/4">
        {book.book_image && (
          <img
            src={book.book_image}
            alt={`Cover of ${book.title}`}
            className="w-full rounded-lg shadow-md"
          />
        )}
      </div>
      <div className="mt-4 md:mt-0 md:ml-6 md:w-3/4">
        <h3 className="text-xl font-semibold">{book.title}</h3>
        <p className="text-gray-600">{book.author}</p>
        <div className="mt-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < book.rating_num ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        <p className="mt-2 text-gray-700">{book.review}</p>
      </div>
    </div>
  )
}
