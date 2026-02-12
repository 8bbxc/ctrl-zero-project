import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowRight, FaGithub, FaStar, FaCalendarAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// Sector Color Mapping - مع تدرجات فاخرة
const SECTOR_COLORS = {
  Medical: { 
    hex: '#f43f5e', 
    gradient: 'from-rose-600 via-pink-500 to-red-500', 
    light: '#f43f5e15',
    dark: '#7a1b2a',
    glow: 'shadow-lg shadow-rose-500/50'
  },
  'E-Commerce': { 
    hex: '#10b981', 
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500', 
    light: '#10b98115',
    dark: '#064e3b',
    glow: 'shadow-lg shadow-emerald-500/50'
  },
  Restaurant: { 
    hex: '#f97316', 
    gradient: 'from-orange-600 via-amber-500 to-yellow-500', 
    light: '#f9731615',
    dark: '#7c2d12',
    glow: 'shadow-lg shadow-orange-500/50'
  },
  Corporate: { 
    hex: '#3b82f6', 
    gradient: 'from-blue-600 via-cyan-500 to-indigo-500', 
    light: '#3b82f615',
    dark: '#1e3a8a',
    glow: 'shadow-lg shadow-blue-500/50'
  },
  Education: { 
    hex: '#8b5cf6', 
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-500', 
    light: '#8b5cf615',
    dark: '#4c1d95',
    glow: 'shadow-lg shadow-purple-500/50'
  },
  'Real Estate': { 
    hex: '#06b6d4', 
    gradient: 'from-cyan-600 via-sky-500 to-blue-500', 
    light: '#06b6d415',
    dark: '#0e3d48',
    glow: 'shadow-lg shadow-cyan-500/50'
  }
}

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const title = isArabic ? (project.titleAr || project.title) : project.title
  const desc = isArabic ? (project.descriptionAr || project.description) : project.description
  const sector = project.category || project.sector || 'Corporate'
  const colors = SECTOR_COLORS[sector] || SECTOR_COLORS.Corporate
  const image = project.image || 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933'

  const cardVariants = {
    rest: { y: 0, rotateX: 0 },
    hover: { 
      y: -12,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    click: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileTap="click"
      className="group relative h-full perspective"
    >
      {/* Outer Glow Container */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
        className={`absolute -inset-3 rounded-3xl blur-xl pointer-events-none ${colors.glow}`}
        style={{ 
          background: `radial-gradient(circle, ${colors.hex}40 0%, transparent 70%)`,
          zIndex: -1
        }}
      />

      {/* Card Container - أسطوري جداً */}
      <div className={`
        relative h-full rounded-2xl overflow-hidden backdrop-blur-xl
        border border-white/15 transition-all duration-500 ease-out
        ${isHovered ? 'border-white/40' : 'border-white/10'}
      `}
      style={{
        background: `linear-gradient(135deg, rgba(20,20,30,0.95) 0%, rgba(15,15,25,0.98) 100%)`,
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${colors.hex}40, inset 0 1px 0 0 rgba(255,255,255,0.1)` 
          : 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
      }}>

        {/* Animated Background Pattern */}
        <motion.div
          animate={{ 
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${colors.hex}, transparent 50%), radial-gradient(circle at 80% 70%, ${colors.hex}, transparent 50%)`,
            backgroundSize: '200% 200%'
          }}
        />

        <div className="relative z-10 h-full flex flex-col">

          {/* Image Section - ملكي */}
          <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
            {/* Image with Parallax */}
            <motion.div
              animate={{ scale: isHovered ? 1.12 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Gradient Overlay - تدرج فاخر */}
            <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-30 mix-blend-overlay`} />
            
            {/* Top Fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent" />

            {/* Animated Corner Accent */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${colors.hex}40 0%, transparent 100%)`,
                filter: 'blur(20px)'
              }}
            />

            {/* Sector Badge - ملون براق */}
            <motion.div 
              animate={{ y: isHovered ? -2 : 0 }}
              className="absolute top-4 left-4 sm:top-5 sm:left-5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest backdrop-blur-md border-2 z-20 cursor-default"
              style={{
                backgroundColor: `${colors.hex}25`,
                borderColor: colors.hex,
                color: colors.hex,
                boxShadow: `0 0 20px ${colors.hex}40`
              }}
            >
              {sector}
            </motion.div>

            {/* Date Badge */}
            {project.createdAt && (
              <motion.div 
                animate={{ y: isHovered ? -2 : 0 }}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/70 backdrop-blur-md text-xs sm:text-sm text-slate-300 rounded-full border border-white/10 z-20 flex items-center gap-1.5"
              >
                <FaCalendarAlt className="text-xs" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </motion.div>
            )}

            {/* Star Rating (Optional) */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0.3 }}
              className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-1 z-20"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: isHovered ? 1.2 : 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <FaStar size={14} className={`${i < 4 ? 'text-yellow-400' : 'text-slate-600'}`} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Content Section - محتوى غني */}
          <div className="flex-1 p-6 sm:p-7 lg:p-8 flex flex-col justify-between bg-gradient-to-b from-slate-900/50 to-slate-950/80">

            {/* Title Section */}
            <div className="mb-4 sm:mb-5">
              <motion.h3 
                animate={{ color: isHovered ? 'rgb(255,255,255)' : 'rgb(226,232,240)' }}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 line-clamp-2 transition-colors duration-300"
              >
                {title}
              </motion.h3>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-1 w-12 rounded-full mt-3"
                style={{ backgroundColor: colors.hex, transformOrigin: 'left' }}
              />
            </div>

            {/* Description */}
            <motion.p 
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 mb-5 sm:mb-6 leading-relaxed"
            >
              {desc}
            </motion.p>

            {/* Features / Tags */}
            {project.features && project.features.length > 0 && (
              <div className="mb-6 sm:mb-7 space-y-2.5">
                {project.features.slice(0, 2).map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isArabic ? 15 : -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-2.5"
                  >
                    <motion.div
                      animate={{ scale: isHovered ? 1.3 : 1 }}
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors.hex, boxShadow: `0 0 8px ${colors.hex}` }}
                    />
                    <span className="text-xs sm:text-sm text-slate-300">
                      {isArabic ? (project.featuresAr ? project.featuresAr[i] : f) : f}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t"
              style={{ borderColor: `${colors.hex}30` }}>
              
              {/* Main CTA Button - براق وملكي */}
              <Link 
                to={`/projects/${project.slug}`}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 border-2 hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
                style={{
                  backgroundColor: `${colors.hex}15`,
                  borderColor: colors.hex,
                  color: colors.hex
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: `${colors.hex}20` }}
                />
                <span className="relative">{t('projects.details') || 'View Details'}</span>
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`relative text-xs ${isArabic ? 'rotate-180' : ''}`}
                >
                  <FaArrowRight />
                </motion.div>
              </Link>

              {/* GitHub Link - أيقونة براقة */}
              {project.repo && (
                <motion.a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 sm:p-3.5 rounded-lg border-2 text-slate-300 hover:text-white transition-all duration-300 relative overflow-hidden group/git"
                  style={{ 
                    borderColor: `${colors.hex}40`,
                    color: colors.hex
                  }}
                  title="View Repository"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover/git:opacity-20 transition-opacity duration-300"
                    style={{ backgroundColor: colors.hex }}
                  />
                  <FaGithub className="text-lg sm:text-xl relative z-10" />
                </motion.a>
              )}
            </div>

          </div>
        </div>

        {/* Shine Effect */}
        <motion.div
          animate={{ 
            x: isHovered ? 400 : -400,
            opacity: isHovered ? [0, 0.3, 0] : 0
          }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            width: '200px'
          }}
        />
      </div>
    </motion.div>
  )
} 
