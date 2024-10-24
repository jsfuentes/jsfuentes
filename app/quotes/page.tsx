import Link from 'next/link'
import { allQuotes } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Quotes' })

export default async function QuotesPage() {
  const quotes = allQuotes

  // Group quotes by year and sort by date
  const groupedQuotes = quotes.reduce((acc, quote) => {
    const year = new Date(quote.slug).getFullYear() || 'Unknown'
    if (!acc[year]) {
      acc[year] = []
    }

    acc[year].push(quote)
    return acc
  }, {})

  // Sort quotes within each year by date
  Object.keys(groupedQuotes).forEach((year) => {
    //inplace sorting
    groupedQuotes[year].sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.read_date) > new Date(a.read_date) ? -1 : 1
    })
  })

  // Sort years in descending order with Unknown at end
  const sortedYears = Object.keys(groupedQuotes)
    .filter((year) => year !== 'Unknown')
    .sort((a, b) => b.localeCompare(a))
  // sortedYears.push('Unknown')

  return (
    <>
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-10 md:text-6xl md:leading-14">
        Quotes Collection{' '}
        <span className="font-semibold text-gray-600 dark:text-gray-400">({quotes.length})</span>
      </h1>
      <p className="mb-6 mt-4 text-xl text-gray-500 dark:text-gray-400">
        Dated quotes pulled from my personal notes.
      </p>
      {sortedYears.map((year) => {
        const bookCards = groupedQuotes[year]
          .reverse()
          .map((quote) => <QuoteCard key={quote.slug} quote={quote} />)

        return (
          <div className="mb-8" key={year}>
            <div className="mb-4 text-3xl font-bold text-primary-500">
              {year}{' '}
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                ({bookCards.length})
              </span>
            </div>
            <div className="flex w-full flex-col items-start justify-start">{bookCards}</div>
          </div>
        )
      })}
      <div className="mt-6 text-center">
        <Link href="/blog/quotes" className="text-blue-600 hover:underline">
          View My Previous Quotes Page <span className="inline-block rotate-45 transform">↑</span>
        </Link>
      </div>
    </>
  )
}

function QuoteCard({ quote }) {
  function cleanString(str) {
    str = str.trim()
    str = str.replace(/^-\s*/, '')
    str = str.replace(/"/g, '')
    str = str.replace(/“/g, '')
    str = str.replace(/”/g, '')

    // Remove everything after '#quote'
    str = str.split('#quote')[0]

    return str
  }

  return (
    <div className="flex w-full flex-col justify-between rounded-lg border border-transparent p-2 md:flex-row">
      <div className="mr-4 flex flex-col">
        <div>
          {quote.body.raw.split('\n').map((line) => (
            <p key={line} className="mb-2">
              {cleanString(line)}
            </p>
          ))}
        </div>
      </div>
      <div className="whitespace-nowrap text-sm text-gray-400 md:mb-0 md:mr-4">{quote.slug}</div>
    </div>
  )
}
