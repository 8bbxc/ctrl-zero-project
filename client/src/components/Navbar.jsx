import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { AiOutlineHome, AiOutlineProject, AiOutlineInfoCircle, AiOutlinePhone, AiOutlineAppstore } from 'react-icons/ai'

// --- SVG Flags ---
const USFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover shadow-sm">
    <path fill="#bd3d44" d="M0 0h640v480H0"/>
    <path stroke="#fff" strokeWidth="37" d="M0 55.3h640M0 129h640M0 202.8h640M0 276.5h640M0 350.2h640m0 73.7h640"/>
    <path fill="#192f5d" d="M0 0h295.1v257.9H0z"/>
    <path fill="#fff" d="M37 19.3l5 15.3h16l-13 9.4 5 15.3-13-9.4-13 9.4 5-15.3-13-9.4h16zM86.2 19.3l5 15.3h16l-13 9.4 5 15.3-13-9.4-13 9.4 5-15.3-13-9.4h16zM135.3 19.3l5 15.3h16l-13 9.4 5 15.3-13-9.4-13 9.4 5-15.3-13-9.4h16zM37 222.4l5 15.3h16l-13 9.4 5 15.3-13-9.4-13 9.4 5-15.3-13-9.4h16zM86.2 222.4l5 15.3h16l-13 9.4 5 15.3-13-9.4-13 9.4 5-15.3-13-9.4h16z"/>
  </svg>
)

const PSFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-5 h-5 rounded-full object-cover border border-white/20 shadow-sm">
    <path fill="#000" d="M0 0h640v160H0z"/>
    <path fill="#fff" d="M0 160h640v160H0z"/>
    <path fill="#007a3d" d="M0 320h640v160H0z"/>
    <path fill="#ce1126" d="M0 0l213.3 240L0 480z"/>
  </svg>
)

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  
  const { scrollY } = useScroll()

  // Smart Scroll Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious()
    if (latest > previous && latest > 150) {
      setHidden(true)
      setOpen(false)
    } else {
      setHidden(false)
    }
  })

  function toggleLang() {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
  }

  const isEn = i18n.language === 'en'
  const dir = i18n.dir()
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: <AiOutlineHome /> },
    { path: '/projects', label: t('nav.projects'), icon: <AiOutlineProject /> },
    { path: '/services', label: t('nav.services') || 'Services', icon: <AiOutlineAppstore /> },
    { path: '/about', label: t('nav.about'), icon: <AiOutlineInfoCircle /> },
    { path: '/contact', label: t('nav.contact'), icon: <AiOutlinePhone /> },
  ]

  // Animation variants for mobile menu items
  const menuVariants = {
    closed: { opacity: 0, y: -20 },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  }

  return (
    <motion.nav
      initial={{ y: 0, x: "-50%", opacity: 1 }}
      animate={{ 
        y: hidden ? -100 : 0,
        x: "-50%",
        opacity: 1
      }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} // Apple-like easing
      className="fixed top-4 md:top-6 left-1/2 z-50 w-[95%] md:w-[90%] max-w-6xl"
    >
      {/* Container */}
      <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-4 py-2 md:px-6 md:py-2 flex items-center justify-between relative overflow-visible">
        
        {/* Logo Section - تكبير اللوغو وإضافة توهج */}
        <Link to="/" className="flex-shrink-0 relative group z-20 my-1">
          <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img 
            src="/images/navLogo/logo.png" 
            alt="CTRL ZERO" 
            // تم تعديل الأحجام هنا: h-12 للموبايل، h-16 للديسك توب
            className="h-12 md:h-16 w-auto object-contain transform transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" 
          />
        </Link>

        {/* Desktop Menu - تأثير الكبسولة المتحركة */}
        <div className={`hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((link) => {
            const active = isActive(link.path)
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`relative px-5 py-2.5 rounded-full transition-colors duration-300 flex items-center gap-2 group ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {/* الخلفية المتحركة (The Magic Pill) */}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-accent/80 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 text-lg">{link.icon}</span>
                <span className="relative z-10 text-sm font-bold tracking-wide">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 z-20">
          
          {/* Language Switcher - Enhanced Visibility */}
          <motion.button 
            onClick={toggleLang}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/30 to-accent/20 border-2 border-accent/60 hover:border-accent shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all overflow-hidden flex items-center gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10 transform transition-transform group-hover:scale-125"
            >
              {isEn ? <USFlag /> : <PSFlag />}
            </motion.span>
            <span className="relative z-10 text-sm font-bold text-accent group-hover:text-white transition-colors">{isEn ? 'ENGLISH' : 'العربية'}</span>
          </motion.button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            {open ? <span className="text-xl font-bold">✕</span> : <span className="text-xl">☰</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { opacity: 1, height: 'auto', transition: { staggerChildren: 0.07 } },
              closed: { opacity: 0, height: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
            className="absolute top-full left-0 right-0 mt-4 p-2 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl md:hidden overflow-hidden z-40"
          >
            <div className={`flex flex-col gap-1 p-2 ${dir === 'rtl' ? 'items-end' : 'items-start'}`}>
              {navLinks.map((link, i) => (
                <motion.div key={link.path} variants={menuVariants} custom={i} className="w-full">
                  <Link 
                    to={link.path} 
                    onClick={() => setOpen(false)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                      isActive(link.path) 
                        ? 'bg-gradient-to-r from-accent/20 to-transparent text-accent border border-accent/20' 
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-2xl ${isActive(link.path) ? 'text-accent drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : ''}`}>
                        {link.icon}
                    </span>
                    <span className="text-lg font-bold">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}