import { MDXLayoutRenderer } from 'pliny/mdx-components'
import PageTitle from '@/components/PageTitle'
import { MDXComponents } from '@/components/MDXComponents'
import { sorte, coreContent } from 'pliny/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import { allBooks } from 'contentlayer/generated'
import type { Blog } from 'contentlayer/generated'

const DEFAULT_LAYOUT = 'BookSimple'

export async function getStaticPaths() {
  return {
    paths: allBooks.map((p) => ({ params: { slug: p.slug.split('/') } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const slug = (params.slug as string[]).join('/')
  const sortedBooks = allBooks
  const bookIndex = sortedBooks.findIndex((p) => p.slug === slug)
  const prevContent = sortedBooks[bookIndex + 1] || null
  const prev = prevContent ? coreContent(prevContent) : null
  const nextContent = sortedBooks[bookIndex - 1] || null
  const next = nextContent ? coreContent(nextContent) : null
  const book = sortedBooks.find((p) => p.slug === slug)

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
    <MDXLayoutRenderer
      layout={DEFAULT_LAYOUT}
      content={book}
      MDXComponents={MDXComponents}
      toc={book.toc}
      prev={prev}
      next={next}
    />
  )
}
