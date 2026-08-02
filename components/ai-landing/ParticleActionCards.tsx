"use client"

import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function ParticleActionCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll(".solution-card-wrapper")
    
    gsap.set(cards, { opacity: 0, y: 30 })

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        })
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <section className="try-solutions-section bg-white py-24">
        <div className="grid-container">
          <div className="grid-row">
            
            {/* Card 1 */}
            <div className="grid-col col-md-6 col-sm-4 col-xs-4 solution-card-wrapper mb-8">
              <div className="rounded-[32px] bg-[#f8f9fc] border border-[#e1e6ec] p-12 flex flex-col items-center text-center h-full relative overflow-hidden group">
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity duration-700">
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

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-medium text-[#737373] mb-4">Available at no charge</span>
                  <h3 className="heading-3 mb-8 text-[#171717]">
                    For developers<br/>Achieve new heights
                  </h3>
                  <button className="button button-primary">
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="grid-col col-md-6 col-sm-4 col-xs-4 solution-card-wrapper mb-8">
              <div className="rounded-[32px] bg-[#f8f9fc] border border-[#e1e6ec] p-12 flex flex-col items-center text-center h-full relative overflow-hidden group">
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

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <span className="text-sm font-medium text-[#737373] mb-4">Now Available!</span>
                  <h3 className="heading-3 mb-8 text-[#171717]">
                    For organizations<br/>Level up your entire team
                  </h3>
                  <button className="button button-primary">
                    Read More
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes panBg {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
          }
        `}} />
      </section>
    </div>
  )
}
