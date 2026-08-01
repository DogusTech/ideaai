import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"

export function AntigravityHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  
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

  return (
    <>
      <header
        className={`header-container ${isScrolled ? "scrolled" : ""} ${
          isHidden ? "hidden" : ""
        }`}
        style={{ background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent", borderBottom: isScrolled ? "1px solid var(--theme-surface-surface-container-highest)" : "none" }}
      >
        <div className="header-main-content">
          {/* Logo (Top Left, very subtle like in Antigravity) */}
          <div 
            className="flex items-center gap-1.5 cursor-pointer relative"
            onContextMenu={handleLogoContextMenu}
          >
            {/* Antigravity 'A' Logo SVG */}
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4L4 28H10L16 16L22 28H28L16 4Z" fill="url(#paint0_linear)"/>
              <defs>
                <linearGradient id="paint0_linear" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3279f9"/>
                  <stop offset="1" stopColor="#f84242"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-[Google Sans] text-[20px] text-gray-800 tracking-tight flex items-center">
              Google <span className="font-[Google Sans Flex] font-normal ml-1">Antigravity</span>
            </span>
          </div>

          {/* Right Actions - Just the hamburger menu matching the screenshot */}
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full bg-[#121317] text-white flex items-center justify-center hover:bg-[#2f3034] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
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
              Copy Logo as SVG
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              Copied!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
