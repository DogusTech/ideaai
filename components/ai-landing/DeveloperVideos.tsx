"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"

export function DeveloperVideos() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const videos = [
    {
      id: 1,
      role: "Full stack developer",
      desc: "Build production-ready applications with confidence with thoroughly designed artifacts and comprehensive verification tests.",
      img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80",
    },
    {
      id: 2,
      role: "Enterprise developer",
      desc: "Google Antigravity empowers the next era of enterprise builders.",
      img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=80",
    },
    {
      id: 3,
      role: "Frontend developer",
      desc: "Streamline UX development by leveraging browser-in-the-loop agents to automate repetitive tasks.",
      img: "https://images.unsplash.com/photo-1499996860827-d9b4f25ca1eb?w=800&q=80",
    }
  ]

  return (
    <section className="w-full bg-white py-24 overflow-hidden" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-medium text-[#171717] tracking-tight max-w-md"
          >
            Built for developers for the agent-first era
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#525252] leading-relaxed max-w-lg lg:pt-4"
          >
            TogetLink IdeaAI is built for user trust, whether you're a professional developer working in a large enterprise codebase, a hobbyist vibe-coding in their spare time, or anyone in between.
          </motion.p>
        </div>

        {/* Horizontal Carousel */}
        <div className="relative w-full">
          <div className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory">
            {videos.map((vid, i) => (
              <motion.div 
                key={vid.id}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[500px] flex-shrink-0 snap-center group cursor-pointer"
              >
                {/* Video/Image Container */}
                <div className="w-full aspect-[16/10] bg-[#f5f5f5] rounded-[32px] overflow-hidden relative mb-6">
                  <img src={vid.img} alt={vid.role} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  
                  {/* Floating Title */}
                  <div className="absolute top-6 left-6 text-white text-3xl font-medium drop-shadow-md">
                    {vid.role.split(' ').map((word, wIdx) => (
                      <div key={wIdx}>{word}</div>
                    ))}
                  </div>

                  {/* Play Button */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full text-[#171717] font-medium text-sm hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-current" />
                    Watch case
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between px-2">
                  <div>
                    <h3 className="text-[#171717] font-medium mb-2">{vid.role}</h3>
                    <p className="text-[#737373] text-sm max-w-sm">{vid.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#171717] font-medium text-sm hover:underline shrink-0">
                    View case <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Scrollbar Styles */}
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />
        </div>

      </div>
    </section>
  )
}
