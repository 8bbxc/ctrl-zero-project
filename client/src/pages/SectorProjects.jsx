import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaBell, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import api from '../services/api'
import ProjectCard from '../components/ProjectCard'

// --- Create SVG Gradients for Hero Images ---
const createGradientBg = (colorHex, pattern = 'dots') => {
  const lightColor = 'ffffff'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colorHex};stop-opacity:0.8"/><stop offset="100%" style="stop-color:${colorHex};stop-opacity:0.3"/></linearGradient><radialGradient id="glow"><stop offset="0%" style="stop-color:${colorHex};stop-opacity:0.3"/><stop offset="100%" style="stop-color:${colorHex};stop-opacity:0"/></radialGradient><pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="${lightColor}" opacity="0.15"/></pattern></defs><rect width="800" height="600" fill="${colorHex}15"/><rect width="800" height="600" fill="url(#grad)"/><circle cx="150" cy="100" r="200" fill="url(#glow)"/><circle cx="700" cy="500" r="250" fill="url(#glow)"/><rect width="800" height="600" fill="url(#dots)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// --- SECTOR CONFIG (الألوان والصور المحسّنة) ---
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والرعاية الصحية',
    hero: createGradientBg('#f43f5e'),
    colorHex: '#f43f5e', // Rose-500
    icon: '🏥',
    desc: 'Transforming patient care with advanced digital health solutions.',
    descAr: 'نحو رعاية صحية رقمية متقدمة وأنظمة إدارة عيادات ذكية.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: createGradientBg('#10b981'),
    colorHex: '#10b981', // Emerald-500
    icon: '🛒',
    desc: 'High-conversion stores aimed at maximizing revenue.',
    descAr: 'متاجر إلكترونية عالية الأداء مصممة لزيادة المبيعات.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: createGradientBg('#f97316'),
    colorHex: '#f97316', // Orange-500
    icon: '🍽️',
    desc: 'Digital menus and management systems for modern dining.',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة للمطاعم والكافيهات.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: createGradientBg('#3b82f6'),
    colorHex: '#3b82f6', // Blue-500
    icon: '💼',
    desc: 'Professional platforms that define brand authority.',
    descAr: 'منصات احترافية تعكس هوية الشركة وتعزز الثقة.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: createGradientBg('#8b5cf6'),
    colorHex: '#8b5cf6', // Violet-500
    icon: '🎓',
    desc: 'Interactive learning experiences for the future.',
    descAr: 'تجارب تعليمية تفاعلية وأنظمة إدارة تعلم متطورة.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات والفنادق',
    hero: createGradientBg('#f59e0b'),
    heroCover: createGradientBg('#f59e0b'),
    colorHex: '#f59e0b', // Amber-500
    icon: '🏨',
    desc: 'Luxury hotel booking platforms and immersive property management systems.',
    descAr: 'منصات حجز فنادق فاخرة وأنظمة إدارة عقارات متقدمة.'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { t, i18n } = useTranslation()
  const MotionLink = motion(Link)
  const isArabic = i18n.language === 'ar'
  const [isNotified, setIsNotified] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fallback to Corporate if sector not found
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descAr : config.desc

  // Fetch projects by sector
  useEffect(() => {
    let mounted = true
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/projects')
        const allProjects = Array.isArray(res.data) ? res.data : (res.data?.items || [])
        // Only show hotel in Real Estate, Coming Soon for other sectors
        const sectorProjects = sector === 'Real Estate' 
          ? allProjects.filter(p => p.slug === 'mern-hotel-booking')
          : []
        if (mounted) {
          setProjects(sectorProjects)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        if (mounted) setProjects([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProjects()
    return () => { mounted = false }
  }, [sector])

  const handleNotify = () => {
    setIsNotified(true)
    setTimeout(() => setIsNotified(false), 3000)
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION - Compact Banner ================= */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-8">
        
        {/* Compact Sector Header */}
        <div 
          className="relative py-8 md:py-10 overflow-hidden"
          style={{ backgroundColor: `${config.colorHex}12` }}
        >
          {/* Ambient Glow */}
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] z-0 pointer-events-none"
            style={{ backgroundColor: config.colorHex }}
          />

          {/* Banner Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
              {/* Left: Icon + Title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 md:gap-4 mb-3">
                  {/* Sector Icon */}
                  <motion.div 
                    className="p-2 md:p-3 rounded-full flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 transition-all duration-300 relative overflow-hidden"
                    style={{ backgroundColor: `${config.colorHex}25`, border: `3px solid ${config.colorHex}60` }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-60"
                      style={{ borderColor: config.colorHex }}
                      animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="filter drop-shadow-lg relative z-10">{config.icon || '📦'}</span>
                  </motion.div>
                  
                  {/* Title Section */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: config.colorHex }}
                      />
                      <span 
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: config.colorHex }}
                      >
                        {t('sectors.sectorLabel')}
                      </span>
                    </div>
                    <motion.div 
                      className="overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white truncate">
                        {displayTitle}
                        <span style={{ color: config.colorHex }} className="animate-pulse">.</span>
                      </h1>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right: Back Button */}
              <Link 
                to="/projects" 
                className="w-full sm:w-auto px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl border transition-all hover:scale-105 text-xs md:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px] flex-shrink-0"
                style={{
                  backgroundColor: `${config.colorHex}10`,
                  borderColor: config.colorHex,
                  color: config.colorHex
                }}
              >
                <FaArrowLeft className={isArabic ? 'rotate-180' : ''} size={14} />
                <span className="hidden sm:inline">{t('back')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS OR COMING SOON ================= */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-16 md:pt-24 relative z-20">
        
        {/* Show Projects if they exist */}
        {!loading && projects.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Section Title */}
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                {t('projects.ourPrefix')}<span style={{ color: config.colorHex }}>{displayTitle}</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{displayDesc}</p>
            </motion.div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  variants={itemVariants}
                  className="w-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Show Coming Soon if no projects
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl mx-auto min-h-[calc(100vh-300px)] flex items-center justify-center"
          >
            {/* Premium Coming Soon Card with Image Cover */}
            <motion.div 
              variants={itemVariants}
              className="relative w-full rounded-3xl overflow-hidden backdrop-blur-2xl border-2 bg-gradient-to-br from-slate-900/60 to-slate-950/90 shadow-2xl group"
              style={{ borderColor: `${config.colorHex}50` }}
            >
              {/* Background Glow */}
              <motion.div
                className="absolute -inset-4 rounded-3xl blur-3xl -z-50 opacity-20 group-hover:opacity-40 transition-all duration-700"
                style={{
                  background: `linear-gradient(135deg, ${config.colorHex}60, ${config.colorHex}20)`,
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              {/* Top Accent Line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.colorHex}, transparent)`
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden">
                {/* Left: Image Cover */}
                <motion.div 
                  className="lg:col-span-2 h-72 lg:h-auto relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.img 
                    src={config.heroCover || config.hero}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Image Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  {/* Glow Accent */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40"
                    style={{ backgroundColor: config.colorHex }}
                  />
                </motion.div>

                {/* Right: Content */}
                <div className="lg:col-span-3 p-6 md:p-10 lg:p-12 flex flex-col justify-center relative z-10">
                  {/* Top Section */}
                  <motion.div 
                    className="mb-8 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {/* Icon - Enhanced */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 5, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 2.5, repeat: Infinity }
                      }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full relative overflow-hidden"
                      style={{ 
                        backgroundColor: `${config.colorHex}30`,
                        border: `3px solid ${config.colorHex}60`,
                        boxShadow: `0 0 30px ${config.colorHex}40, inset 0 0 15px ${config.colorHex}20`
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: [400, -400] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-4xl relative z-10">{config.icon}</span>
                    </motion.div>

                    {/* Title */}
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">
                        {t('sectors.comingSoonTitle')}
                      </h2>
                      <motion.div 
                        className="flex items-center gap-3"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div 
                          className="h-1.5 w-8 rounded-full"
                          style={{ backgroundColor: config.colorHex }}
                        />
                        <span className="text-lg font-bold" style={{ color: config.colorHex }}>
                          {displayTitle}
                        </span>
                      </motion.div>
                    </div>

                    {/* Status Badge */}
                    <motion.div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md w-fit"
                      style={{ 
                        backgroundColor: `${config.colorHex}10`,
                        borderColor: `${config.colorHex}40`
                      }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.span 
                        className="inline-block w-2 h-2 rounded-full" 
                        style={{ backgroundColor: config.colorHex }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span style={{ color: config.colorHex }} className="text-xs font-bold uppercase tracking-wider">
                        {t('sectors.inDevelopment')}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Middle Section - Description */}
                  <motion.p 
                    className="text-slate-300 text-sm md:text-base leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {t('sectors.comingDesc')}
                  </motion.p>

                  {/* Features Grid - Enhanced */}
                  <motion.div 
                    className="grid grid-cols-3 gap-2 md:gap-3 mb-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, staggerChildren: 0.1 }}
                  >
                    {[
                      { icon: '⚡', label: t('sectors.features.fastLabel') },
                      { icon: '🎨', label: t('sectors.features.designLabel') },
                      { icon: '🚀', label: t('sectors.features.launchLabel') }
                    ].map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ y: -6, scale: 1.08 }}
                        className="p-3 md:p-4 rounded-2xl border transition-all relative overflow-hidden group/feat"
                        style={{ 
                          backgroundColor: `${config.colorHex}12`,
                          borderColor: `${config.colorHex}40`,
                          borderWidth: '2px'
                        }}
                      >
                        {/* Hover glow */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover/feat:opacity-100"
                          style={{ backgroundColor: `${config.colorHex}08` }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="text-2xl md:text-3xl mb-2 relative z-10">{feature.icon}</div>
                        <p className="text-xs md:text-sm font-semibold text-slate-200 relative z-10">{feature.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-2 md:gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <MotionLink 
                      to="/projects"
                      className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all border-2 flex items-center justify-center gap-2 min-h-[44px] relative overflow-hidden group/btn-back"
                      style={{
                        backgroundColor: `${config.colorHex}15`,
                        borderColor: `${config.colorHex}70`,
                        color: config.colorHex
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${config.colorHex}50` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn-back:opacity-100"
                        animate={{ x: [400, -400] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <FaArrowLeft className={`text-xs relative z-10 ${isArabic ? 'rotate-180' : ''}`} />
                      <span className="relative z-10">{t('sectors.allSectors')}</span>
                    </MotionLink>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/contact" 
                        className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm text-white transition-all flex items-center justify-center gap-2 min-h-[44px] relative overflow-hidden group/btn"
                        style={{ 
                          background: `linear-gradient(135deg, ${config.colorHex}E6, ${config.colorHex}CC)`,
                          boxShadow: `0 0 30px ${config.colorHex}60, inset 0 1px 0 ${config.colorHex}`
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/btn:opacity-100"
                          animate={{ x: [400, -400] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <FaEnvelope className="text-xs relative z-10" />
                        <span className="relative z-10">{t('sectors.contactNow')}</span>
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Notify Button - Enhanced */}
                  <motion.button
                    onClick={handleNotify}
                    className="mt-4 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm transition-all flex items-center justify-center gap-2 border-2 w-full sm:w-auto min-h-[44px] relative overflow-hidden group/notify"
                    style={{ 
                      color: config.colorHex,
                      borderColor: `${config.colorHex}60`,
                      backgroundColor: `${config.colorHex}10`
                    }}
                    whileHover={{ scale: 1.05, borderColor: config.colorHex, backgroundColor: `${config.colorHex}20` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover/notify:opacity-100"
                      style={{ backgroundColor: `${config.colorHex}08` }}
                      transition={{ duration: 0.3 }}
                    />
                    <FaBell className={`text-xs relative z-10 ${isNotified ? 'animate-bounce' : ''}`} />
                    <span className="relative z-10">
                      {isNotified ? t('sectors.subscribed') : t('sectors.notifyMe')}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

        </motion.div>
        )}
      </main>
    </div>
  )
}