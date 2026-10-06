import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
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

  return (
    <div className="bg-white min-h-screen text-[#111827] font-sans pb-12">
      <article className="max-w-[760px] mx-auto px-6 pt-16">
        
        {/* BAŞLIK VE TARİH */}
        <header className="mb-10">
          <h1 className="text-[40px] md:text-[46px] font-semibold tracking-tight text-[#111827] leading-[1.15] mb-6">
            {frontmatter.title || slug.replace(/-/g, ' ').toUpperCase()}
          </h1>
          
          <div className="text-gray-500 text-[15px] mb-10">
            {frontmatter.publishedAt && (
              <span>
                Published on {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>

          {/* OTONOM ÜRETİLEN KAPAK GÖRSELİ */}
          {frontmatter.coverImage && (
            <div className="w-full mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img 
                src={frontmatter.coverImage} 
                alt={frontmatter.title || slug}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </header>

        {/* MARKDOWN İÇERİĞİ */}
        <div className="text-[#374151]">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6 text-[#111827] tracking-tight" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-[26px] font-semibold mt-14 mb-5 text-[#111827] tracking-tight" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-[20px] font-semibold mt-10 mb-4 text-[#111827] tracking-tight" {...props} />,
              p: ({node, ...props}) => <p className="text-[17px] leading-[1.8] mb-7 text-[#374151]" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-7 space-y-2 text-[17px] text-[#374151]" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-7 space-y-2 text-[17px] text-[#374151]" {...props} />,
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
                    // Hydration hatasını önlemek için div yerine span (display: block)
                    return (
                      <span className="block my-10 rounded-xl overflow-hidden shadow-md border border-gray-100 relative pt-[56.25%] bg-black">
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
                return <a className="text-blue-600 hover:text-blue-800 underline underline-offset-2" {...props} />;
              },
              img: ({node, ...props}) => (
                // Hydration hatasını önlemek için div yerine span (display: block)
                <span className="block my-10 w-full">
                  <img className="w-full h-auto rounded-xl shadow-md border border-gray-100" {...props} />
                </span>
              ),
              strong: ({node, ...props}) => <strong className="font-semibold text-[#111827]" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-[3px] border-gray-300 pl-5 py-1 my-8 text-gray-600 italic text-lg" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-10">
                  <table className="w-full text-left border-collapse border border-gray-200 text-[15px]" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-gray-50 border-b border-gray-200" {...props} />,
              th: ({node, ...props}) => <th className="py-3 px-4 font-semibold text-[#111827] border-r border-gray-200 last:border-r-0" {...props} />,
              td: ({node, ...props}) => <td className="py-3 px-4 text-[#374151] border-b border-r border-gray-200 last:border-r-0" {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>

        {/* IDEA AI CALL TO ACTION (CTA) BLOCK */}
        <div className="mt-16 bg-[#F9FAFB] border border-gray-100 py-12 px-8 text-center flex flex-col items-center">
          <h2 className="text-[22px] font-semibold text-[#111827] mb-4">Try IdeaAI Today</h2>
          <p className="text-[#6B7280] text-[16px] max-w-[480px] mb-8 leading-relaxed">
            If you want an autonomous agent that does the heavy lifting but still mentors you like a Senior Developer, download it today.
          </p>
          <a 
            href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#111827] text-white px-8 py-3.5 rounded-sm font-medium hover:bg-black transition-colors"
          >
            Download on Microsoft Store
          </a>
        </div>
      </article>

      {/* FOOTER */}
      <footer className="max-w-[1000px] mx-auto px-6 py-12 mt-12 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-[#111827] mb-4">Product</h4>
            <ul className="space-y-3 text-[14px] text-gray-500">
              <li><a href="#" className="hover:text-black">How it works</a></li>
              <li><a href="#" className="hover:text-black">Discover hubs</a></li>
              <li><a href="#" className="hover:text-black">Plans</a></li>
              <li><a href="#" className="hover:text-black">Register</a></li>
              <li><a href="#" className="hover:text-black">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] mb-4">Company</h4>
            <ul className="space-y-3 text-[14px] text-gray-500">
              <li><a href="#" className="hover:text-black">About TogetLink</a></li>
              <li><a href="#" className="hover:text-black">Founder</a></li>
              <li><a href="#" className="hover:text-black">Blog</a></li>
              <li><a href="#" className="hover:text-black">Press</a></li>
              <li><a href="#" className="hover:text-black">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] mb-4">Trust</h4>
            <ul className="space-y-3 text-[14px] text-gray-500">
              <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-black">Terms of Service</a></li>
              <li><a href="#" className="hover:text-black">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#111827] mb-4">Resources</h4>
            <ul className="space-y-3 text-[14px] text-gray-500">
              <li><a href="#" className="hover:text-black">FAQ</a></li>
              <li><a href="#" className="hover:text-black">Support</a></li>
              <li><a href="#" className="hover:text-black">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-[13px] text-gray-500">
          <p>© 2026 Aeternexus Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Terms of Use</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
