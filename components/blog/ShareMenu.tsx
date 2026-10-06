"use client";

import { useState, useEffect } from "react";

export default function ShareMenu({ url, title }: { url?: string, title?: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url || "");
  const [currentTitle, setCurrentTitle] = useState(title || "");

  useEffect(() => {
    if (!currentUrl) setCurrentUrl(window.location.href);
    if (!currentTitle) setCurrentTitle(document.title || "IdeaAI Blog");
  }, [currentUrl, currentTitle]);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(currentTitle);

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-[#1f1f1f] hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        <span className="font-medium text-[15px]">Share</span>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
        <a href={`https://x.com/intent/post?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span>x.com</span>
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          <span>Facebook</span>
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          <span>LinkedIn</span>
        </a>
        <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>Mail</span>
        </a>
        <button onClick={handleCopy} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
          {copied ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
