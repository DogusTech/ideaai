"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, ChevronDown, Download, Github } from "lucide-react"

export function AntigravityHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  // Custom right-click logo state
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Add background when scrolled down
      if (currentScrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true)
        setActiveDropdown(null) // close dropdown on scroll
      } else {
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Handle right click on logo
  const handleLogoContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPos({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  // Close context menu on click anywhere
  useEffect(() => {
    const closeContextMenu = () => setShowContextMenu(false)
    window.addEventListener("click", closeContextMenu)
    return () => window.removeEventListener("click", closeContextMenu)
  }, [])

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  return (
    <>
      <header
        className={`header-container ${isScrolled ? "scrolled" : ""} ${
          isHidden ? "hidden" : ""
        }`}
      >
        <div className="header-main-content">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer relative"
            onContextMenu={handleLogoContextMenu}
          >
            <Bot className="w-7 h-7 text-blue-600" />
            <span className="font-[Google Sans Flex] font-semibold text-[20px] tracking-tight">
              IdeaAI
            </span>
          </div>

          {/* Nav Links */}
          <nav className="header-nav hidden lg:flex">
            <div className="relative">
              <button 
                className="nav-button group"
                onClick={() => toggleDropdown("products")}
              >
                Products
                <span className={`dropdown-icon ${activeDropdown === "products" ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              
              <AnimatePresence>
                {activeDropdown === "products" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-4 flex flex-col gap-2"
                  >
                    <a href="#" className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="font-medium text-gray-900">Agent Studio</div>
                      <div className="text-sm text-gray-500">Build custom AI agents visually</div>
                    </a>
                    <a href="#" className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div className="font-medium text-gray-900">Code Assistant</div>
                      <div className="text-sm text-gray-500">Pair programming in your IDE</div>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#" className="nav-button">Use Cases</a>
            <a href="#" className="nav-button">Pricing</a>
            <a href="#" className="nav-button">Blog</a>
            
            <div className="relative">
              <button 
                className="nav-button"
                onClick={() => toggleDropdown("resources")}
              >
                Resources
                <span className={`dropdown-icon ${activeDropdown === "resources" ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl p-2 flex flex-col"
                  >
                    <a href="#" className="p-2 hover:bg-gray-50 rounded-lg text-sm font-medium">Documentation</a>
                    <a href="#" className="p-2 hover:bg-gray-50 rounded-lg text-sm font-medium">API Reference</a>
                    <a href="#" className="p-2 hover:bg-gray-50 rounded-lg text-sm font-medium">Community Forum</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 hidden sm:block">
              <Github className="w-5 h-5" />
            </a>
            <Link href="https://www.togetlink.com/ai" className="button button-primary gap-2">
              <Download className="w-4 h-4" />
              Download
            </Link>
          </div>
        </div>
      </header>

      {/* Context Menu for Logo */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[9999] bg-white border border-gray-200 shadow-2xl rounded-lg py-1 w-48"
            style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          >
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              Copy Logo SVG
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              Download Brand Kit
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              About IdeaAI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
