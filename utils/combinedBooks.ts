import goodreadsScrape from '@/../goodreadsScrape.json'
import { allBooks } from 'contentlayer/generated'

export const combinedBooks = goodreadsScrape.map((scrapeBook) => {
  const book = allBooks.find(
    (book) => scrapeBook.short_title.toLowerCase() === book.title.split('-')[0].trim().toLowerCase()
  )

  return {
    ...book,
    ...scrapeBook,
  }
})
