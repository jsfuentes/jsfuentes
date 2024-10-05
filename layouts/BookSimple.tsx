'use client'

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
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
}

export default function BookSimple({ content, next, prev, children }: SimpleProps) {
  const {
    slug,
    title,
    author,
    publish_date,
    cover_image,
    rating_num,
    review,
    read_date,
    goodreads_link,
  } = content

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
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                <div className="mb-8 flex flex-col lg:flex-row">
                  <div className="mb-6 lg:mb-0 lg:w-1/3 lg:pr-8">
                    {cover_image && (
                      <div className="overflow-hidden rounded-lg shadow-md">
                        <Image
                          width={300}
                          height={450}
                          src={cover_image}
                          alt={`Cover of ${title}`}
                          className="h-auto w-full"
                        />
                      </div>
                    )}
                  </div>
                  <div className="lg:w-2/3">
                    <h1 className="mb-2 text-3xl font-bold md:text-4xl">{title}</h1>
                    <p className="mb-2 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
                      by {author}
                    </p>
                    <div className="mb-4 flex items-center">
                      <p className="mr-4 text-sm text-gray-500 dark:text-gray-400">
                        Published:{' '}
                        {new Date(publish_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Read:{' '}
                        {new Date(read_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="mb-4 flex items-center">
                      <div className="mr-4">
                        {rating_num &&
                          [...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-2xl ${
                                i < rating_num ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                      </div>
                      {goodreads_link && (
                        <a
                          href={goodreads_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <svg
                            className="mr-2 h-5 w-5"
                            viewBox="0 0 448 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="currentColor"
                              d="M299.9 191.2c5.1 37.3-4.7 79-35.9 100.7-22.3 15.5-52.8 14.1-70.8 5.7-37.1-17.3-49.5-58.6-46.8-97.2 4.3-60.9 40.9-87.9 75.3-87.5 46.9-.2 71.8 31.8 78.2 78.3zM448 88v336c0 30.9-25.1 56-56 56H56c-30.9 0-56-25.1-56-56V88c0-30.9 25.1-56 56-56h336c30.9 0 56 25.1 56 56zM330 313.2s-.1-34-.1-217.3h-29v40.3c-.8.3-1.2-.5-1.6-1.2-9.6-20.7-35.9-46.3-76-46-51.9.4-87.2 31.2-100.6 77.8-4.3 14.9-5.8 30.1-5.5 45.6 1.7 77.9 45.1 117.8 112.4 115.2 28.9-1.1 54.5-17 69-45.2.5-1 1.1-1.9 1.7-2.9.2.1.4.1.6.2.3 3.8.2 30.7.1 34.5-.2 14.8-2 29.5-7.2 43.5-7.8 21-22.3 34.7-44.5 39.5-17.8 3.9-35.6 3.8-53.2-1.2-21.5-6.1-36.5-19-41.1-41.8-.3-1.6-1.3-1.3-2.3-1.3h-26.8c.8 10.6 3.2 20.3 8.5 29.2 24.2 40.5 82.7 48.5 128.2 37.4 49.9-12.3 67.3-54.9 67.4-106.3z"
                            />
                          </svg>
                          Goodreads
                        </a>
                      )}
                    </div>
                    {review && (
                      <div className="prose dark:prose-invert">
                        <h2 className="mb-2 text-2xl font-semibold">Review</h2>
                        <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">
                          {review}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {children && (
                  <>
                    <h2 className="mb-4 mt-8 text-2xl font-bold">Notes</h2>
                    {children}
                  </>
                )}
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
                      href={`/booknotes/${prev.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/booknotes/${next.slug}`}
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
