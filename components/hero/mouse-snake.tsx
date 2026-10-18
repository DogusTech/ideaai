"use client"
import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

const baseIcons = [">", "/", "{", "}", "[", "]", '"', "-", "-", "-"]
// 3 kat daha uzun bir kuyruk oluşturmak için array'i çoğaltıyoruz (toplam 30 ikon)
const ICONS = Array(3).fill(baseIcons).flat()

export function MouseSnake() {
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const [isClient, setIsClient] = useState(false)
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    setIsClient(true)
    let idleTimer: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      // Fareye göre konumu ortalamak için hafif bir ofset veriyoruz (-10)
      mouseX.set(e.clientX - 10)
      mouseY.set(e.clientY - 10)
      setIsIdle(false)
      
      clearTimeout(idleTimer)
      // Mouse 150ms boyunca hareket etmezse "idle" (bekleme) moduna geç
      idleTimer = setTimeout(() => {
        setIsIdle(true)
      }, 150)
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(idleTimer)
    }
  }, [mouseX, mouseY])

  if (!isClient) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden hidden md:block">
      {ICONS.map((icon, index) => (
        <SnakeNode 
          key={index} 
          index={index} 
          total={ICONS.length}
          targetX={mouseX} 
          targetY={mouseY} 
          icon={icon} 
          isIdle={isIdle}
        />
      ))}
    </div>
  )
}

function SnakeNode({ index, total, targetX, targetY, icon, isIdle }: any) {
  // Yılan kuyruğu fizik parametreleri (index arttıkça gecikme artar)
  const springConfig = { 
    damping: 12 + index * 1.5, 
    stiffness: 300 - index * 6, 
    mass: 0.5 + index * 0.05 
  }
  
  const x = useSpring(targetX, springConfig)
  const y = useSpring(targetY, springConfig)

  // Mouse durduğunda ikonların etrafında saçılması (bir sarmal/orbit oluşturması) için matematiksel hesap
  const angle = (index / total) * Math.PI * 2 * 3; // 3 tur atan bir spiral
  const radius = isIdle ? 25 + (index * 1.5) : 0; // Mouse durunca 25px'den başlayarak dışa açılan yarıçap

  const scatterX = isIdle ? Math.cos(angle) * radius : 0;
  const scatterY = isIdle ? Math.sin(angle) * radius : 0;

  // Harekete bağlı opacity: En öndekiler daha parlak, kuyruktakiler sönük
  const opacity = isIdle ? 0.2 + (1 - index/total) * 0.3 : 0.5 + (1 - index/total) * 0.5;

  return (
    <motion.div
      style={{ 
        x, 
        y, 
        // Idle olduğunda ekstra bir translateX/Y uyguluyoruz ki etrafa saçılsınlar
        translateX: scatterX, 
        translateY: scatterY 
      }}
      animate={{ 
        opacity: opacity,
        rotate: isIdle ? angle * (180/Math.PI) : 0, // Saçıldıklarında açıyla dönsünler
        scale: isIdle ? 0.8 : 1
      }}
      transition={{ duration: 0.6, type: "spring" }}
      className="absolute left-0 top-0 text-xl font-mono text-[#3e6ae1]/80 font-bold drop-shadow-md"
    >
      {icon}
    </motion.div>
  )
}
