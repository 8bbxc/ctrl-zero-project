import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight, FaGithub, FaStar, FaStarHalfAlt, FaCalendarAlt, FaFire, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

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
    hex: '#06b6d4', 
    gradient: 'from-cyan-700 via-cyan-600 to-sky-500',
    darkGradient: 'from-cyan-950 to-sky-900',
    glow: 'rgba(6, 182, 212, 0.5)',
    accent: '#a5f3fc'
  }
}

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const title = isArabic ? (project.titleAr || project.title) : project.title
  const desc = isArabic ? (project.descriptionAr || project.description) : project.description
  const sector = project.category || project.sector || 'Corporate'
  const colors = SECTOR_COLORS[sector] || SECTOR_COLORS.Corporate
  const image = project.image || 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933'

  const isFeatured = project.slug && project.slug.includes('mern-hotel')

  if (isFeatured) {
    const titleFeatured = isArabic ? (project.titleAr || project.title) : project.title
    const descFeatured = isArabic ? (project.descriptionAr || project.description) : project.description
    const dateFeatured = project.createdAt
      ? new Date(project.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' })
      : ''

    return (
      <article className="mx-auto w-full rounded-2xl overflow-hidden shadow-lg border border-white/6 bg-gradient-to-b from-slate-900/40 to-slate-950/80">
        <div className="relative h-64 md:h-72 lg:h-80">
          <img src={image} alt={titleFeatured} className="w-full h-full object-cover" />
          {/* softer overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
          <div className="absolute top-4 left-4 bg-blue-500/10 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            {project.category || t('sectors.all')}
          </div>
          {dateFeatured && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow">
              <FaCalendarAlt />
              <span>{dateFeatured}</span>
            </div>
          )}
          {/* 4.5 rating — four full stars + half */}
          <div className="absolute left-4 bottom-20 flex items-center gap-1">
            {[0,1,2,3,4].map(i => (
              i < 4
                ? <FaStar key={i} className="text-yellow-400 text-lg" />
                : <FaStarHalfAlt key={i} className="text-yellow-400 text-lg" />
            ))}
          </div>
        </div>

        <div className="px-5 py-6 bg-[linear-gradient(0deg,#081226,transparent)]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 line-clamp-2">{titleFeatured}</h3>
          <div className="h-1 w-10 bg-cyan-400 rounded-full mb-3" />
          <p className="text-slate-300 text-sm max-w-3xl mb-4 line-clamp-2">{descFeatured}</p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-cyan-400 text-black px-3 py-2 rounded-full font-semibold text-sm">
                  <FaExternalLinkAlt />
                  <span>{t('projects.liveDemo')}</span>
                </a>
              )}
              <Link to={`/projects/${project.slug || project.id}`} state={{ project }} className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 text-slate-100 text-sm">
                {t('projects.details')}
              </Link>
            </div>
            <div className="text-sm text-slate-400">{project.tags?.slice(0,3).join(' • ')}</div>
          </div>
        </div>
      </article>
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
              <Link 
                to={`/projects/${project.slug || project.id}`}
                state={{ project }}
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 border-2 hover:scale-110 active:scale-95 relative overflow-hidden group/btn"
                style={{
                  backgroundColor: `${colors.hex}20`,
                  borderColor: colors.hex,
                  color: colors.hex,
                  boxShadow: isHovered ? `0 0 20px ${colors.hex}40` : 'none'
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${colors.hex}30` }}
                />
                <span className="relative">{t('projects.details')}</span>
                <motion.div
                  animate={{ 
                    x: isHovered ? [0, 10, -3, 8, 0] : 0,
                    scale: isHovered ? [1, 1.4, 0.95, 1.3, 1] : 1,
                    y: isHovered ? [0, -3, 3, -2, 0] : 0
                  }}
                  transition={{ 
                    duration: 1.6, 
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 0.3
                  }}
                  className={`relative text-xl font-bold flex items-center ${isArabic ? 'rotate-180' : ''}`}
                  style={{
                    textShadow: `0 0 4px ${colors.hex}, 0 0 10px ${colors.hex}, 0 0 20px ${colors.hex}, 0 0 30px ${colors.hex}`,
                    filter: `brightness(1.3) drop-shadow(0 0 3px ${colors.hex}) drop-shadow(0 0 8px ${colors.hex}) drop-shadow(0 0 16px ${colors.hex}) drop-shadow(0 0 24px ${colors.hex})`
                  }}
                >
                  <FaArrowRight />
                </motion.div>
              </Link>

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
