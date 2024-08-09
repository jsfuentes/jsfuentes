import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXComponents } from '@/components/MDXComponents'
import { coreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { allBooks } from 'contentlayer/generated'
import goodreadsScrape from '@/../goodreadsScrape.json'

const DEFAULT_LAYOUT = 'BookSimple'

const combinedBooks = goodreadsScrape.map((scrapeBook) => {
  const book = allBooks.find(
    (book) => scrapeBook.short_title.toLowerCase() === book.title.split('-')[0].trim().toLowerCase()
  )

  return {
    ...book,
    ...scrapeBook,
  }
})

export async function getStaticPaths() {
  return {
    paths: combinedBooks.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/')
  const bookIndex = combinedBooks.findIndex((p) => p.slug === slug)
  const prevContent = combinedBooks[bookIndex + 1] || null
  const prev = prevContent ? coreContent(prevContent) : null
  const nextContent = combinedBooks[bookIndex - 1] || null
  const next = nextContent ? coreContent(nextContent) : null
  const book = combinedBooks.find((p) => p.slug === slug)

  return {
    props: {
      book,
      prev,
      next,
    },
  }
}

export default function BlogPostPage({
  book,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <div className="mb-8">
        <div className="text-primary mb-2 text-3xl font-bold">Review </div>
        {book.rating_num &&
          [...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl ${i < book.rating_num ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        <div>{book.review}</div>
      </div>

      {book._raw && (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          content={book}
          MDXComponents={MDXComponents}
          toc={book.toc}
          prev={prev}
          next={next}
        />
      )}
    </div>
  )
}
