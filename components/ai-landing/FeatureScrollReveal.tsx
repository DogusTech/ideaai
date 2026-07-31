"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Bot, Zap, Shield, Workflow } from "lucide-react"

export function FeatureScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Example of Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // We can use scrollYProgress to scale or morph background elements
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="py-32 px-4 bg-white relative overflow-hidden">
      
      {/* Background Morphing Blob */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[#171717] mb-6">Her Senaryoda Yanınızda</h2>
          <p className="text-xl text-[#525252] max-w-2xl mx-auto">
            Sadece bir sohbet botu değil; sistemlerinize entegre, bağlamı anlayan ve sürekli öğrenen bir çalışma arkadaşı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <FeatureCard 
            icon={<Bot className="w-8 h-8 text-blue-600" />}
            title="Bağlamsal Zeka"
            description="Geçmiş konuşmalarınızı, proje dosyalarınızı ve şirket içi terimlerinizi hafızasında tutarak size en doğru yanıtı verir."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-amber-500" />}
            title="Işık Hızında Üretim"
            description="Saniyeler içinde pazarlama metinleri, kod blokları veya veri analiz raporları oluşturun. Zamanınızı stratejiye ayırın."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Workflow className="w-8 h-8 text-indigo-500" />}
            title="Kesintisiz İş Akışı"
            description="IdeaAI, TogetLink platformunun tam kalbine entegre edilmiştir. Araçlar arası geçiş yapmadan tüm işlerinizi tek ekranda çözün."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-emerald-500" />}
            title="Kurumsal Gizlilik"
            description="Verileriniz asla genel yapay zeka modellerini eğitmek için kullanılmaz. Ekibinizin bilgileri tamamen size ait ve güvendedir."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="p-8 rounded-[24px] bg-white border border-[#e5e5e5] shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-[16px] bg-[#f9fafb] border border-[#e5e5e5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-[#171717] mb-4">{title}</h3>
      <p className="text-[#525252] leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
