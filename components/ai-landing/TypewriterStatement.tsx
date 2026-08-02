"use client"

import React, { useRef, useMemo } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function TypewriterStatement() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const text = "TogetLink IdeaAI is our agentic development platform, allowing anyone to build in the agent-first era."
  
  // We'll split the text into words and chars manually to avoid needing the premium SplitText plugin
  const words = useMemo(() => text.split(" "), [text])

  useGSAP(() => {
    if (!containerRef.current) return
    const cursor = containerRef.current.querySelector("[data-cursor-container]") as HTMLElement
    const chars = containerRef.current.querySelectorAll(".char")
    
    gsap.set(cursor, { opacity: 0 })
    gsap.set(chars, { opacity: 0 })

    const updateCursor = (charElem: HTMLElement) => {
      if (charElem && charElem.offsetParent) {
        cursor.style.setProperty("--cursor-pos-x", `${charElem.offsetParent.offsetLeft + charElem.offsetLeft + charElem.offsetWidth + 2}px`)
        cursor.style.setProperty("--cursor-pos-y", `${charElem.offsetParent.offsetTop + charElem.offsetTop}px`)
      }
    }

    // Initialize cursor position on first char
    if (chars[0]) {
      updateCursor(chars[0] as HTMLElement)
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true
      }
    })

    tl.set(cursor, { opacity: 1 })
    tl.to(chars, {
      opacity: 1,
      duration: 0.01,
      stagger: {
        each: 0.02,
        onStart: function() {
          const target = this.targets()[0] as HTMLElement
          updateCursor(target)
        }
      },
      ease: "power2.out"
    })
    
    // Cursor persists indefinitely as blinking, just like standard typewriter
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)"
    })

  }, { scope: containerRef })

  return (
    <section className="w-full bg-white py-20 px-4 md:px-12 lg:px-24 flex items-center justify-start min-h-[50vh]">
      <div 
        ref={containerRef} 
        data-text-container 
        className="max-w-5xl relative"
        style={{ position: "relative" }}
      >
        <h2 
          data-typed-header 
          data-cursor-persists="true"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-medium text-[#171717] tracking-tight leading-[1.1] typed-content relative inline-block"
        >
          {words.map((word, wIdx) => (
            <span key={wIdx} className="word inline-block">
              {word.split("").map((char, cIdx) => (
                <span key={cIdx} className="char opacity-0 inline-block">{char}</span>
              ))}
              <span className="char opacity-0 inline-block">&nbsp;</span>
            </span>
          ))}
          {/* Custom Cursor Container */}
          <span 
            data-cursor-container 
            className="absolute left-0 top-0 h-[1em] w-[4px] bg-gradient-to-b from-blue-500 via-pink-500 to-amber-500"
            style={{
              transform: "translate(var(--cursor-pos-x, 0), var(--cursor-pos-y, 0))",
              transition: "transform 0.05s linear"
            }}
          />
        </h2>
      </div>
    </section>
  )
}
