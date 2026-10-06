"use client";

import { useRef, useState, useEffect } from "react";

export default function RelatedStories() {
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

  return (
    <div className="mb-12">
      <h3 className="text-[28px] font-normal text-[#1f1f1f] mb-8">Related stories</h3>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 custom-scrollbar snap-x no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
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

        {/* Card 4 */}
        <div className="w-[300px] shrink-0 snap-start">
          <div className="w-full aspect-square bg-[#FEF7E0] rounded-[32px] mb-6 flex items-center justify-center p-8 overflow-hidden group cursor-pointer relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h4 className="text-[64px] font-bold text-[#F9AB00] drop-shadow-sm z-10 transform group-hover:scale-110 transition-transform duration-500">Dev</h4>
          </div>
          <div className="text-[12px] font-medium text-[#444746] mb-3 uppercase tracking-wider">Developers</div>
          <h4 className="text-[20px] text-[#1f1f1f] font-medium leading-snug mb-2 hover:text-[#1a73e8] cursor-pointer transition-colors">Customizing your Agent with Constitution Rules</h4>
          <div className="text-[14px] text-[#444746]">By Community</div>
        </div>
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
