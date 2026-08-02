"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function FeatureSplitSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll("[data-feature-explorer-section]")
    
    sections.forEach(n => {
      const r = n.querySelectorAll("[data-feature-item]")
      r.forEach(item => {
        const title = item.querySelector("[data-feature-title]")
        const desc = item.querySelector("[data-feature-desc]")
        
        gsap.set([title, desc], { opacity: 0, y: 24 })

        ScrollTrigger.create({
          trigger: item,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(title, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out"
            })
            gsap.to(desc, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.1
            })
          }
        })
      })
    })
  }, { scope: containerRef })

  const features = [
    {
      title: "Agent First",
      desc: "Antigravity is designed for the agent-first era. Everything from the CLI to the backend is optimized for autonomous coding agents.",
      icon: "smart_toy"
    },
    {
      title: "Powerful Sandboxing",
      desc: "Run agents securely in isolated environments with access to standard development tools and filesystems.",
      icon: "security"
    },
    {
      title: "Multi-Agent Collaboration",
      desc: "Spawn specialized subagents to tackle complex tasks concurrently, dramatically reducing development time.",
      icon: "hub"
    },
    {
      title: "Seamless CLI",
      desc: "The antigravity CLI brings the power of agentic development directly to your terminal.",
      icon: "terminal"
    }
  ]

  return (
    <div ref={containerRef}>
      <section data-feature-explorer-section className="agent-first-section bg-white">
        <div className="grid-container">
          <div className="grid-row">
            {features.map((feat, i) => (
              <div key={i} data-feature-item className="grid-col col-md-6 col-sm-4 col-xs-4 mb-16">
                <div className="feature-block flex gap-6">
                  <div className="feature-icon w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="symbol text-3xl">{feat.icon}</span>
                  </div>
                  <div className="feature-copy mt-2">
                    <h3 data-feature-title className="heading-4 mb-4 text-[#171717]">
                      {feat.title}
                    </h3>
                    <p data-feature-desc className="body text-[#525252]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
