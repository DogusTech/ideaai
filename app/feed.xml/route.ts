import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

function parseFrontmatter(content: string) {
  const parts = content.split('---')
  const values: Record<string, string> = {}
  if (parts.length >= 3) {
    parts[1].split('\n').forEach((line) => {
      const match = line.match(/^([a-zA-Z0-9_]+):\s*"(.*)"$/)
      if (match) values[match[1]] = match[2]
    })
  }
  return {
    body: parts.length >= 3 ? parts.slice(2).join('---').trim() : content,
    ...values,
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const articlesDir = path.join(process.cwd(), 'content/articles')
  const items = fs.existsSync(articlesDir)
    ? fs.readdirSync(articlesDir)
        .filter((file) => file.endsWith('.md'))
        .map((file) => {
          const parsed = parseFrontmatter(fs.readFileSync(path.join(articlesDir, file), 'utf8'))
          const slug = parsed.slug || file.replace(/\.md$/, '')
          const title = parsed.body.match(/^#\s+(.+)$/m)?.[1] || parsed.title || slug
          const publishedAt = parsed.publishedAt || new Date().toISOString()
          const description = parsed.body.split('\n\n')[1] || ''
          return `<item><title>${escapeXml(title)}</title><link>https://ideaai.togetlink.com/blog/${escapeXml(slug)}</link><guid>https://ideaai.togetlink.com/blog/${escapeXml(slug)}</guid><pubDate>${new Date(publishedAt).toUTCString()}</pubDate><description>${escapeXml(description)}</description></item>`
        })
        .join('')
    : ''

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>IdeaAI Blog</title><link>https://ideaai.togetlink.com/blog</link><description>Autonomous coding, local AI, Windows engineering, and developer workflows from IdeaAI.</description>${items}</channel></rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
