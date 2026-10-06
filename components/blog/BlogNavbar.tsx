"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BlogNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => setActiveMenu(menu);
  const handleMouseLeave = () => setActiveMenu(null);

  return (
    <div className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <nav className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto relative">
        <div className="flex items-center space-x-8">
          <Link href="/blog" className="text-[22px] font-medium text-[#1f1f1f] tracking-tight">
            IdeaAI <span className="font-normal text-gray-500">News</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 text-[15px] text-[#444746] font-medium h-full" onMouseLeave={handleMouseLeave}>
            
            {/* CAPABILITIES & AI */}
            <div 
              className="flex items-center h-[56px] cursor-pointer hover:text-[#1f1f1f] group"
              onMouseEnter={() => handleMouseEnter('capabilities')}
            >
              <span>Capabilities & AI</span>
              <svg className={`ml-1 w-4 h-4 transform transition-transform ${activeMenu === 'capabilities' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              
              {/* MEGA MENU: Capabilities */}
              {activeMenu === 'capabilities' && (
                <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-[0_12px_24px_rgba(0,0,0,0.06)] z-50">
                  <div className="max-w-[1200px] mx-auto p-10 grid grid-cols-4 gap-8">
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Core Engine</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Terminal Automation</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">File System Access</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Bash & Shell Exec</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Subagent Swarm</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Code Generation</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">LLM Integration</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Ollama Local</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Context Awareness</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors font-medium flex items-center space-x-1"><span>See all</span> <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">DevOps & Cloud</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Nginx & SSL Setup</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Vercel & Railway</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">CI/CD Pipelines</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Ecosystem</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Next.js & React</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Node.js</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Firebase</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-[#F8F9FA] border-t border-gray-100 p-6">
                     <div className="max-w-[1200px] mx-auto flex items-center space-x-8 text-[14px]">
                       <span className="text-gray-500">Learn more:</span>
                       <a href="#" className="text-[#1a73e8] font-medium hover:underline flex items-center">IdeaAI Architecture <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                       <a href="#" className="text-[#1a73e8] font-medium hover:underline flex items-center">Developer Blog <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCTS & PLATFORMS */}
            <div 
              className="flex items-center h-[56px] cursor-pointer hover:text-[#1f1f1f] group"
              onMouseEnter={() => handleMouseEnter('products')}
            >
              <span>Products & platforms</span>
              <svg className={`ml-1 w-4 h-4 transform transition-transform ${activeMenu === 'products' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              
              {/* MEGA MENU: Products */}
              {activeMenu === 'products' && (
                <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-[0_12px_24px_rgba(0,0,0,0.06)] z-50">
                  <div className="max-w-[1200px] mx-auto p-10 grid grid-cols-4 gap-8">
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Platforms</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">IdeaAI Desktop</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">IdeaAI Cloud Hybrid</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Terminal CLI Tool</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Integrations</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">VS Code Extension</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Cursor Native Support</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Neovim Plugin</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Resources</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Documentation</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">API Reference</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Community Plugins</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COMPANY NEWS */}
            <div 
              className="flex items-center h-[56px] cursor-pointer hover:text-[#1f1f1f] group"
              onMouseEnter={() => handleMouseEnter('company')}
            >
              <span>Company news</span>
              <svg className={`ml-1 w-4 h-4 transform transition-transform ${activeMenu === 'company' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              
              {/* MEGA MENU: Company */}
              {activeMenu === 'company' && (
                <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-[0_12px_24px_rgba(0,0,0,0.06)] z-50">
                  <div className="max-w-[1200px] mx-auto p-10 grid grid-cols-4 gap-8">
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">About</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Our Mission</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Careers</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Contact Us</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[14px] text-gray-500 mb-6 uppercase tracking-wider font-medium">Media</h4>
                      <ul className="space-y-4">
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Press Kit</a></li>
                        <li><a href="#" className="text-[16px] text-[#1f1f1f] hover:text-[#1a73e8] transition-colors">Newsroom</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/changelog" className="flex items-center h-[56px] cursor-pointer hover:text-[#1f1f1f]" onMouseEnter={handleMouseLeave}>
              Changelog
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4 relative">
          <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-[#1f1f1f]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          
          {/* 3 Dots Dropdown */}
          <div className="relative group">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-[#1f1f1f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferences</div>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 hover:bg-[#F4F7FC] rounded-xl text-[15px] font-medium text-[#1f1f1f]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span>Global (English)</span>
              </a>
            </div>
          </div>

          <a href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer" className="bg-[#1a73e8] text-white px-6 py-2.5 rounded-full font-medium text-[15px] hover:bg-blue-700 transition-colors">
            Download
          </a>
        </div>
      </nav>
    </div>
  );
}
