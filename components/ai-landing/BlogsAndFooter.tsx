"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function BlogsAndFooter() {
  const footerRef = useRef<HTMLDivElement>(null)
  const isFooterInView = useInView(footerRef, { once: true })

  const blogs = [
    {
      id: 1,
      title: "Gemini 3.6 Flash in Google Antigravity",
      date: "Jul 21, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
    },
    {
      id: 2,
      title: "Google Antigravity @ I/O 2026",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    },
    {
      id: 3,
      title: "Introducing Google Antigravity 2.0",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
    },
    {
      id: 4,
      title: "Google Antigravity Built an OS (and more)",
      date: "May 19, 2026",
      category: "Product",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
    }
  ]

  // Dark galaxy particles for footer
  const footerParticles = Array.from({ length: 150 }).map((_, i) => {
    const angle = i * 2.4;
    const radius = Math.pow(i, 0.7) * 15;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const size = Math.random() * 4 + 2;
    
    return (
      <div 
        key={i}
        className="absolute bg-blue-500 rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          opacity: Math.max(0.2, 1 - (radius / 600)),
          boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.5)"
        }}
      />
    );
  });

  return (
    <>
      {/* Latest Blogs Section */}
      <section className="w-full bg-white pt-12 pb-32">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-medium text-[#171717] tracking-tight">Latest Blogs</h2>
            <button className="text-[#171717] font-medium hover:underline">View blog</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="group cursor-pointer flex flex-col">
                <div className="w-full aspect-square rounded-[32px] overflow-hidden mb-6 bg-[#f5f5f5]">
                  <img 
                    src={blog.img} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-medium text-[#171717] leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-[#737373] mt-auto">
                  <span>{blog.date}</span>
                  <span>{blog.category}</span>
                </div>
                <div className="mt-4 text-[#171717] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read blog <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Giant Footer */}
      <footer className="w-full bg-white px-4 md:px-8 pb-4">
        <div 
          ref={footerRef}
          className="w-full bg-[#0a0a0a] rounded-[48px] pt-32 pb-12 px-8 md:px-16 lg:px-24 overflow-hidden relative flex flex-col"
        >
          {/* Dark Particle Galaxy Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {footerParticles}
            </motion.div>
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-1">
            
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-32">
              <div className="max-w-md">
                <h2 className="text-4xl md:text-5xl font-medium text-white mb-8 leading-tight">
                  Download TogetLink IdeaAI
                </h2>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-white text-[#171717] rounded-full font-medium text-sm hover:bg-gray-100 transition-colors">
                    Download for x64
                  </button>
                  <button className="px-6 py-3 bg-[#171717] text-white border border-[#333] rounded-full font-medium text-sm hover:bg-[#262626] transition-colors">
                    Download for ARM64
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Links */}
            <div className="flex flex-col md:flex-row justify-between items-start border-t border-[#333] pt-12 mb-24">
              <div className="text-2xl font-medium text-white mb-12 md:mb-0">
                Experience liftoff
              </div>
              
              <div className="flex gap-16 md:gap-32">
                <div className="flex flex-col gap-4">
                  <h4 className="text-[#a3a3a3] font-medium text-sm mb-2">Product</h4>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Download</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Product</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Docs</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Changelog</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Press</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Releases</a>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-[#a3a3a3] font-medium text-sm mb-2">Resources</h4>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Blog</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Pricing</a>
                  <a href="#" className="text-white hover:text-[#a3a3a3] transition-colors">Use Cases</a>
                </div>
              </div>
            </div>

          </div>

          {/* Giant Typography at Bottom */}
          <div className="relative z-10 w-full mt-auto flex items-end justify-between overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[#a3a3a3] font-medium mb-4 ml-2">Google Antigravity Clone</span>
              <h1 
                className="text-white font-bold leading-none tracking-tighter"
                style={{ fontSize: "clamp(4rem, 15vw, 20rem)" }}
              >
                IdeaAI
              </h1>
            </div>
            
            <div className="hidden md:flex gap-4 text-[#a3a3a3] text-sm pb-4 pr-4">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  )
}
