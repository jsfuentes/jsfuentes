import Link from '@/components/Link'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { ReactNode } from 'react'
import Image from 'next/image'
import { combinedBooks } from '@/utils/combinedBooks'
import Comments from '@/components/Comments'

interface SimpleProps {
  content: (typeof combinedBooks)[0]
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function BookSimple({ content, next, prev, children }: SimpleProps) {
  console.log('Content', content)

  const { slug, title, author, publish_date, book_image, rating_num, review } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="dark:prose-dark prose max-w-none pb-8 pt-10">
                <div className="mb-8 flex flex-col items-center md:flex-row md:items-start">
                  {book_image && (
                    <div className="mb-4 w-32 flex-none rounded-lg shadow-md md:mb-0 md:mr-6">
                      <Image
                        width={1000}
                        height={1500}
                        src={book_image}
                        alt={`Cover of ${title}`}
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="mb-2 text-3xl font-bold">{title}</h1>
                    <p className="mb-2 text-xl">by {author}</p>
                    <p className="mb-4 text-gray-300">{new Date(publish_date).getFullYear()}</p>
                    <div className="mb-4">
                      {rating_num &&
                        [...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < rating_num ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                    </div>
                    {review && <p>{review}</p>}
                  </div>
                </div>
                <h2 className="mb-4 mt-8 text-2xl font-bold">Notes</h2>
                {children}
              </div>
            </div>
            {siteMetadata.comments && (
              <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
