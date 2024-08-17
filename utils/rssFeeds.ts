import Parser from 'rss-parser'

export async function fetchMilkAndCookiesRSS() {
  try {
    const parser = new Parser()
    const feed = await parser.parseURL('https://milkandcookies.substack.com/feed')
    return feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
    }))
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return []
  }
}

export async function fetchSpringWillComeAgainRSS() {
  try {
    const parser = new Parser()
    const feed = await parser.parseURL('https://springwillcomeagain.substack.com/feed')
    return feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
    }))
  } catch (error) {
    console.error('Error fetching RSS feed:', error)
    return []
  }
}
