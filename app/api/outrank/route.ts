import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import * as cheerio from 'cheerio'

// Allow streaming responses up to 60 seconds
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response('URL is required', { status: 400 })
    }

    // 1. Fetch and Scrape the Competitor's Website
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Temel temizlik (Gereksiz kısımları at)
    $('script, style, nav, footer, header, aside, iframe').remove()
    
    const pageTitle = $('title').text()
    const pageContent = $('body').text().replace(/\s+/g, ' ').trim()
    
    if (!pageContent) {
      return new Response('Could not extract content from the URL', { status: 400 })
    }

    // 2. Generate Superior SEO & GEO Content using Gemini
    const result = streamText({
      model: google('gemini-3.6-flash'),
      system: `You are an elite SEO (Search Engine Optimization) and GEO (Generative Engine Optimization) expert.
Your goal is to "Outrank" the competitor's article provided by the user.

RULES FOR OUTRANKING:
1. Analyze the core topic, intent, and target keywords of the provided competitor content.
2. Write a COMPLETELY NEW, comprehensively superior, and highly engaging article on the same topic.
3. Use a strong, click-worthy H1 title.
4. Structure the article perfectly using Markdown (H2, H3 tags, bullet points, bold text).
5. Ensure the content is at least 30% more detailed and valuable than the original.
6. Optimize for AI Search Engines (Perplexity, ChatGPT, Gemini) by providing direct, clear answers to implied questions in the first few paragraphs (GEO optimization).
7. Do not plagiarize. Rewrite completely with a better tone, expert authority, and better readability.
8. Output ONLY the markdown article. Do not include introductory conversational text like "Here is the article".`,
      prompt: `COMPETITOR TITLE: ${pageTitle}\n\nCOMPETITOR CONTENT:\n${pageContent.substring(0, 15000)}\n\nNow, generate the ultimate SEO-optimized article that will outrank this content on Google.`,
    })

    return result.toTextStreamResponse()
    
  } catch (error) {
    console.error('Outrank API Error:', error)
    return new Response('Failed to process URL', { status: 500 })
  }
}
