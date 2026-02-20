import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight, FaGithub, FaStar, FaStarHalfAlt, FaCalendarAlt, FaFire, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// --- Create Enhanced Gradient Backgrounds ---
const createGradientImage = (colorHex) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colorHex};stop-opacity:0.9"/><stop offset="50%" style="stop-color:${colorHex};stop-opacity:0.5"/><stop offset="100%" style="stop-color:${colorHex};stop-opacity:0.2"/></linearGradient><radialGradient id="glow"><stop offset="0%" style="stop-color:white;stop-opacity:0.1"/><stop offset="100%" style="stop-color:${colorHex};stop-opacity:0.2"/></radialGradient><filter id="blur"><feGaussianBlur in="SourceGraphic" stdDeviation="3"/></filter></defs><rect width="800" height="600" fill="${colorHex}10"/><rect width="800" height="600" fill="url(#grad)"/><circle cx="100" cy="100" r="150" fill="url(#glow)"/><circle cx="700" cy="500" r="200" fill="url(#glow)"/><path d="M 0 200 Q 200 100 400 200 T 800 200" stroke="${colorHex}" stroke-width="2" fill="none" opacity="0.2"/><path d="M 0 400 Q 200 300 400 400 T 800 400" stroke="${colorHex}" stroke-width="2" fill="none" opacity="0.15"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Premium Sector Colors with Enhanced Gradients
const SECTOR_COLORS = {
  Medical: { 
    hex: '#ef4444', 
    gradient: 'from-red-700 via-rose-600 to-pink-500',
    darkGradient: 'from-red-950 to-rose-900',
    glow: 'rgba(239, 68, 68, 0.5)',
    accent: '#fca5a5'
  },
  'E-Commerce': { 
    hex: '#22c55e', 
    gradient: 'from-green-700 via-emerald-600 to-teal-500',
    darkGradient: 'from-green-950 to-emerald-900',
    glow: 'rgba(34, 197, 94, 0.5)',
    accent: '#86efac'
  },
  Restaurant: { 
    hex: '#f97316', 
    gradient: 'from-orange-700 via-orange-600 to-amber-500',
    darkGradient: 'from-orange-950 to-amber-900',
    glow: 'rgba(249, 115, 22, 0.5)',
    accent: '#fed7aa'
  },
  Corporate: { 
    hex: '#2563eb', 
    gradient: 'from-blue-700 via-blue-600 to-cyan-500',
    darkGradient: 'from-blue-950 to-cyan-900',
    glow: 'rgba(37, 99, 235, 0.5)',
    accent: '#93c5fd'
  },
  Education: { 
    hex: '#a855f7', 
    gradient: 'from-purple-700 via-purple-600 to-violet-500',
    darkGradient: 'from-purple-950 to-violet-900',
    glow: 'rgba(168, 85, 247, 0.5)',
    accent: '#d8b4fe'
  },
  'Real Estate': { 
    hex: '#f59e0b', 
    gradient: 'from-amber-700 via-amber-600 to-yellow-500',
    darkGradient: 'from-amber-950 to-yellow-900',
    glow: 'rgba(245, 158, 11, 0.5)',
    accent: '#fcd34d'
  }
}

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const MotionLink = motion(Link)
  const MotionA = motion.a

  const title = isArabic ? (project.titleAr || project.title) : project.title
  const desc = isArabic ? (project.descriptionAr || project.description) : project.description
  const sector = project.category || project.sector || 'Corporate'
  const colors = SECTOR_COLORS[sector] || SECTOR_COLORS.Corporate
  const image = project.image || createGradientImage(colors.hex)

  const isFeatured = project.slug && project.slug.includes('mern-hotel')

  if (isFeatured) {
    const titleFeatured = isArabic ? (project.titleAr || project.title) : project.title
    const descFeatured = isArabic ? (project.descriptionAr || project.description) : project.description
    const dateFeatured = project.createdAt
      ? new Date(project.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' })
      : ''

    return (
      <motion.article 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full relative group"
      >
        {/* Premium Glow Background */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-amber-600/40 via-orange-500/30 to-yellow-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-gradient-to-b from-slate-900/60 to-slate-950/90 backdrop-blur-xl">
          
          {/* Image Section with Advanced Effects */}
          <div className="relative h-48 sm:h-56 md:h-72 lg:h-80 overflow-hidden group/img">
            {/* Animated Background Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/40"
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Image with Zoom Effect */}
            <motion.img 
              src={image} 
              alt={titleFeatured} 
              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
            />
            
            {/* Amber Top Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-amber-600/30 via-transparent to-transparent"
              whileHover={{ opacity: 0.5 }}
            />
            
            {/* Moving Light Effect */}
            <motion.div
              className="absolute -inset-full w-full h-full"
              animate={{ 
                backgroundPosition: ['200% 0%', '-200% 0%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                backgroundSize: '200% 100%',
              }}
            />
            
            {/* Category Badge with Glow */}
            <motion.div 
              className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-lg border border-amber-400/30 flex items-center gap-2 z-10"
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.15)',
                color: '#fcd34d',
                boxShadow: '0 0 20px rgba(217, 119, 6, 0.3)',
              }}
              whileHover={{ scale: 1.1 }}
              animate={{ 
                boxShadow: ['0 0 20px rgba(217, 119, 6, 0.3)', '0 0 30px rgba(217, 119, 6, 0.6)', '0 0 20px rgba(217, 119, 6, 0.3)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                🏨
              </motion.span>
              <span>{project.category || t('sectors.all')}</span>
            </motion.div>
            
            {/* Date Badge */}
            {dateFeatured && (
              <motion.div 
                className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 text-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/10 z-10"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  y: [0, -2, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <FaCalendarAlt size={12} />
                </motion.div>
                <span>{dateFeatured}</span>
              </motion.div>
            )}
            
            {/* Star Rating with Animation */}
            <motion.div 
              className="absolute left-3 sm:left-4 bottom-16 sm:bottom-20 flex items-center gap-0.5 sm:gap-1 z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {[0,1,2,3,4].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -3, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    delay: i * 0.1,
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  style={{
                    textShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
                    filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))',
                  }}
                >
                  {i < 4
                    ? <FaStar className="text-yellow-300 text-xs sm:text-lg" />
                    : <FaStarHalfAlt className="text-yellow-300 text-xs sm:text-lg" />
                  }
                </motion.div>
              ))}
            </motion.div>
            
            {/* Premium Badge */}
            <motion.div 
              className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                boxShadow: '0 0 20px rgba(251, 146, 60, 0.6)',
              }}
            >
              ⭐ {isArabic ? 'مميز' : 'Premium'}
            </motion.div>
          </div>

          {/* Content Section */}
          <motion.div 
            className="px-4 sm:px-5 py-5 sm:py-6 bg-gradient-to-b from-slate-900/40 to-slate-950/80 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Background Grid Animation */}
            <motion.div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
              animate={{ 
                backgroundPosition: ['0px 0px', '40px 40px'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative z-10">
              {/* Title with Glow */}
              <motion.h3 
                className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 line-clamp-2 tracking-tight"
                animate={{ 
                  textShadow: ['0 0 10px rgba(251, 146, 60, 0.3)', '0 0 20px rgba(251, 146, 60, 0.6)', '0 0 10px rgba(251, 146, 60, 0.3)'],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {titleFeatured}
              </motion.h3>
              
              {/* Animated Underline */}
              <motion.div 
                className="h-1 w-8 sm:w-10 sm:w-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-2 sm:mb-3"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{ transformOrigin: 'left' }}
                animate={{ 
                  boxShadow: ['0 0 10px rgba(251, 146, 60, 0.5)', '0 0 20px rgba(251, 146, 60, 0.8)', '0 0 10px rgba(251, 146, 60, 0.5)'],
                }}
              />
              
              {/* Description */}
              <motion.p 
                className="text-slate-300 text-xs sm:text-sm max-w-3xl mb-3 sm:mb-4 line-clamp-2 leading-relaxed"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {descFeatured}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  {project.link && (
                    <motion.a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-2 rounded-lg sm:rounded-full font-bold text-xs sm:text-sm whitespace-nowrap border border-amber-300/50 relative overflow-hidden group/btn"
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(251, 146, 60, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [300, -300] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <FaExternalLinkAlt size={12} />
                      <span className="relative">{t('projects.liveDemo')}</span>
                    </motion.a>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link 
                      to={`/projects/${project.slug || project.id}`} 
                      state={{ project }} 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg sm:rounded-full border-2 border-amber-400/50 text-amber-400 text-xs sm:text-sm whitespace-nowrap font-semibold hover:border-amber-400 hover:bg-amber-400/10 transition-all duration-300"
                    >
                      {t('projects.details')}
                    </Link>
                  </motion.div>
                </div>
                
                {/* Tags */}
                <motion.div 
                  className="text-xs sm:text-sm text-amber-300/70 hidden md:flex flex-wrap gap-1"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {project.tags?.slice(0,3).map((tag, i) => (
                    <motion.span 
                      key={i}
                      className="px-2 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 font-mono"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.article>
    )
  }

  const handleMouseMove = (e) => {
    if (!isHovered) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative w-full h-auto min-h-[600px] sm:min-h-[700px] md:min-h-[750px]"
    >
      {/* Multi-Layer Glow System */}
      <motion.div
        animate={{ 
          opacity: isHovered ? 1 : 0.3,
          scale: isHovered ? 1.1 : 0.9
        }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 400px 300px at ${mousePos.x}px ${mousePos.y}px, ${colors.glow}, transparent 70%)`,
          zIndex: -1
        }}
      />

      <motion.div
        animate={{ opacity: isHovered ? 0.8 : 0.2 }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colors.hex}30 0%, transparent 100%)`,
          zIndex: -1
        }}
      />

      {/* Main Card Container */}
      <div 
        className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-2xl border-2 transition-all duration-500 flex flex-col"
        style={{
          borderColor: isHovered ? colors.hex : 'rgba(255,255,255,0.1)',
          background: `linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(20,20,35,0.98) 100%)`
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Animated Grid Background */}
        <motion.div
          animate={{ 
            backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
            opacity: isHovered ? 1 : 0.5
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(90deg, ${colors.hex} 0.5px, transparent 0.5px), linear-gradient(0deg, ${colors.hex} 0.5px, transparent 0.5px)`,
            backgroundSize: '40px 40px',
            animation: isHovered ? 'none' : 'none'
          }}
        />

        <div className="relative z-10 h-full flex flex-col">

          {/* Image Section - Premium with Overlay Effects */}
          <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 group/img">
            
            {/* Image Container with Zoom */}
            <motion.div
              animate={{ scale: isHovered ? 1.15 : 1, rotate: isHovered ? 1 : 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover filter"
              />
            </motion.div>

            {/* Gradient Overlay - Power */}
            <div 
              className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-40 mix-blend-overlay transition-opacity duration-500`}
              style={{ opacity: isHovered ? 0.5 : 0.4 }}
            />

            {/* Dark Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            {/* Moving Light Effect */}
            {isHovered && (
              <motion.div
                animate={{ 
                  x: mousePos.x,
                  y: mousePos.y,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute w-96 h-96 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${colors.hex}40 0%, transparent 70%)`,
                  left: '-192px',
                  top: '-192px'
                }}
              />
            )}

            {/* Sector Badge - Power Up */}
            <motion.div 
              animate={{ 
                y: isHovered ? -6 : 0,
                scale: isHovered ? 1.15 : 1
              }}
              className="absolute top-4 left-4 sm:top-5 sm:left-5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider backdrop-blur-2xl border-2.5 z-20 cursor-default flex items-center gap-4"
              style={{
                backgroundColor: `${colors.hex}40`,
                borderColor: colors.hex,
                color: colors.hex,
                boxShadow: `0 0 40px ${colors.hex}80, 0 0 60px ${colors.hex}60, inset 0 0 30px ${colors.hex}30`
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 0.9, 1.4, 1],
                  rotate: [0, 25, -25, 15, 0],
                  y: [0, -4, 3, -3, 0]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex-shrink-0"
                style={{
                  textShadow: `0 0 4px ${colors.hex}, 0 0 10px ${colors.hex}, 0 0 20px ${colors.hex}, 0 0 30px ${colors.hex}`,
                  filter: `brightness(1.3) drop-shadow(0 0 2px ${colors.hex}) drop-shadow(0 0 6px ${colors.hex}) drop-shadow(0 0 12px ${colors.hex}) drop-shadow(0 0 20px ${colors.hex})`
                }}
              >
                <FaFire size={22} strokeWidth={0.5} />
              </motion.div>
              {sector}
            </motion.div>

            {/* Date Badge */}
            {project.createdAt && (
              <motion.div 
                animate={{ y: isHovered ? -6 : 0 }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 px-5 sm:px-6 py-2.5 sm:py-3 bg-black/90 backdrop-blur-2xl text-xs sm:text-sm text-white rounded-full border-1.5 border-white/30 z-20 flex items-center gap-3 font-semibold hover:border-white/60 transition-all duration-300 shadow-lg"
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.25, 1]
                  }}
                  transition={{ rotate: { duration: 2.5, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.8, repeat: Infinity, repeatDelay: 0.4 } }}
                  className="text-sm"
                  style={{
                    textShadow: '0 0 4px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.3)',
                    filter: 'brightness(1.4) drop-shadow(0 0 2px rgba(255,255,255,0.6)) drop-shadow(0 0 8px rgba(255,255,255,0.4)) drop-shadow(0 0 16px rgba(255,255,255,0.2))'
                  }}
                >
                  <FaCalendarAlt />
                </motion.div>
                {new Date(project.createdAt).toLocaleDateString(
                  isArabic ? 'ar-EG' : 'en-US',
                  { year: 'numeric', month: 'short' }
                )}
              </motion.div>
            )}

            {/* Star Rating */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              className="absolute bottom-5 left-5 flex items-center gap-2 z-20"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: isHovered ? [1, 1.6, 0.9, 1.5, 1] : [1, 1.3, 1],
                    rotate: isHovered ? [0, 25, -25, 15, 0] : [0, 12, 0],
                    y: isHovered ? [0, -5, 3, -3, 0] : 0
                  }}
                  transition={{ 
                    delay: i * 0.12, 
                    duration: isHovered ? 0.8 : 1.6,
                    repeat: Infinity,
                    repeatDelay: isHovered ? 0.2 : 0.6
                  }}
                  className="relative"
                  style={i < 4 ? {
                    textShadow: '0 0 4px rgba(251, 146, 60, 0.9), 0 0 10px rgba(251, 146, 60, 0.8), 0 0 20px rgba(251, 146, 60, 0.5), 0 0 30px rgba(251, 146, 60, 0.2)',
                    filter: 'brightness(1.4) drop-shadow(0 0 3px rgba(251, 146, 60, 0.9)) drop-shadow(0 0 8px rgba(251, 146, 60, 0.7)) drop-shadow(0 0 16px rgba(251, 146, 60, 0.4))'
                  } : {}}
                >
                  {i < 4
                    ? <FaStar size={20} className="text-amber-300" />
                    : <FaStarHalfAlt size={20} className="text-amber-300" />
                  }
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Content Section - Rich & Powerful */}
          <div className="flex-1 p-6 sm:p-8 lg:p-9 flex flex-col justify-between bg-gradient-to-b from-slate-900/40 to-slate-950/90">

            {/* Title with Underline */}
            <div className="mb-4 sm:mb-6">
              <motion.h3 
                animate={{ 
                  color: isHovered ? 'rgb(255,255,255)' : 'rgb(229,230,235)',
                  letterSpacing: isHovered ? '0.05em' : '0em'
                }}
                transition={{ duration: 0.3 }}
                className="text-xl sm:text-2xl lg:text-3xl font-black line-clamp-2 tracking-tight"
              >
                {title}
              </motion.h3>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="h-1.5 w-14 rounded-full mt-4"
                style={{ 
                  backgroundColor: colors.hex,
                  boxShadow: `0 0 20px ${colors.hex}`,
                  transformOrigin: isArabic ? 'right' : 'left'
                }}
              />
            </div>

            {/* Description - Better spacing */}
            <motion.p 
              animate={{ opacity: isHovered ? 1 : 0.85 }}
              className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 mb-6 sm:mb-7 leading-relaxed tracking-wide"
            >
              {desc}
            </motion.p>

            {/* Features with Glow Dots */}
            {project.features && project.features.length > 0 && (
              <div className="mb-7 sm:mb-8 space-y-3">
                {project.features.slice(0, 2).map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex items-center gap-3 group/feature"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.7, 0.85, 1.5, 1],
                        opacity: [0.6, 1, 0.7, 1, 0.7],
                        y: [0, -3, 2, -2, 0]
                      }}
                      transition={{ 
                        duration: 2.2, 
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: 'easeInOut'
                      }}
                      className="w-4 h-4 rounded-full flex-shrink-0 group-hover/feature:scale-150"
                      style={{ 
                        backgroundColor: colors.hex,
                        boxShadow: `0 0 4px ${colors.hex}, 0 0 10px ${colors.hex}, 0 0 20px ${colors.hex}, 0 0 30px ${colors.hex}60`,
                        filter: `brightness(1.5) drop-shadow(0 0 3px ${colors.hex}) drop-shadow(0 0 8px ${colors.hex}) drop-shadow(0 0 16px ${colors.hex}) drop-shadow(0 0 24px ${colors.hex})`
                      }}
                    />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                      {isArabic ? (project.featuresAr ? project.featuresAr[i] : f) : f}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Action Buttons - Powerful */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 sm:pt-7 border-t transition-colors duration-300"
              style={{ borderColor: `${colors.hex}40` }}
            >
              
              {/* Main CTA - Power Button */}
              <MotionLink
                to={`/projects/${project.slug || project.id}`}
                state={{ project }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 border-2 relative overflow-hidden group/btn"
                style={{
                  backgroundColor: `${colors.hex}20`,
                  borderColor: colors.hex,
                  color: colors.hex,
                  boxShadow: isHovered ? `0 12px 40px ${colors.hex}30` : 'none'
                }}
              >
                {/* Fiery ember particles behind the CTA */}
                <motion.span
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none"
                  initial={{ scale: 0.7, opacity: 0.9 }}
                  animate={isHovered ? { y: [-2, -8, -2], scale: [1, 1.3, 1], opacity: [0.9, 0.6, 0.9] } : { y: 0, scale: 1, opacity: 0.85 }}
                  transition={{ duration: 0.9, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #ffd166 0%, #ff8c42 25%, rgba(255,99,71,0.8) 55%, transparent 70%)',
                    boxShadow: `0 6px 18px rgba(255,140,0,0.25), 0 0 30px rgba(255,99,71,0.14)`
                  }}
                />

                <motion.div
                  className="absolute -right-6 top-0 bottom-0 w-16 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={isHovered ? { opacity: 0.2, x: [0, -6, 0] } : { opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,140,0,0.06))' }}
                />

                <motion.div
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${colors.hex}30` }}
                />

                <span className="relative z-10">{t('projects.details')}</span>

                <motion.div
                  animate={{
                    x: isHovered ? [0, 8, -3, 6, 0] : 0,
                    scale: isHovered ? [1, 1.35, 0.95, 1.25, 1] : 1,
                    y: isHovered ? [0, -3, 3, -2, 0] : 0
                  }}
                  transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, repeatDelay: 0.3 }}
                  className={`relative text-xl font-bold flex items-center z-10 ${isArabic ? 'rotate-180' : ''}`}
                  style={{
                    textShadow: `0 0 6px ${colors.hex}, 0 0 14px ${colors.hex}`,
                    filter: `brightness(1.2) drop-shadow(0 0 6px ${colors.hex})`
                  }}
                >
                  <FaArrowRight />
                </motion.div>
              </MotionLink>

              {/* GitHub Icon - Enhanced */}
              {project.repo && (
                <motion.a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.25, rotate: 15 }}
                  whileTap={{ scale: 0.85 }}
                  className="p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 relative overflow-hidden group/git flex items-center justify-center"
                  style={{ 
                    borderColor: `${colors.hex}60`,
                    color: colors.hex,
                    boxShadow: isHovered ? `0 0 20px ${colors.hex}40` : 'none'
                  }}
                  title={t('projects.github') || t('projects.codeLabel') || 'View Repository'}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover/git:opacity-30 transition-opacity duration-300"
                    style={{ backgroundColor: colors.hex }}
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.35, 0.9, 1.3, 1],
                      rotate: [0, 20, -20, 12, 0],
                      y: [0, -4, 2, -2, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}
                    className="text-2xl relative z-10 font-bold"
                    style={{
                      textShadow: `0 0 4px ${colors.hex}, 0 0 10px ${colors.hex}, 0 0 20px ${colors.hex}, 0 0 30px ${colors.hex}`,
                      filter: `brightness(1.4) drop-shadow(0 0 3px ${colors.hex}) drop-shadow(0 0 8px ${colors.hex}) drop-shadow(0 0 16px ${colors.hex}) drop-shadow(0 0 24px ${colors.hex})`
                    }}
                  >
                    <FaGithub />
                  </motion.div>
                </motion.a>
              )}
            </div>

          </div>
        </div>

        {/* Animated Shine Effect - Premium */}
        <motion.div
          animate={{ 
            x: isHovered ? 500 : -500,
            opacity: isHovered ? [0, 0.5, 0] : 0
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)`,
            width: '250px',
            height: '500px',
            top: '-250px'
          }}
        />

        {/* Border Light */}
        {isHovered && (
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: `2px solid ${colors.hex}`,
              boxShadow: `inset 0 0 30px ${colors.hex}20, 0 0 30px ${colors.hex}30`
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
