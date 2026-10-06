import type { Metadata } from "next"
import Link from "next/link"
import { PageShell, PageHero } from "@/components/site/page-shell"
import fs from "fs"
import path from "path"

export const metadata: Metadata = {
  title: "Blog — IdeaAI",
  description:
    "Stories, product updates, and field notes from the IdeaAI team.",
}

const CATEGORIES = ["AI Agents", "Developer Tools", "Future of Work", "Product Updates", "DevOps Automation"]

function extractMetadata(markdown: string) {
  const lines = markdown.split('\n');
  let realTitle = '';
  let excerpt = '';
  let inContent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Basit markdown temizliği
    const text = line.replace(/^[#\*\s]+|[#\*\s]+$/g, '');
    if (!text) continue;
    
    if (!realTitle && line.length > 5) {
      realTitle = text;
      continue;
    }
    
    if (realTitle && !excerpt && line.length > 15) {
      excerpt = text;
      break;
    }
  }
  
  return { realTitle, excerpt };
}

export default async function BlogPage() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  
  let posts: any[] = [];
  
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
    
    posts = files.map(filename => {
      const filePath = path.join(articlesDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const contentParts = fileContent.split('---');
      let markdownContent = fileContent;
      let frontmatter: Record<string, string> = {};

      if (contentParts.length >= 3) {
        markdownContent = contentParts.slice(2).join('---').trim();
        const fmText = contentParts[1];
        const lines = fmText.split('\n');
        lines.forEach(line => {
          const match = line.match(/^([a-zA-Z0-9_]+):\s*"(.*)"$/);
          if (match) {
            frontmatter[match[1]] = match[2];
          }
        });
      }
      
      const slug = frontmatter.slug || filename.replace('.md', '');
      const category = frontmatter.title || 'IdeaAI Updates';
      const coverImage = frontmatter.coverImage || '';
      
      // Cleanup bold headers
      markdownContent = markdownContent.replace(/^\*\*([^\*]+)\*\*$/gm, '## $1');
      
      const { realTitle, excerpt } = extractMetadata(markdownContent);
      const readTime = Math.max(1, Math.ceil(markdownContent.split(' ').length / 200));
      
      let dateStr = 'Today';
      if (frontmatter.publishedAt) {
         const d = new Date(frontmatter.publishedAt);
         dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }

      return {
        slug,
        category,
        title: realTitle || category,
        excerpt,
        coverImage,
        date: dateStr,
        readTime
      };
    });
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Blog"
        title="IdeaAI Blog"
        description="Insights on autonomous coding, AI agents, and preserving developer skills."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap gap-2 mb-16">
          {CATEGORIES.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-[15px] font-medium text-[#444746] hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Link key={i} href={`/blog/${post.slug}`} className="group flex flex-col rounded-[24px] overflow-hidden border border-gray-100 bg-white transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              {post.coverImage && (
                <div className="w-full aspect-[16/10] overflow-hidden bg-gray-50 border-b border-gray-100 relative">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
              )}
              <div className="p-8 flex flex-col flex-1">
                <div className="text-[13px] font-bold tracking-wider text-[#1a73e8] uppercase mb-4">
                  {post.category}
                </div>
                <h3 className="text-[22px] font-medium tracking-tight text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors mb-4 line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[16px] text-[#444746] line-clamp-3 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-[14px] text-[#444746] font-medium">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* HARDCODED PLACEHOLDER IF FEW POSTS */}
          {posts.length < 3 && (
            <Link href="/blog/the-ai-coding-paradox" className="group flex flex-col rounded-[24px] overflow-hidden border border-gray-100 bg-white transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="w-full aspect-[16/10] overflow-hidden bg-[#F4F7FC] border-b border-gray-100 flex items-center justify-center relative">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="text-[13px] font-bold tracking-wider text-[#1a73e8] uppercase mb-4">Developer Tools</div>
                <h3 className="text-[22px] font-medium tracking-tight text-[#1f1f1f] group-hover:text-[#1a73e8] transition-colors mb-4 line-clamp-2 leading-snug">
                  The AI Coding Paradox: Are Autonomous Agents Making Developers Lazy?
                </h3>
                <p className="text-[16px] text-[#444746] line-clamp-3 mb-8 leading-relaxed">
                  AI coding assistants save time, but there's a dark side: developers are losing their architectural skills. Here is how we fixed it with IdeaAI.
                </p>
                <div className="mt-auto flex items-center text-[14px] text-[#444746] font-medium">
                  <span>Sept 30, 2026</span>
                  <span className="mx-2">•</span>
                  <span>4 min read</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
    </PageShell>
  )
}
