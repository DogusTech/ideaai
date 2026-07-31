"use client"

import React from "react"
import { motion, Variants } from "framer-motion"

export function TypewriterStatement() {
  const text = "TogetLink IdeaAI is our agentic development platform, allowing anyone to build in the agent-first era."
  const words = text.split(" ")

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  }

  return (
    <section className="w-full bg-white py-32 px-4 md:px-12 lg:px-24 flex items-center justify-start min-h-[50vh]">
      <div className="max-w-5xl">
        <motion.h2 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium text-[#171717] tracking-tight leading-[1.1]"
        >
          {words.map((word, i) => (
            <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.3em]">
              {word}
            </motion.span>
          ))}
          <motion.span 
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block w-[4px] h-[1em] -mb-[0.1em] ml-1 bg-gradient-to-b from-blue-500 via-pink-500 to-amber-500"
          />
        </motion.h2>
      </div>
    </section>
  )
}
