"use client"

import React, { useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function DeveloperVideos() {
  const containerRef = useRef<HTMLDivElement>(null)
  
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

  const [activeVid, setActiveVid] = useState(0)

  useGSAP(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll("[data-youtube-video-section]")
    
    sections.forEach(n => {
      const r = n.querySelector("[data-video-wrapper]") as HTMLElement
      const a = n.querySelector("[data-cursor]") as HTMLElement
      if (!r || !a) return

      let s = false
      let c = 0
      let l = 0
      let u = false

      gsap.from(n, {
        scrollTrigger: {
          trigger: n,
          start: "top bottom",
          end: "top center",
          scrub: 1
        },
        scale: 0.8,
        opacity: 0.5,
        ease: "power2.out"
      })

      gsap.set(a, {
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0
      })

      const p = gsap.quickTo(a, "x", { duration: 0.35, ease: "power2.out" })
      const m = gsap.quickTo(a, "y", { duration: 0.35, ease: "power2.out" })

      const h = (e: number, t: number) => {
        const rect = r.getBoundingClientRect()
        return e >= rect.left && e <= rect.right && t >= rect.top && t <= rect.bottom
      }

      const g = (e: MouseEvent | {clientX: number, clientY: number}) => {
        if (!u && !s) {
          u = true
          r.style.cursor = "none"
          c = e.clientX
          l = e.clientY
          v(true)
          gsap.to(a, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
          })
        }
      }

      const _ = () => {
        if (u) {
          u = false
          r.style.cursor = ""
          gsap.to(a, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in"
          })
        }
      }

      const v = (t = false) => {
        if (s) return
        const rect = r.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          if (u) _()
          return
        }
        if (!(c >= rect.left - 50 && c <= rect.right + 50 && l >= rect.top - 50 && l <= rect.bottom + 50) && u) {
          _()
          return
        }
        const i = rect.width > 0 ? r.offsetWidth / rect.width : 1
        const o = rect.height > 0 ? r.offsetHeight / rect.height : 1
        const d = (c - rect.left) * i
        const f = (l - rect.top) * o

        if (t) {
          gsap.set(a, { x: d, y: f })
        } else {
          p(d)
          m(f)
        }
      }

      const y = (e: MouseEvent) => {
        c = e.clientX
        l = e.clientY
        if (!s) {
          if (!u && h(e.clientX, e.clientY)) {
            g(e)
          } else if (u) {
            v()
          }
        }
      }

      r.addEventListener("mousemove", y)
      r.addEventListener("mouseenter", g)
      r.addEventListener("mouseleave", _)
      window.addEventListener("scroll", () => {
        if (u) v()
      }, { passive: true })
      window.addEventListener("mousemove", y, { passive: true })
    })

  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <section data-youtube-video-section className="landing-use-case-section bg-white">
        <div className="grid-container">
          
          <div className="landing-use-case-header">
            <h2 className="heading-3">
              Built for developers for the agent-first era
            </h2>
            <p className="body max-w-lg mt-4 text-[#525252]">
              TogetLink IdeaAI is built for user trust, whether you're a professional developer working in a large enterprise codebase, a hobbyist vibe-coding in their spare time, or anyone in between.
            </p>
          </div>

          <div className="grid-row">
            <div className="grid-col col-md-8 col-sm-8 col-xs-4">
              <div data-video-wrapper className="slide-image">
                <div className="slide-image-wrapper">
                  <img src={videos[activeVid].img} alt="Video Thumbnail" className="list-image" />
                  <div className="slide-image-overlay">
                     <h3 className="heading-2">{videos[activeVid].role.split(' ').map((w,i)=><span key={i} className="block">{w}</span>)}</h3>
                  </div>
                </div>
                <div data-cursor className="video-control-button">
                  <span className="symbol">play_arrow</span>
                </div>
              </div>
            </div>

            <div className="grid-col col-md-4 col-sm-4 col-xs-4">
              <div className="slider-copy-wrapper">
                <div className="slider-copy" style={{ opacity: 1, visibility: 'visible', transform: 'none' }}>
                  <p className="body">{videos[activeVid].desc}</p>
                  <a href="#" className="arrow-link mt-4 font-medium text-[#1a73e8]">View case</a>
                </div>

                <div className="carousel-nav">
                  <button onClick={() => setActiveVid((v) => (v - 1 + videos.length) % videos.length)}>
                    <span className="symbol">chevron_left</span>
                  </button>
                  <button onClick={() => setActiveVid((v) => (v + 1) % videos.length)}>
                    <span className="symbol">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  )
}
