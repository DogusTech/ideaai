import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import RelatedStories from '@/components/blog/RelatedStories';
import ShareMenu from '@/components/blog/ShareMenu';

export async function generateStaticParams() {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  if (!fs.existsSync(articlesDir)) return [];
  
  const files = fs.readdirSync(articlesDir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', ''),
    }));
}

// TOC (In this article) için markdown içindeki başlıkları çıkaran yardımcı fonksiyon
function extractHeadings(markdown: string) {
  const headings: { text: string; id: string; level: number }[] = [];
  const lines = markdown.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ text, id, level });
    }
  }
  return headings;
}

// Markdown'dan asıl başlık ve özeti çıkaran fonksiyon
function extractMetadata(markdown: string) {
  const paragraphs = markdown.split('\n\n');
  let realTitle = '';
  let excerpt = '';
  
  for (const p of paragraphs) {
    const trimmed = p.trim();
    // Başlık, liste, kod bloğu veya resim olmayan ilk metinleri bul
    if (!trimmed || trimmed.startsWith('!') || trimmed.startsWith('>') || trimmed.startsWith('|') || trimmed.startsWith('```')) continue;
    
    // Markdown karakterlerini temizle (#, *, vb.)
    const cleanText = trimmed.replace(/^[#\*\s]+|[#\*\s]+$/g, '');
    
    if (!realTitle) {
      realTitle = cleanText;
    } else if (!excerpt) {
      excerpt = cleanText;
      if (excerpt.length > 250) excerpt = excerpt.substring(0, 250) + '...';
      break;
    }
  }
  
  return { realTitle, excerpt };
}

import BlogNavbar from '@/components/blog/BlogNavbar';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articlesDir = path.join(process.cwd(), 'content/articles');
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { title: 'Post Not Found' };
  }

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

  const { realTitle, excerpt } = extractMetadata(markdownContent);
  
  return {
    title: `${realTitle} - IdeaAI Blog`,
    description: excerpt || 'Read the latest from the IdeaAI engineering and product team.',
    openGraph: {
      title: realTitle,
      description: excerpt,
      images: frontmatter.coverImage ? [frontmatter.coverImage] : undefined,
      type: 'article',
    }
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articlesDir = path.join(process.cwd(), 'content/articles');
  const filePath = path.join(articlesDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

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

  // Replace standalone **Bold** lines with ## Headings for proper TOC and rendering
  markdownContent = markdownContent.replace(/^\*\*([^\*]+)\*\*$/gm, '## $1');

  const headings = extractHeadings(markdownContent);
  const { realTitle, excerpt } = extractMetadata(markdownContent);
  const readingTime = Math.max(1, Math.ceil(markdownContent.split(' ').length / 200));
  
  const categoryBadge = frontmatter.title || slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="bg-white min-h-screen text-[#1f1f1f] font-sans">
      
      {/* GOOGLE-STYLE MEGA MENU NAVBAR */}
      <BlogNavbar />

      {/* HEADER (Gradient Background Transition) */}
      <div className="bg-gradient-to-b from-[#F4F7FC] via-[#F4F7FC] to-white pb-8 pt-10 px-6">
          <div className="max-w-[1000px] mx-auto">
            {/* Breadcrumb & Category */}
            <div className="text-[14px] text-slate-500 font-medium mb-10 flex items-center space-x-2">
              <span className="hover:text-slate-800 hover:underline cursor-pointer transition-colors">IdeaAI Updates</span>
              <span className="text-gray-400">›</span>
              <span className="hover:text-slate-800 hover:underline cursor-pointer transition-colors">DevOps Engineering</span>
              <span className="text-gray-400">›</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{categoryBadge}</span>
            </div>

            {/* Title */}
            <h1 className="text-[44px] md:text-[56px] font-normal tracking-tight text-[#1f1f1f] leading-[1.1] mb-8">
              {realTitle}
            </h1>

            {/* Excerpt */}
            {excerpt && (
              <div className="text-[20px] md:text-[22px] text-[#444746] font-medium leading-[1.6] mb-8">
                {excerpt}
              </div>
            )}

            <hr className="border-gray-200 mb-6" />

            {/* Date, Read Time, Author, Share */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm border border-gray-100 bg-gray-50 shrink-0">
                  <img src="/dogus-yilmaz.png" alt="Doğuş Yılmaz" className="w-full h-full object-cover" />
                </div>
                <div>
                  <a href="/authors/dogus-yilmaz" className="text-[16px] font-semibold text-[#1f1f1f] hover:underline hover:text-[#1a73e8] transition-colors">Doğuş Yılmaz</a>
                  <div className="text-[14px] text-[#444746] flex items-center space-x-2 mt-0.5">
                     <span>CEO at IdeaAI</span>
                     <span className="text-gray-300">•</span>
                     <span>
                      {frontmatter.publishedAt ? new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Today'}
                     </span>
                     <span className="text-gray-300">•</span>
                     <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
              
              <ShareMenu url="" title={realTitle} />
            </div>
            
          </div>
        </div>

      <div className="w-full max-w-[1000px] mx-auto px-6 mt-8 mb-16 relative z-10">
          {/* DEV KAPAK GÖRSELİ */}
          {frontmatter.coverImage && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm aspect-video bg-white">
              <img 
                src={frontmatter.coverImage} 
                alt={frontmatter.title || slug}
                className="w-full h-full object-cover"
              />
            </div>
          )}
      </div>

      {/* İÇERİK ALANI (TOC + MAIN CONTENT) */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 relative">
        
        {/* SOL YAN MENÜ: In this article (TOC) */}
        <aside className="w-full lg:w-64 shrink-0 relative z-20">
          {/* TOC (Pill-shaped accordion, visible on all screens) */}
          <div className="mb-8 lg:sticky lg:top-28">
            <details className="group bg-[#F8F9FA] rounded-[32px] overflow-hidden w-full max-w-[300px]">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-[#1f1f1f] text-[18px]">In this article</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1f1f1f] transform transition-transform group-open:rotate-180 ml-6"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </summary>
              <div className="px-6 pb-6 bg-[#F8F9FA]">
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <ul className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                    {headings.map((heading, i) => (
                      <li key={i} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                        <a 
                          href={`#${heading.id}`} 
                          className="text-[#444746] hover:text-[#1a73e8] text-[15px] leading-snug block transition-colors"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </aside>

        {/* SAĞ ANA İÇERİK */}
        <article className="flex-1 max-w-[760px]">
          
          {/* AI SUMMARY KUTUSU (Native HTML Details ile) */}
          <details className="mb-12 group bg-[#F8F9FA] border border-gray-100 rounded-3xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-100 transition-colors list-none">
              <div className="flex items-center space-x-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1a73e8]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M12 7v6"></path><path d="M12 17h.01"></path></svg>
                <span className="font-medium text-[#1f1f1f] text-[16px]">Read AI-generated summary</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 transform transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </summary>
            
            <div className="p-6 pt-2 border-t border-gray-200 bg-white shadow-[inset_0_4px_12px_rgba(0,0,0,0.03)] text-[15px] text-[#444746] leading-relaxed">
              <ul className="list-disc pl-5 space-y-3">
                <li>IdeaAI autonomous agent brings advanced reasoning to complex, long-horizon software engineering tasks.</li>
                <li>The system functions directly in the terminal, bypassing standard IDE limitations.</li>
                <li>It excels at deployment management, systemd configuration, and autonomous vulnerability patching.</li>
                <li>Unlike standard tools, IdeaAI continues working in the cloud even when you sleep.</li>
              </ul>
              <div className="mt-6 text-[12px] text-gray-400 italic">
                Summaries were generated by IdeaAI. Generative AI is experimental.
              </div>
            </div>
          </details>

          {/* MARKDOWN RENDER */}
          <div className="text-[#1f1f1f] google-blog-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, children, ...props}) => {
                  const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  if (children?.toString().replace(/^[#\*\s]+|[#\*\s]+$/g, '') === realTitle) return null;
                  return <h1 id={id} className="text-[32px] font-normal mt-14 mb-6 text-[#1f1f1f] tracking-tight" {...props}>{children}</h1>
                },
                h2: ({node, children, ...props}) => {
                  const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  if (children?.toString().replace(/^[#\*\s]+|[#\*\s]+$/g, '') === realTitle) return null;
                  return <h2 id={id} className="text-[28px] font-normal mt-14 mb-5 text-[#1f1f1f] tracking-tight scroll-mt-24" {...props}>{children}</h2>
                },
                h3: ({node, children, ...props}) => {
                  const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  if (children?.toString().replace(/^[#\*\s]+|[#\*\s]+$/g, '') === realTitle) return null;
                  return <h3 id={id} className="text-[22px] font-medium mt-10 mb-4 text-[#1f1f1f] tracking-tight scroll-mt-24" {...props}>{children}</h3>
                },
                p: ({node, children, ...props}) => {
                  if (children && children.length === 1 && typeof children[0] === 'string') {
                     const text = children[0].replace(/^[#\*\s]+|[#\*\s]+$/g, '');
                     if (text === realTitle || text === excerpt) {
                        return null; // Skip rendering title and excerpt inside body
                     }
                  }
                  // Check if this paragraph contains strong elements matching title/excerpt
                  if (children && Array.isArray(children)) {
                     const joined = children.map(c => {
                       if (typeof c === 'string') return c;
                       if (c && typeof c === 'object' && c.props && c.props.children) {
                         return String(c.props.children);
                       }
                       return '';
                     }).join('').replace(/^[#\*\s]+|[#\*\s]+$/g, '');
                     if (joined === realTitle || joined === excerpt) {
                       return null;
                     }
                  }
                  return <p className="text-[18px] leading-[1.7] mb-7 text-[#444746]" {...props}>{children}</p>;
                },
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-7 space-y-3 text-[18px] text-[#444746]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-7 space-y-3 text-[18px] text-[#444746]" {...props} />,
                li: ({node, ...props}) => <li className="pl-2" {...props} />,
                a: ({node, ...props}) => {
                  const href = props.href || '';
                  if (href.includes('youtube.com/watch') || href.includes('youtu.be/')) {
                    let videoId = '';
                    if (href.includes('youtube.com/watch')) {
                      videoId = new URL(href).searchParams.get('v') || '';
                    } else if (href.includes('youtu.be/')) {
                      videoId = href.split('youtu.be/')[1].split('?')[0];
                    }
                    if (videoId) {
                      return (
                        <span className="block my-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative pt-[56.25%] bg-black">
                          <iframe 
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${videoId}`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        </span>
                      );
                    }
                  }
                  return <a className="text-[#1a73e8] hover:underline underline-offset-2" {...props} />;
                },
                img: ({node, ...props}) => (
                  <span className="block my-12 w-full">
                    <img className="w-full h-auto rounded-3xl shadow-sm border border-gray-100" {...props} />
                  </span>
                ),
                strong: ({node, ...props}) => <strong className="font-semibold text-[#1f1f1f]" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-[4px] border-[#1a73e8] bg-[#F8F9FA] p-6 rounded-r-2xl my-8 text-[#444746] italic text-[18px]" {...props} />
                ),
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-12 border border-gray-200 rounded-2xl">
                    <table className="w-full text-left border-collapse text-[16px]" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => <thead className="bg-[#F8F9FA] border-b border-gray-200" {...props} />,
                th: ({node, ...props}) => <th className="py-4 px-6 font-medium text-[#1f1f1f] border-r border-gray-200 last:border-r-0" {...props} />,
                td: ({node, ...props}) => <td className="py-4 px-6 text-[#444746] border-b border-r border-gray-200 last:border-r-0" {...props} />,
                pre: ({node, ...props}) => (
                  <div className="my-8 rounded-2xl overflow-hidden bg-[#1E1E1E] border border-gray-800 shadow-xl">
                    <pre className="p-6 overflow-x-auto text-[15px] leading-relaxed text-gray-100 custom-scrollbar" {...props} />
                  </div>
                )
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>

          {/* POSTED IN & MORE INFO */}
          <div className="mt-16 mb-16">
            <h3 className="text-[22px] font-normal text-[#1f1f1f] mb-6">Posted in:</h3>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="px-4 py-2 bg-[#F8F9FA] hover:bg-[#F1F3F4] transition-colors rounded-full text-[14px] text-[#444746] font-medium cursor-pointer">
                AI Coding Agents
              </span>
              <span className="px-4 py-2 bg-[#F8F9FA] hover:bg-[#F1F3F4] transition-colors rounded-full text-[14px] text-[#444746] font-medium cursor-pointer">
                Engineering
              </span>
            </div>

            <details className="group border-t border-b border-gray-200">
              <summary className="flex items-center justify-between py-5 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                <span className="font-medium text-[#1a73e8] text-[16px]">More Information</span>
                <span className="bg-[#F8F9FA] rounded-full p-2 group-open:rotate-180 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#444746]"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </summary>
              <div className="py-4 text-[#444746] text-[15px] leading-relaxed">
                For media inquiries, please contact press@togetlink.com. IdeaAI is developed by Aeternexus Inc., a Delaware company.
              </div>
            </details>
          </div>

        {/* ABOUT THE AUTHOR (GOOGLE STYLE CARD) */}
        <div className="mb-20">
          <h3 className="text-[28px] font-normal text-[#1f1f1f] mb-8">About the author</h3>
          <div className="bg-[#F4F7FC] rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 shrink-0 rounded-[24px] overflow-hidden bg-gray-200 shadow-sm">
              <img 
                src="/dogus-yilmaz.png" 
                alt="Doğuş Yılmaz" 
                className="w-full h-full object-cover"
              />
              </div>
              <div className="flex-1">
                <h4 className="text-[20px] font-medium text-[#1f1f1f] mb-1">Doğuş Yılmaz</h4>
                <div className="text-[15px] text-[#444746] mb-4">CEO at Aeternexus and Chief AI Architect, TogetLink</div>
                <p className="text-[15px] text-[#444746] leading-relaxed mb-6">
                  Doğuş is the visionary Solo Technical Founder & CEO behind IdeaAI. He leads the development of state-of-the-art autonomous AI coding agents and their integration into modern software engineering workflows. His work focuses on transforming the traditional IDE experience into a 24/7 cloud-hybrid autonomous workspace.
                </p>
                <a href="#" className="inline-flex items-center space-x-2 text-[#1f1f1f] font-medium hover:text-[#1a73e8] transition-colors">
                  <span>Read more from Doğuş Yılmaz</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </a>
              </div>
            </div>
          </div>

          <RelatedStories />

          {/* IDEA AI CALL TO ACTION (CTA) BLOCK */}
          <div 
            className="mt-12 bg-[#F8F9FA] text-[#1f1f1f] rounded-[32px] p-12 lg:p-16 text-center flex flex-col items-center shadow-sm"
            style={{ fontFamily: "var(--font-sans), 'Inter Fallback', sans-serif" }}
          >
            <h2 className="text-[32px] md:text-[36px] font-normal mb-6 leading-tight text-[#1f1f1f]">Try IdeaAI Today</h2>
            <p className="text-[18px] text-[#444746] max-w-[600px] mb-10 leading-relaxed font-normal">
              If you want an autonomous agent that does the heavy lifting but still mentors you like a Senior Developer, download it today.
            </p>
            <a 
              href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1d4ed8] text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Download on Microsoft Store
            </a>
          </div>
        </article>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#F8F9FA] border-t border-gray-200 py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[#444746] text-[15px]">
          <div className="flex items-center space-x-6 flex-wrap justify-center md:justify-start gap-y-4">
            <span className="text-[20px] font-medium text-[#1f1f1f] mr-2">IdeaAI</span>
            <a href="https://ideaai.togetlink.com/legal/privacy-policy" className="hover:text-[#1a73e8] transition-colors">Privacy</a>
            <a href="https://ideaai.togetlink.com/legal/terms" className="hover:text-[#1a73e8] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors">Help</a>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-[#1a73e8] transition-colors">
              <span>More of TogetLink</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:text-[#1a73e8] transition-colors">
              <span>Global (English)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-5 mt-6 md:mt-0 text-[#1f1f1f]">
            <a href="#" className="hover:text-[#1a73e8] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="https://x.com/togetlink" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a73e8] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            <a href="#" className="hover:text-[#1a73e8] transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
