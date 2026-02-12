import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowRight, FaGithub, FaStar, FaCalendarAlt, 
  FaStethoscope, FaShoppingCart, FaUtensils, FaBuilding, FaGraduationCap, FaHome, FaLaptopCode 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

// === 1. إعدادات الألوان والأيقونات الفاخرة (تم التعديل لتقوية التصميم) ===
const SECTOR_CONFIG = {
  Medical: { 
    hex: '#ff0f39', // أحمر قرمزي قوي
    gradient: 'from-[#ff0f39] via-[#e11d48] to-[#881337]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(255,15,57,0.6)]',
    border: 'group-hover:border-[#ff0f39]/50',
    icon: <FaStethoscope />
  },
  'E-Commerce': { 
    hex: '#00ff9d', // أخضر نيون سايبر
    gradient: 'from-[#00ff9d] via-[#10b981] to-[#064e3b]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(0,255,157,0.6)]',
    border: 'group-hover:border-[#00ff9d]/50',
    icon: <FaShoppingCart />
  },
  Restaurant: { 
    hex: '#ff6b00', // برتقالي ناري
    gradient: 'from-[#ff6b00] via-[#f97316] to-[#7c2d12]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(255,107,0,0.6)]',
    border: 'group-hover:border-[#ff6b00]/50',
    icon: <FaUtensils />
  },
  Corporate: { 
    hex: '#2563eb', // أزرق ملكي عميق
    gradient: 'from-[#3b82f6] via-[#2563eb] to-[#1e3a8a]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)]',
    border: 'group-hover:border-[#2563eb]/50',
    icon: <FaBuilding />
  },
  Education: { 
    hex: '#a855f7', // بنفسجي روحاني
    gradient: 'from-[#d8b4fe] via-[#a855f7] to-[#581c87]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)]',
    border: 'group-hover:border-[#a855f7]/50',
    icon: <FaGraduationCap />
  },
  'Real Estate': { 
    hex: '#06b6d4', // سماوي محيطي
    gradient: 'from-[#22d3ee] via-[#06b6d4] to-[#164e63]', 
    glow: 'shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)]',
    border: 'group-hover:border-[#06b6d4]/50',
    icon: <FaHome />
  },
  // Default fallback
  Default: {
    hex: '#94a3b8',
    gradient: 'from-slate-400 via-slate-500 to-slate-800',
    glow: 'shadow-[0_0_40px_-10px_rgba(148,163,184,0.4)]',
    border: 'group-hover:border-slate-400/50',
    icon: <FaLaptopCode />
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
  
  // اختيار الكونفيج المناسب
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Default
  const image = project.image || 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933'

  const cardVariants = {
    rest: { y: 0, scale: 1 },
    hover: { y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    click: { scale: 0.98 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
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
      {/* 1. توهج خلفي قوي عند الهوفر (Strong Background Glow) */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-br ${config.gradient} rounded-2xl opacity-0 group-hover:opacity-70 blur-lg transition duration-500 group-hover:duration-200`}
      />

      {/* 2. جسم البطاقة (Card Body) */}
      <div className={`
        relative h-full flex flex-col rounded-2xl overflow-hidden bg-[#0a0a0a] 
        border border-white/10 transition-all duration-300 ${config.border}
      `}>
        
        {/* === قسم الصورة (Image Section) === */}
        <div className="relative h-60 overflow-hidden">
          {/* الصورة مع زووم خفيف */}
          <motion.img
            src={image}
            alt={title}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full object-cover"
          />
          
          {/* تدرج لوني فوق الصورة يطابق لون القطاع */}
          <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-20 mix-blend-hard-light`} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />

          {/* شارة القطاع (Sector Badge) - تصميم جديد */}
          <div className="absolute top-4 left-4 z-20">
            <motion.div 
              animate={{ y: isHovered ? -2 : 0 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-xl border border-white/20 shadow-lg"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
              <span className="text-sm" style={{ color: config.hex }}>{config.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {sector}
              </span>
              {/* نقطة مضيئة */}
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: config.hex }} />
            </motion.div>
          </div>

          {/* التاريخ */}
          {project.createdAt && (
            <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-black/50 backdrop-blur-md rounded border border-white/10 text-[10px] text-slate-400 font-mono">
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* === قسم المحتوى (Content Section) === */}
        <div className="flex-1 p-6 flex flex-col relative">
          
          {/* خط زخرفي علوي ملون */}
          <div 
            className="absolute top-0 left-6 h-[2px] w-0 group-hover:w-16 transition-all duration-500 ease-out"
            style={{ background: config.hex }}
          />

          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
              {title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed h-10">
              {desc}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.features?.slice(0, 3).map((f, i) => (
              <span 
                key={i} 
                className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5"
              >
                #{isArabic ? (project.featuresAr ? project.featuresAr[i] : f) : f}
              </span>
            ))}
          </div>

          {/* الفوتر وزر التفاصيل */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <Link 
              to={`/projects/${project.slug}`}
              className="flex items-center gap-2 text-sm font-bold transition-all group/link"
              style={{ color: config.hex }}
            >
              {t('projects.details') || 'Explore'}
              <FaArrowRight className={`transform transition-transform group-hover/link:translate-x-1 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>

            <div className="flex gap-3">
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                  <FaGithub size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}