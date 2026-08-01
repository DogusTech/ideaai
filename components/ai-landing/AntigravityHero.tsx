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

  // Mouse Parallax for Background
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Ultra-snappy, lightning-fast physics for mouse parallax
  const springX = useSpring(mouseX, { damping: 60, stiffness: 1200, mass: 0.5 })
  const springY = useSpring(mouseY, { damping: 60, stiffness: 1200, mass: 0.5 })
  
  // Parallax move direction
  const bgX = useTransform(springX, [-1, 1], [80, -80])
  const bgY = useTransform(springY, [-1, 1], [80, -80])

  // Stronger 3D Tilt effect
  const rotateX = useTransform(springY, [-1, 1], [30, -30])
  const rotateY = useTransform(springX, [-1, 1], [-30, 30])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    // Normalize -1 to 1
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  // Multi-arm Spiral (Galaxy Formation) for highly controlled, row-based particles
  const numParticles = 800;
  const numArms = 24; // Number of spiral arms (creates the "sıra sıra" look)

  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const armIndex = i % numArms;
    const distanceFactor = Math.floor(i / numArms); 
    
    // Calculate radius (distance from center)
    const radius = Math.pow(distanceFactor, 1.05) * 14 + 60; // Leave center slightly empty, spread outward
    
    // Twist creates the spiral curve
    const twist = distanceFactor * 0.12; 
    const angle = (armIndex * (Math.PI * 2) / numArms) + twist;
    
    // Calculate exact X and Y from center
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Dimensions
    const length = Math.abs(Math.sin(i * 345)) * 6 + 6; // 6px to 12px
    const thickness = Math.abs(Math.cos(i * 123)) * 1.5 + 2; // 2px to 3.5px
    
    // Fast Z-depth
    const zDepth = Math.sin(i * 876) * 500; // Deep 3D space


    // Determine exact colors based on quadrant/angle to match the Antigravity screenshot
    let normalizedAngle = angle % (Math.PI * 2);
    if (normalizedAngle < 0) normalizedAngle += Math.PI * 2;
    
    let colorHex = '#4285F4'; // Google Blue
    if (normalizedAngle < Math.PI * 0.3) {
       colorHex = ['#4285F4', '#8b5cf6', '#6366f1'][i % 3];
    } else if (normalizedAngle < Math.PI * 0.7) {
       colorHex = ['#d946ef', '#ec4899', '#EA4335'][i % 3];
    } else if (normalizedAngle < Math.PI * 1.2) {
       colorHex = ['#EA4335', '#f97316', '#ef4444'][i % 3];
    } else if (normalizedAngle < Math.PI * 1.6) {
       colorHex = ['#FBBC05', '#f59e0b', '#f97316'][i % 3];
    } else {
       colorHex = ['#34A853', '#10b981', '#4285F4'][i % 3];
    }

    const rotationDeg = (angle * 180) / Math.PI;
    const baseOpacity = Math.max(0.15, 1 - (radius / 1000));

    return (
      <motion.div 
        key={i}
        className="absolute rounded-full"
        animate={{ 
          opacity: [baseOpacity, baseOpacity * 0.3, baseOpacity],
        }}
        transition={{ 
          duration: Math.random() * 2 + 1, 
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
          // Include translateZ for the 3D depth effect during mouse parallax
          transform: `translateZ(${zDepth}px) rotate(${rotationDeg}deg)`,
        }}
      />
    );
  });

  // Text for typewriter animation
  const titleText = "Experience liftoff with the next-gen agent platform";
  const titleWords = titleText.split(" ");

  // AI Glitch/Load state
  const [typingState, setTypingState] = React.useState<"flash" | "hidden" | "typing">("flash");

  React.useEffect(() => {
    // Show full text for 150ms
    const t1 = setTimeout(() => setTypingState("hidden"), 150);
    // Start typing at 300ms
    const t2 = setTimeout(() => setTypingState("typing"), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); }
  }, []);

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white flex flex-col items-center pt-32 pb-48 overflow-hidden min-h-[150vh] [perspective:800px]"
    >
      {/* Abstract Particle Background with 3D Mouse Parallax & Continuous Rotation */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: bgX, y: bgY, rotateX, rotateY }}
        className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-0"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1000px] h-[1000px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white/0 to-white/0 rounded-full blur-3xl absolute"
          />
          {/* Radial Particle Burst */}
          <div className="absolute w-full h-full">
            {particles}
          </div>
        </motion.div>
      </motion.div>

      <div className="z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        
        {/* Logo area */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 mb-8 text-[#171717] font-medium text-lg"
        >
          <Sparkles className="w-6 h-6 text-blue-500" />
          <span>TogetLink <span className="font-semibold">IdeaAI</span></span>
        </motion.div>

        {/* Huge Title (Flash -> Hide -> Typewriter Effect) */}
        <motion.h1 
          className="text-6xl sm:text-7xl md:text-[5.5rem] font-medium tracking-tight text-[#171717] leading-[1.05] mb-12 max-w-4xl"
        >
          {titleWords.map((word, idx) => (
            <motion.span 
              key={idx} 
              initial={{ opacity: 1 }} // Start fully visible for the flash
              animate={{
                opacity: typingState === "flash" ? 1 : (typingState === "hidden" ? 0 : 1),
                y: typingState === "typing" ? 0 : (typingState === "hidden" ? 10 : 0)
              }}
              transition={
                typingState === "typing" 
                  ? { duration: 0.2, ease: "easeOut", delay: idx * 0.05 } 
                  : { duration: 0 }
              }
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
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
