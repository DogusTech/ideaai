"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { PlayCircle, TrendingUp, Search, Code2, Megaphone } from "lucide-react"

export function DepartmentVideoGrid() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section className="py-24 px-4 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#171717] mb-4">
            Tek Üyelik, Tüm Şirkete Hizmet
          </h2>
          <p className="text-[#525252] text-lg max-w-2xl mx-auto">
            IdeaAI'nin farklı departmanlarda nasıl mucizeler yarattığını izleyin.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <VideoCard 
            title="Pazarlama Ekibi" 
            icon={<Megaphone className="w-5 h-5 text-amber-500" />}
            color="hover:shadow-amber-500/20"
            border="group-hover:border-amber-200"
          />
          <VideoCard 
            title="Growth Ekibi" 
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            color="hover:shadow-emerald-500/20"
            border="group-hover:border-emerald-200"
          />
          <VideoCard 
            title="SEO Ekibi" 
            icon={<Search className="w-5 h-5 text-blue-500" />}
            color="hover:shadow-blue-500/20"
            border="group-hover:border-blue-200"
          />
          <VideoCard 
            title="Yazılım Ekibi" 
            icon={<Code2 className="w-5 h-5 text-purple-500" />}
            color="hover:shadow-purple-500/20"
            border="group-hover:border-purple-200"
          />
        </motion.div>
      </div>
    </section>
  )
}

function VideoCard({ title, icon, color, border }: { title: string, icon: React.ReactNode, color: string, border: string }) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  }

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className={`group relative bg-white rounded-2xl p-4 border border-[#e5e5e5] shadow-sm transition-all duration-300 ${color} ${border}`}
    >
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="p-2 bg-[#f9fafb] rounded-lg border border-[#e5e5e5]">
          {icon}
        </div>
        <h3 className="font-semibold text-[#171717]">{title}</h3>
      </div>
      
      {/* Video Placeholder Area */}
      <div className="relative w-full aspect-video bg-[#f5f5f5] rounded-xl overflow-hidden border border-[#e5e5e5] flex items-center justify-center group-hover:bg-[#f0f0f0] transition-colors">
        <PlayCircle className="w-12 h-12 text-[#a3a3a3] group-hover:text-[#525252] transition-colors" strokeWidth={1.5} />
        
        {/* Glow effect that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="mt-4 px-2 text-sm text-[#737373] flex justify-between items-center">
        <span>Demo İzle</span>
        <span className="text-xs font-medium px-2 py-1 bg-[#f5f5f5] rounded-full">Yakında</span>
      </div>
    </motion.div>
  )
}
