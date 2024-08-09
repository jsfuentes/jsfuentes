const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const GOODREADS_FILE_PATH = 'goodreadsScrape.json'

async function fetchBrowseAIData() {
  try {
    const response = await axios.get(
      'https://api.browse.ai/v2/robots/2d4b81c3-3c57-43a6-8af4-91521554aa00/tasks',
      {
        headers: {
          Authorization:
            'Bearer f12cb695-a030-4bbe-adf8-fcdb06ac2f76:281f0c78-0319-4785-8659-aacbd17710d1',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching Browse AI data:', error)
    return null
  }
}

// async function fetchLastBrowseAIData(taskId) {
//   try {
//     const response = await axios.get(
//       'https://api.browse.ai/v2/robots/2d4b81c3-3c57-43a6-8af4-91521554aa00/tasks/' + taskId,
//       {
//         headers: {
//           Authorization:
//             'Bearer f12cb695-a030-4bbe-adf8-fcdb06ac2f76:281f0c78-0319-4785-8659-aacbd17710d1',
//         },
//       }
//     )

//     return response.data
//   } catch (error) {
//     console.error('Error fetching Browse AI data:', error)
//     return null
//   }
// }

async function getPreviewImage(url) {
  try {
    console.log('getPreviewImage', url)
    // Fetch the HTML content of the page
    const { data } = await axios.get(url)

    // Load the HTML content using cheerio
    const $ = cheerio.load(data)

    // Look for Open Graph image meta tag
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) {
      return ogImage
    }

    // Look for a link rel image_src tag
    const imageSrc = $('link[rel="image_src"]').attr('href')
    if (imageSrc) {
      return imageSrc
    }

    // Fallback: Look for the first image in the content
    const imgTag = $('img').attr('src')
    if (imgTag) {
      return imgTag
    }

    return null
  } catch (error) {
    console.error('Error fetching the URL:', error)
    return null
  }
}

function readFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const existingData = JSON.parse(fileContent)
    console.log(`Existing data loaded from ${filePath}. Found ${existingData.length} entries.`)
    return existingData
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`No existing file found at ${filePath}. Starting with empty array.`)
    } else {
      console.error('Error reading existing file:', error)
    }
    return []
  }
}

function extractGoodreadsReview(reviewHtml) {
  const $ = cheerio.load(reviewHtml)
  const hiddenText = $('span[style="display:none"]').text()
  //   console.log(hiddenText)
  return hiddenText
}

function getShortenedTitle(title) {
  // Regular expression to match all letters before the semicolon, excluding anything inside parentheses
  const regex = /^[^;]*?(?=\s*\(.*?\))*[^();]*/

  // Extract the part of the string before the semicolon, excluding text inside parentheses
  const match = title.split(':')[0].match(regex)

  if (match) {
    const result = match[0].trim() // Trim any leading or trailing whitespace
    return result
  } else {
    console.log('No match found????')
    return title
  }
}

function ratingToNum(rating) {
  switch (rating) {
    case 'it was amazing':
      return 5
    case 'really liked it':
      return 4
    case 'liked it':
      return 3
    case 'it was ok':
      return 2
    case 'did not like it':
      return 1
    default:
      return null
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters (excluding whitespace and hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

async function main() {
  const browseAIData = await fetchBrowseAIData()
  console.log('BrowseAIData', browseAIData)
  const robotTasks = browseAIData.result.robotTasks.items
  const capturedDataTempUrl = robotTasks[robotTasks.length - 1].capturedDataTemporaryUrl
  console.log('captured', capturedDataTempUrl)

  const resp = await axios.get(capturedDataTempUrl)
  const goodreadsRaw = resp.data.capturedLists.my_goodreads
  console.log('GoodreadsRaw', goodreadsRaw.length, goodreadsRaw[goodreadsRaw.length - 1])

  const goodreadsList = goodreadsRaw.map((book) => ({
    ...book,
    read_year: book.read_date ? new Date(book.read_date).getFullYear() : null,
    review: extractGoodreadsReview(book.review_html),
    short_title: getShortenedTitle(book.title),
    rating_num: ratingToNum(book.rating),
    slug: slugify(getShortenedTitle(book.title)),
  }))

  //Read the filepath and get json object there
  const filePath = path.join(__dirname, GOODREADS_FILE_PATH)
  const existingData = readFile(filePath)

  // For each member of the list, if the existing data doesn't have
  const updatedData = await Promise.all(
    goodreadsList.map(async (book) => {
      const existingBook = existingData.find(
        (existing) => existing.goodreads_link === book.goodreads_link
      )

      if (existingBook && existingBook.book_image) {
        // If the book already exists and has an image, use the existing data
        return { ...existingBook, ...book }
      } else {
        // If the book doesn't exist or doesn't have an image, fetch the image
        const book_image = await getPreviewImage(book.goodreads_link)
        return { ...book, book_image }
      }
    })
  )

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
  console.log(`JSON file has been saved to ${filePath}`)
}

main()
