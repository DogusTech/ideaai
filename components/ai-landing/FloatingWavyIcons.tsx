"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { 
  Command, 
  Wand2, 
  AppWindow, 
  Folder, 
  CornerDownLeft, 
  Braces, 
  Code, 
  GitBranch, 
  Sparkles, 
  RefreshCcw, 
  PenLine, 
  LayoutGrid, 
  ArrowUp, 
  Terminal 
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function FloatingWavyIcons() {
  const sectionRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useGSAP(() => {
    const n = sectionRef.current
    if (!n) return
    const r = listRef.current
    if (!r) return
    const i = r.querySelectorAll<HTMLLIElement>("[data-bouncer]")
    const s = window.innerWidth / 1
    const c: number[] = []

    i.forEach((e) => {
      const t = e.getBoundingClientRect()
      const nRect = r.getBoundingClientRect()
      c.push(t.left - nRect.left + t.width / 2)
    })

    const l = Array.from(i).map((t) => gsap.quickSetter(t, "y", "px"))
    const u = { phase: 0 }
    
    const d = () => {
      const e = u.phase
      for (let t = 0; t < i.length; t++) {
        const n = ((c[t] + e) / s) * Math.PI * 2
        const rad = Math.sin(n) * 35
        l[t](rad)
      }
    }
    
    let f: gsap.core.Tween | null = null
    const p = () => {
      f = gsap.to(u, {
        phase: s,
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: d
      })
    }

    ScrollTrigger.create({
      trigger: n,
      start: "top 55%",
      onEnter: () => {
        f ? f.play() : p()
      }
    })

    i.forEach((t, index) => {
      const rad = c[index]
      const ini = Math.sin((rad / s) * Math.PI * 2) * 35
      gsap.set(t, {
        x: 0,
        y: ini,
        opacity: 1,
        force3D: true
      })
    })

    gsap.to(r, {
      x: -250,
      ease: "none",
      scrollTrigger: {
        trigger: n,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    ScrollTrigger.create({
      trigger: n,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => f?.play(),
      onLeave: () => f?.pause(),
      onEnterBack: () => f?.play(),
      onLeaveBack: () => f?.pause()
    })
  }, { scope: sectionRef })

  const icons = [
    { id: 1, Icon: Command },
    { id: 2, Icon: Wand2 },
    { id: 3, Icon: AppWindow },
    { id: 4, Icon: Folder },
    { id: 5, Icon: CornerDownLeft },
    { id: 6, Icon: Braces },
    { id: 7, Icon: Code },
    { id: 8, Icon: GitBranch },
    { id: 9, Icon: Sparkles },
    { id: 10, Icon: RefreshCcw },
    { id: 11, Icon: PenLine },
    { id: 12, Icon: LayoutGrid },
    { id: 13, Icon: ArrowUp },
    { id: 14, Icon: Terminal },
  ]

  return (
    <section ref={sectionRef} data-agent-first-section className="agent-first-section w-full py-20 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-center min-h-[200px]">
        <ul 
          ref={listRef} 
          data-bouncer-list 
          className="icon-list flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 w-full max-w-full overflow-visible pb-10 px-10"
        >
          {icons.map((item) => (
            <li 
              key={item.id} 
              data-bouncer 
              className="bouncer shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f9fafb] border border-[#f0f0f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#e5e5e5] transition-shadow bg-white/50 backdrop-blur-sm"
            >
              <item.Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#171717] stroke-[1.5]" />
            </li>
          ))}
          {/* Include user's specific icons from URLs */}
          <li data-bouncer className="bouncer shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f9fafb] border border-[#f0f0f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#e5e5e5] transition-shadow bg-white/50 backdrop-blur-sm">
            <img src="https://antigravity.google/assets/textures/icons/cube.png" alt="Cube" className="w-8 h-8" />
          </li>
          <li data-bouncer className="bouncer shrink-0 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f9fafb] border border-[#f0f0f0] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#e5e5e5] transition-shadow bg-white/50 backdrop-blur-sm">
            <img src="https://antigravity.google/assets/textures/icons/individual.png" alt="Individual" className="w-8 h-8" />
          </li>
        </ul>
      </div>
    </section>
  )
}
