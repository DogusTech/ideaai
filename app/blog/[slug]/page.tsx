import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

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

// İlk paragrafı özet (subtitle) olarak çıkaran fonksiyon
function extractExcerpt(markdown: string) {
  const paragraphs = markdown.split('\n\n');
  for (const p of paragraphs) {
    const trimmed = p.trim();
    // Başlık, liste, kod bloğu veya resim olmayan ilk düz metni bul
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('!') && !trimmed.startsWith('-') && !trimmed.startsWith('```') && !trimmed.startsWith('|')) {
      return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed;
    }
  }
  return 'In this article, we explore how autonomous AI coding agents are revolutionizing software engineering and deployment workflows.';
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

  const headings = extractHeadings(markdownContent);
  const excerpt = extractExcerpt(markdownContent);
  const readingTime = Math.max(1, Math.ceil(markdownContent.split(' ').length / 200));

  return (
    <div className="bg-white min-h-screen text-[#1f1f1f] font-sans">
      
      {/* GOOGLE-STYLE LIGHT BLUE HEADER SECTION */}
      <div className="bg-[#F4F7FC] pt-12 pb-16 px-6">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Breadcrumb */}
          <div className="text-[14px] text-[#444746] font-medium mb-12 flex items-center space-x-2">
            <span className="text-[#1a73e8] hover:underline cursor-pointer">Home</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#1a73e8] hover:underline cursor-pointer">Innovation & AI</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#1a73e8] hover:underline cursor-pointer">News from TogetLink</span>
          </div>

          {/* Title */}
          <h1 className="text-[44px] md:text-[56px] font-normal tracking-tight text-[#1f1f1f] leading-[1.1] mb-12">
            {frontmatter.title || slug.replace(/-/g, ' ').toUpperCase()}
          </h1>

          {/* Date, Read Time & Excerpt */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-32 shrink-0 text-[14px] text-[#444746]">
              <div className="mb-1">
                {frontmatter.publishedAt ? new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Today'}
              </div>
              <div>{readingTime} min read</div>
            </div>
            <div className="flex-1 text-[20px] md:text-[22px] text-[#444746] leading-[1.6]">
              {excerpt}
            </div>
          </div>

          <hr className="border-gray-300 mb-6" />

          {/* Author & Share */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-[16px] font-medium text-[#1f1f1f]">Doğuş Yılmaz</div>
              <div className="text-[14px] text-[#444746]">CEO at Aeternexus (TogetLink)</div>
            </div>
            
            {/* Share Menu (CSS hover tabanlı) */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-[#1f1f1f] hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                <span className="font-medium text-[15px]">Share</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>x.com</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>Mail</span>
                </a>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  <span>Copy link</span>
                </a>
              </div>
            </div>
          </div>
          
          <hr className="border-gray-300 mb-8" />
          
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-6 relative z-10">
          {/* DEV KAPAK GÖRSELİ */}
          {frontmatter.coverImage && (
            <div className="w-full mb-16 rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2">
              <img 
                src={frontmatter.coverImage} 
                alt={frontmatter.title || slug}
                className="w-full h-auto object-cover rounded-2xl"
                style={{ maxHeight: '700px' }}
              />
            </div>
          )}
      </div>

      {/* İÇERİK ALANI (TOC + MAIN CONTENT) */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 relative">
        
        {/* SOL YAN MENÜ: In this article (TOC) */}
        <aside className="w-full lg:w-64 shrink-0">
          {/* MOBILE TOC (Pill-shaped accordion) */}
          <div className="lg:hidden mb-8">
            <details className="group bg-[#F8F9FA] rounded-full border border-gray-100 overflow-hidden w-max min-w-[200px]">
              <summary className="flex items-center justify-between px-6 py-3 cursor-pointer list-none hover:bg-gray-100 transition-colors">
                <span className="font-medium text-[#1f1f1f] text-[16px] mr-6">In this article</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1f1f1f] transform transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </summary>
              <div className="px-6 py-4 bg-white border-t border-gray-100 shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
                <ul className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                  {headings.map((heading, i) => (
                    <li key={i} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                      <a 
                        href={`#${heading.id}`} 
                        className="text-[#1a73e8] hover:underline text-[15px] leading-snug block transition-colors"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          {/* DESKTOP TOC (Sticky Sidebar) */}
          <div className="hidden lg:block sticky top-24 bg-[#F8F9FA] rounded-[24px] p-6 border border-gray-100">
            <h3 className="text-[18px] font-medium text-[#1f1f1f] mb-4 pb-4 border-b border-gray-200">
              In this article
            </h3>
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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
                h1: ({node, ...props}) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h1 id={id} className="text-[32px] font-normal mt-14 mb-6 text-[#1f1f1f] tracking-tight" {...props} />
                },
                h2: ({node, ...props}) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h2 id={id} className="text-[28px] font-normal mt-14 mb-5 text-[#1f1f1f] tracking-tight scroll-mt-24" {...props} />
                },
                h3: ({node, ...props}) => {
                  const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h3 id={id} className="text-[22px] font-medium mt-10 mb-4 text-[#1f1f1f] tracking-tight scroll-mt-24" {...props} />
                },
                p: ({node, ...props}) => <p className="text-[18px] leading-[1.7] mb-7 text-[#444746]" {...props} />,
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
              <div className="w-40 h-40 shrink-0 rounded-[24px] overflow-hidden bg-gray-200">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dogus&backgroundColor=b6e3f4" 
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

          {/* RELATED STORIES (CAROUSEL) */}
          <div className="mb-12">
            <h3 className="text-[28px] font-normal text-[#1f1f1f] mb-8">Related stories</h3>
            
            <div className="flex overflow-x-auto gap-6 pb-8 custom-scrollbar snap-x">
              
              {/* Card 1 */}
              <div className="w-[300px] shrink-0 snap-start">
                <div className="w-full aspect-square bg-[#E8F0FE] rounded-[32px] mb-6 flex items-center justify-center p-8 overflow-hidden group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-[64px] font-bold text-[#1a73e8] drop-shadow-sm z-10 transform group-hover:scale-110 transition-transform duration-500">IAI</h4>
                </div>
                <div className="text-[12px] font-medium text-[#444746] mb-3 uppercase tracking-wider">AI Models</div>
                <h4 className="text-[20px] text-[#1f1f1f] font-medium leading-snug mb-2 hover:text-[#1a73e8] cursor-pointer transition-colors">IdeaAI 2.0: The next era of autonomous engineering</h4>
                <div className="text-[14px] text-[#444746]">By Doğuş Yılmaz</div>
              </div>

              {/* Card 2 */}
              <div className="w-[300px] shrink-0 snap-start">
                <div className="w-full aspect-square bg-[#FCE8E6] rounded-[32px] mb-6 flex items-center justify-center p-8 overflow-hidden group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-[64px] font-bold text-[#EA4335] drop-shadow-sm z-10 transform group-hover:scale-110 transition-transform duration-500">Term</h4>
                </div>
                <div className="text-[12px] font-medium text-[#444746] mb-3 uppercase tracking-wider">Engineering</div>
                <h4 className="text-[20px] text-[#1f1f1f] font-medium leading-snug mb-2 hover:text-[#1a73e8] cursor-pointer transition-colors">How we automated GitHub CI/CD with Hybrid Agents</h4>
                <div className="text-[14px] text-[#444746]">By Engineering Team</div>
              </div>

              {/* Card 3 */}
              <div className="w-[300px] shrink-0 snap-start">
                <div className="w-full aspect-square bg-[#E6F4EA] rounded-[32px] mb-6 flex items-center justify-center p-8 overflow-hidden group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-[64px] font-bold text-[#34A853] drop-shadow-sm z-10 transform group-hover:scale-110 transition-transform duration-500">Sync</h4>
                </div>
                <div className="text-[12px] font-medium text-[#444746] mb-3 uppercase tracking-wider">Product Update</div>
                <h4 className="text-[20px] text-[#1f1f1f] font-medium leading-snug mb-2 hover:text-[#1a73e8] cursor-pointer transition-colors">Local Ollama meets Cloud Deterministic Execution</h4>
                <div className="text-[14px] text-[#444746]">By Doğuş Yılmaz</div>
              </div>

            </div>
            
            {/* Carousel Controls (Mock) */}
            <div className="flex items-center space-x-4 mt-2">
              <button className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-400 cursor-not-allowed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center hover:bg-gray-200 transition-colors text-[#1f1f1f]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
              </button>
              <div className="h-[2px] bg-gray-200 flex-1 max-w-[200px] ml-4">
                <div className="h-full bg-[#1f1f1f] w-1/3"></div>
              </div>
            </div>
          </div>

          {/* IDEA AI CALL TO ACTION (CTA) BLOCK */}
          <div className="mt-12 bg-[#F4F7FC] rounded-[32px] p-12 text-center flex flex-col items-center border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-[32px] font-normal text-[#1f1f1f] mb-4 relative z-10">Try IdeaAI Today</h2>
            <p className="text-[#444746] text-[18px] max-w-[500px] mb-8 leading-relaxed relative z-10">
              If you want an autonomous agent that does the heavy lifting but still mentors you like a Senior Developer, download it today.
            </p>
            <a 
              href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" 
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 bg-[#1a73e8] text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Download on Microsoft Store
            </a>
          </div>
        </article>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-medium text-[#1f1f1f] mb-6">Product</h4>
              <ul className="space-y-4 text-[15px] text-[#444746]">
                <li><a href="#" className="hover:text-[#1a73e8]">How it works</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Discover hubs</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Plans</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Register</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1f1f1f] mb-6">Company</h4>
              <ul className="space-y-4 text-[15px] text-[#444746]">
                <li><a href="#" className="hover:text-[#1a73e8]">About TogetLink</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Founder</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Blog</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Press</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1f1f1f] mb-6">Trust</h4>
              <ul className="space-y-4 text-[15px] text-[#444746]">
                <li><a href="#" className="hover:text-[#1a73e8]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#1f1f1f] mb-6">Resources</h4>
              <ul className="space-y-4 text-[15px] text-[#444746]">
                <li><a href="#" className="hover:text-[#1a73e8]">FAQ</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Support</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-[14px] text-[#444746]">
            <p>© 2026 Aeternexus Inc. All rights reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-[#1a73e8]">Privacy Policy</a>
              <a href="#" className="hover:text-[#1a73e8]">Terms of Service</a>
              <a href="#" className="hover:text-[#1a73e8]">Terms of Use</a>
              <a href="#" className="hover:text-[#1a73e8]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
