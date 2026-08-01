"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Monitor, Sparkles } from "lucide-react"

export function AntigravityHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll logic for the Video Card scaling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  })

  // Scale the video card from 0.85 to 1 as we scroll down
  // Adjusting the bounds to match the video more closely:
  // Starts slightly smaller and grows as the user scrolls.
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 0.7], [100, 0])



  const titleLine1 = "Experience liftoff with the next-gen".split(" ");
  const titleLine2 = "agent platform".split(" ");

  const [typingState, setTypingState] = React.useState<"flash" | "hidden" | "typing">("flash");

  React.useEffect(() => {
    const t1 = setTimeout(() => setTypingState("hidden"), 150);
    const t2 = setTimeout(() => setTypingState("typing"), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  const renderLine = (words: string[], startIndex: number) => {
    return words.map((word, idx) => (
      <motion.span 
        key={idx} 
        initial={{ opacity: 1 }}
        animate={{
          opacity: typingState === "flash" ? 1 : (typingState === "hidden" ? 0 : 1),
          y: typingState === "typing" ? 0 : (typingState === "hidden" ? 10 : 0)
        }}
        transition={
          typingState === "typing" 
            ? { duration: 0.15, ease: "easeOut", delay: (startIndex + idx) * 0.04 } 
            : { duration: 0 }
        }
        className="inline-block mr-[0.25em]"
      >
        {word}
      </motion.span>
    ))
  }

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Premium, majestic physics for mouse parallax (Not too heavy, not too fast)
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 0.8 })
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 0.8 })
  
  // Parallax move direction
  const bgX = useTransform(springX, [-1, 1], [50, -50])
  const bgY = useTransform(springY, [-1, 1], [50, -50])

  // Subtle 3D Tilt effect
  const rotateX = useTransform(springY, [-1, 1], [15, -15])
  const rotateY = useTransform(springX, [-1, 1], [-15, 15])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize -1 to 1
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  // Highly structured, subtle, small-particle Phyllotaxis spiral (Matching the original Antigravity look)
  const numParticles = 900;
  const particles = Array.from({ length: numParticles }).map((_, i) => {
    // Golden angle for perfect structured spiral
    const angle = i * 2.39996; 
    
    // Spread them out cleanly
    const radius = Math.pow(i, 0.6) * 22; 
    
    // Calculate exact X and Y from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const zDepth = Math.sin(i * 876) * 150; // Subtle Z-depth, not too chaotic
    
    // Pure Google Colors mapped cleanly to quadrants
    let angle2D = Math.atan2(y, x);
    if (angle2D < 0) angle2D += Math.PI * 2;
    
    let colorHex = '#4285F4'; 
    if (angle2D < Math.PI * 0.3) {
       colorHex = ['#4285F4', '#174EA6', '#9333EA'][i % 3]; // Blue/Purple
    } else if (angle2D < Math.PI * 0.8) {
       colorHex = ['#EA4335', '#C5221F', '#F9AB00'][i % 3]; // Red/Orange
    } else if (angle2D < Math.PI * 1.3) {
       colorHex = ['#EA4335', '#FBBC05', '#E37400'][i % 3]; // Red/Yellow
    } else if (angle2D < Math.PI * 1.7) {
       colorHex = ['#FBBC05', '#F9AB00', '#F29900'][i % 3]; // Yellow/Orange
    } else {
       colorHex = ['#34A853', '#1E8E3E', '#4285F4'][i % 3]; // Green/Blue
    }

    // Small, subtle dimensions
    const length = (Math.abs(Math.sin(i * 345)) * 3) + 3; // 3px to 6px dashes
    const thickness = (Math.abs(Math.cos(i * 123)) * 1) + 1.5; // 1.5px to 2.5px
    
    // Particles point strictly outwards in the spiral
    const rotationDeg = (angle * 180) / Math.PI;

    // Slight fade on the edges, very crisp in the middle
    const baseOpacity = Math.max(0.2, 1 - (radius / 1200));

    return (
      <motion.div 
        key={i}
        className="absolute rounded-full"
        animate={{ 
          opacity: [baseOpacity, baseOpacity * 0.4, baseOpacity],
        }}
        transition={{ 
          duration: Math.random() * 2 + 1.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: Math.random() * 2 
        }}
        style={{
          backgroundColor: colorHex,
          width: `${length}px`,
          height: `${thickness}px`,
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform: `translateZ(${zDepth}px) rotate(${rotationDeg}deg)`,
        }}
      />
    );
  });

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white flex flex-col items-center pt-32 pb-48 overflow-hidden min-h-[140vh] [perspective:1000px]"
    >
      {/* Abstract Particle Background */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: bgX, y: bgY, rotateX, rotateY }}
        className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-0"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/40 via-white/0 to-white/0 rounded-full blur-3xl absolute"
          />
          {/* Structured Particle Burst */}
          <div className="absolute w-full h-full">
            {particles}
          </div>
        </motion.div>
      </motion.div>

      <div className="z-10 flex flex-col items-center text-center px-4 w-full max-w-[1400px] mx-auto">
        
        {/* Logo area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 mb-10 text-[#171717] font-medium text-lg"
        >
          <Sparkles className="w-6 h-6 text-[#2563EB]" />
          <span>TogetLink <span className="font-semibold">IdeaAI</span></span>
        </motion.div>

        {/* Huge Title */}
        <motion.h1 
          className="text-[4rem] sm:text-[5rem] lg:text-[6rem] font-medium tracking-tight text-[#171717] leading-[1.05] mb-14 w-full flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center w-full">
            {renderLine(titleLine1, 0)}
          </div>
          <div className="flex flex-wrap justify-center mt-2 w-full">
            {renderLine(titleLine2, titleLine1.length)}
          </div>
        </motion.h1>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <button className="flex items-center gap-2 px-6 py-3.5 bg-[#171717] text-white rounded-full font-medium text-[15px] hover:bg-[#262626] transition-all shadow-md hover:shadow-lg">
            <Monitor className="w-4 h-4" strokeWidth={2.5} />
            Download for Windows
          </button>
          <button className="px-6 py-3.5 bg-[#f5f5f5] text-[#171717] border border-transparent hover:border-[#e5e5e5] rounded-full font-medium text-[15px] hover:bg-[#eaeaea] transition-all">
            Explore use cases
          </button>
        </motion.div>
      </div>

      {/* Scroll-scaling Video Card */}
      <motion.div 
        style={{ scale, opacity, y }}
        className="w-full max-w-6xl mx-auto px-4 z-20 sticky top-32"
      >
        <div className="w-full aspect-[16/9] bg-black rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-black/5 relative flex items-center justify-center">
          {/* Mock Video UI / Inner Content */}
          <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col">
            {/* Fake macOS Window Header */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            {/* Mock Editor Area */}
            <div className="flex-1 p-8 text-white/50 font-mono text-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto opacity-50" />
                <p>Interactive Video / Demo Area</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}
