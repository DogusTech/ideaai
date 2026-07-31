"use client"

import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function ParticleActionCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section className="w-full bg-white py-24 overflow-hidden" ref={containerRef}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Card: { } Shape */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex-1 rounded-[32px] bg-white border border-[#eaeaea] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[400px]"
        >
          {/* Particle Mask Background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity duration-700">
            {/* Using a large text as a mask for a particle background */}
            <div 
              className="text-[350px] font-light leading-none flex items-center justify-center w-full h-full text-transparent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%233b82f6'/%3E%3Ccircle cx='12' cy='12' r='1' fill='%238b5cf6'/%3E%3C/svg%3E")`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                animation: "panBg 20s linear infinite",
              }}
            >
              {`{ }`}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-sm font-medium text-[#737373] mb-4">Available at no charge</span>
            <h3 className="text-3xl font-medium text-[#171717] mb-8">
              For developers<br/>Achieve new heights
            </h3>
            <button className="px-6 py-3 bg-white border border-[#e5e5e5] rounded-full text-[#171717] font-medium hover:bg-[#f5f5f5] transition-all shadow-sm">
              Download
            </button>
          </div>
        </motion.div>

        {/* Right Card: Nodes Shape */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 rounded-[32px] bg-white border border-[#eaeaea] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[400px]"
        >
          {/* Particle Mask Background for Nodes */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity duration-700">
            <div 
              className="w-[80%] h-[80%] text-transparent relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='1.5' fill='%233b82f6'/%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%238b5cf6'/%3E%3C/svg%3E")`,
                backgroundClip: "content-box",
                WebkitBackgroundClip: "content-box",
                WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='black' stroke-width='40' stroke-dasharray='10 20'/%3E%3Ccircle cx='100' cy='100' r='30' fill='black'/%3E%3C/svg%3E")`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                animation: "panBg Reverse 25s linear infinite",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-sm font-medium text-[#737373] mb-4">Now Available!</span>
            <h3 className="text-3xl font-medium text-[#171717] mb-8">
              For organizations<br/>Level up your entire team
            </h3>
            <button className="px-6 py-3 bg-white border border-[#e5e5e5] rounded-full text-[#171717] font-medium hover:bg-[#f5f5f5] transition-all shadow-sm">
              Read More
            </button>
          </div>
        </motion.div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes panBg {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}} />
    </section>
  )
}
