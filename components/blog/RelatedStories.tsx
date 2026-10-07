"use client";

import { useRef, useState, useEffect } from "react";

import Link from "next/link";

export interface RelatedPost {
  title: string;
  category: string;
  slug: string;
  coverImage?: string;
}

export default function RelatedStories({ posts }: { posts?: RelatedPost[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // Initial calculation
      handleScroll();
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Fallback empty state if no posts are provided
  const displayPosts = posts && posts.length > 0 ? posts : [];

  if (displayPosts.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-[28px] font-normal text-[#1f1f1f] mb-8">Related stories</h3>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 custom-scrollbar snap-x no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayPosts.map((post, idx) => (
          <div key={idx} className="w-[300px] shrink-0 snap-start">
            <Link href={`/blog/${post.slug}`}>
              <div className="w-full aspect-square bg-[#F4F7FC] rounded-[32px] mb-6 flex items-center justify-center overflow-hidden group cursor-pointer relative border border-slate-100">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                   <h4 className="text-[64px] font-bold text-[#1a73e8] opacity-20">IAI</h4>
                )}
              </div>
            </Link>
            <div className="text-[12px] font-medium text-[#444746] mb-3 uppercase tracking-wider">{post.category}</div>
            <Link href={`/blog/${post.slug}`}>
              <h4 className="text-[20px] text-[#1f1f1f] font-medium leading-snug mb-2 hover:text-[#1a73e8] cursor-pointer transition-colors line-clamp-2">{post.title}</h4>
            </Link>
            <div className="text-[14px] text-[#444746]">By Doğuş Yılmaz</div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <div className="flex items-center space-x-4 mt-2">
        <button 
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#1f1f1f]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
        </button>
        <button 
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#1f1f1f]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
        </button>
        <div className="h-[2px] bg-gray-200 flex-1 max-w-[200px] ml-4 relative rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#1f1f1f] transition-all duration-300 rounded-full" 
            style={{ width: '33.33%', transform: `translateX(${scrollProgress * 200}%)` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
