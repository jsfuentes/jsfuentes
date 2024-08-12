import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { combinedBooks } from '@/utils/combinedBooks'
import BookSimple from '@/layouts/BookSimple'

const DEFAULT_LAYOUT = 'BookSimple'

const layouts = {
  BookSimple,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const book = combinedBooks.find((p) => p.slug === slug)

  if (!book) {
    return
  }

  const publishedAt = new Date(book.publish_date).toISOString()
  let imageList = [siteMetadata.socialBanner]
  if (book.book_image) {
    imageList = [book.book_image]
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: book.title,
    description: book.review.slice(0, 100),
    openGraph: {
      title: book.title,
      description: book.review.slice(0, 100),
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      url: './',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.review.slice(0, 100),
      images: imageList,
    },
  }
}

export async function generateStaticParams() {
  return combinedBooks.map((p) => ({ slug: p.slug.split('/') }))
}

export default async function BookPage({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const bookIndex = combinedBooks.findIndex((p) => p.slug === slug)
  const book = combinedBooks[bookIndex]
  if (bookIndex === -1 || !book) {
    return notFound()
  }

  const prev = combinedBooks[bookIndex + 1]
  const next = combinedBooks[bookIndex - 1]

  const Layout = layouts[book.layout || DEFAULT_LAYOUT]

  return (
    <Layout content={book} next={next} prev={prev}>
      {book.body && (
        <MDXLayoutRenderer code={book.body.code} components={components} toc={book.toc} />
      )}
    </Layout>
  )
}
