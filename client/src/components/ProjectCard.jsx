import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaArrowRight, FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// Sector Color Mapping
const SECTOR_COLORS = {
  Medical: { hex: '#f43f5e', gradient: 'from-rose-500 via-pink-500 to-red-600', light: '#f43f5e15', border: '#f43f5e40' },
  'E-Commerce': { hex: '#10b981', gradient: 'from-emerald-500 via-teal-500 to-cyan-600', light: '#10b98115', border: '#10b98140' },
  Restaurant: { hex: '#f97316', gradient: 'from-orange-500 via-amber-500 to-yellow-600', light: '#f9731615', border: '#f9731640' },
  Corporate: { hex: '#3b82f6', gradient: 'from-blue-500 via-cyan-500 to-indigo-600', light: '#3b82f615', border: '#3b82f640' },
  Education: { hex: '#8b5cf6', gradient: 'from-purple-500 via-violet-500 to-fuchsia-600', light: '#8b5cf615', border: '#8b5cf640' },
  'Real Estate': { hex: '#06b6d4', gradient: 'from-cyan-500 via-sky-500 to-blue-600', light: '#06b6d415', border: '#06b6d440' }
}

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [isHovered, setIsHovered] = useState(false)

  const title = isArabic ? (project.titleAr || project.title) : project.title
  const desc = isArabic ? (project.descriptionAr || project.description) : project.description
  const sector = project.category || project.sector || 'Corporate'
  const colors = SECTOR_COLORS[sector] || SECTOR_COLORS.Corporate
  const image = project.image || 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Card Container */}
      <div className={`
        relative h-full rounded-3xl overflow-hidden backdrop-blur-xl
        border transition-all duration-500 ease-out
        ${isHovered ? 'border-white/30 shadow-2xl' : 'border-white/10 shadow-lg'}
      `}
      style={{
        backgroundColor: '#020202aa',
        boxShadow: isHovered ? `0 0 40px ${colors.hex}30` : 'none'
      }}>

        {/* Background Glow */}
        <div 
          className="absolute inset-0 opacity-5 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: colors.hex }}
        />

        {/* Animated Background Orb */}
        <motion.div
          animate={{ opacity: isHovered ? 0.15 : 0.05 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: colors.hex }}
        />

        <div className="relative z-10 h-full flex flex-col">

          {/* Image Section */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700"
              animate={{ scale: isHovered ? 1.1 : 1 }}
            />
            
            {/* Image Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-20 transition-opacity duration-500`} />
            
            {/* Sector Badge */}
            <div 
              className="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md border"
              style={{
                backgroundColor: colors.light,
                borderColor: colors.border,
                color: colors.hex
              }}
            >
              {sector}
            </div>

            {/* Date Badge */}
            {project.createdAt && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/60 backdrop-blur-md text-xs sm:text-sm text-slate-300 rounded-full">
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between">

            {/* Title */}
            <div className="mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white line-clamp-2 transition-colors duration-300 group-hover:text-white">
                {title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-5 leading-relaxed">
              {desc}
            </p>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-5 sm:mb-6 space-y-2">
                {project.features.slice(0, 2).map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span 
                      className="text-xs flex-shrink-0 mt-1.5"
                      style={{ color: colors.hex }}
                    >
                      ▸
                    </span>
                    <span className="text-xs sm:text-sm text-slate-300">
                      {isArabic ? (project.featuresAr ? project.featuresAr[i] : f) : f}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Bottom Action Area */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
              
              {/* Main CTA Button */}
              <Link 
                to={`/projects/${project.slug}`}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 border-2 hover:scale-105"
                style={{
                  backgroundColor: colors.light,
                  borderColor: colors.hex,
                  color: colors.hex
                }}
              >
                <span>{t('projects.details') || 'Details'}</span>
                <FaArrowRight className={`text-xs transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''} ${isArabic ? 'rotate-180' : ''}`} />
              </Link>

              {/* GitHub Link */}
              {project.repo && (
                <motion.a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 sm:p-3 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all duration-300"
                  title="View Repository"
                >
                  <FaGithub className="text-lg sm:text-xl" />
                </motion.a>
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
} 
