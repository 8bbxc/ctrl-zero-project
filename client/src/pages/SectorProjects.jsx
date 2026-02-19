import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaBell, FaEnvelope } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import api from '../services/api'
import ProjectCard from '../components/ProjectCard'

// --- SECTOR CONFIG (الألوان والصور) ---
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والرعاية الصحية',
    hero: 'https://images.unsplash.com/photo-1538108149393-fbbd81897560?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#f43f5e', // Rose-500
    icon: '🏥',
    desc: 'Transforming patient care with advanced digital health solutions.',
    descAr: 'نحو رعاية صحية رقمية متقدمة وأنظمة إدارة عيادات ذكية.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#10b981', // Emerald-500
    icon: '🛒',
    desc: 'High-conversion stores aimed at maximizing revenue.',
    descAr: 'متاجر إلكترونية عالية الأداء مصممة لزيادة المبيعات.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#f97316', // Orange-500
    icon: '🍽️',
    desc: 'Digital menus and management systems for modern dining.',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة للمطاعم والكافيهات.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#3b82f6', // Blue-500
    icon: '💼',
    desc: 'Professional platforms that define brand authority.',
    descAr: 'منصات احترافية تعكس هوية الشركة وتعزز الثقة.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#8b5cf6', // Violet-500
    icon: '🎓',
    desc: 'Interactive learning experiences for the future.',
    descAr: 'تجارب تعليمية تفاعلية وأنظمة إدارة تعلم متطورة.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات والفنادق',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#f59e0b', // Amber-500 (Better for hotels)
    icon: '🏨',
    desc: 'Luxury hotel booking platforms and immersive property management systems.',
    descAr: 'منصات حجز فنادق فاخرة وأنظمة إدارة عقارات متقدمة.'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { t, i18n } = useTranslation()
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
                  <div 
                    className="p-2 md:p-3 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 transition-all hover:scale-110 duration-300"
                    style={{ backgroundColor: `${config.colorHex}20`, border: `2px solid ${config.colorHex}40` }}
                  >
                    <span className="filter drop-shadow-lg">{config.icon || '📦'}</span>
                  </div>
                  
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
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white truncate">
                      {displayTitle}
                      <span style={{ color: config.colorHex }}>.</span>
                    </h1>
                  </div>
                </div>
              </div>

              {/* Right: Back Button */}
              <Link 
                to="/projects" 
                className="px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl border transition-all hover:scale-105 text-xs md:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: `${config.colorHex}10`,
                  borderColor: config.colorHex,
                  color: config.colorHex
                }}
              >
                <FaArrowLeft className={isArabic ? 'rotate-180' : ''} size={14} />
                <span className="hidden xs:inline">{t('back')}</span>
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
            className="w-full max-w-4xl mx-auto min-h-[calc(100vh-300px)] flex items-center justify-center"
          >
          {/* Top Decorative Line */}
          <motion.div 
            variants={itemVariants}
            className="h-1 w-24 mx-auto mb-12 rounded-full"
            style={{ backgroundColor: config.colorHex }}
          />

          {/* Main Card with Premium Design */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-8 md:p-12 lg:p-16"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Gradient Orb 1 */}
              <div 
                className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: config.colorHex }}
              />
              {/* Gradient Orb 2 */}
              <div 
                className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5 blur-3xl"
                style={{ backgroundColor: config.colorHex }}
              />
            </div>

            {/* Content Grid Layout */}
            <div className="relative z-10">
              
              {/* Row 1: Icon + Main Title + Description */}
              <div className="text-center space-y-6 mb-12">
                {/* Animated Hourglass */}
                <motion.div
                  animate={{ 
                    rotate: [0, 180, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full"
                  style={{ backgroundColor: `${config.colorHex}15`, border: `2px solid ${config.colorHex}40` }}
                >
                  <span className="text-5xl md:text-6xl">⏳</span>
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                      {t('sectors.comingSoonTitle')}
                    </span>
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="h-1 w-12 rounded-full"
                      style={{ backgroundColor: config.colorHex }}
                    />
                    <span className="text-lg md:text-xl font-bold" style={{ color: config.colorHex }}>
                      {displayTitle}
                    </span>
                    <div 
                      className="h-1 w-12 rounded-full"
                      style={{ backgroundColor: config.colorHex }}
                    />
                  </div>
                </div>

                {/* Badge */}
                  <motion.div 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md"
                    style={{ 
                      backgroundColor: `${config.colorHex}10`,
                      borderColor: `${config.colorHex}40`
                    }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: config.colorHex, animation: 'pulse 2s infinite' }} />
                    <span style={{ color: config.colorHex }} className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                      {t('sectors.inDevelopment')}
                    </span>
                  </motion.div>
              </div>

              {/* Row 2: Description */}
              <motion.p 
                variants={itemVariants}
                className="text-center text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12"
              >
                {t('sectors.comingDesc')}
              </motion.p>

              {/* Row 3: Features Grid */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-12"
              >
                {[
                  { icon: '⚡', label: t('sectors.features.fastLabel'), subtext: t('sectors.features.fastSubtext') },
                  { icon: '🎨', label: t('sectors.features.designLabel'), subtext: t('sectors.features.designSubtext') },
                  { icon: '🚀', label: t('sectors.features.launchLabel'), subtext: t('sectors.features.launchSubtext') }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="p-4 md:p-5 rounded-2xl border transition-all duration-300"
                    style={{ 
                      backgroundColor: `${config.colorHex}08`,
                      borderColor: `${config.colorHex}30`,
                      borderWidth: '1.5px'
                    }}
                  >
                    <div className="text-3xl md:text-4xl mb-3">{feature.icon}</div>
                    <p className="font-bold text-slate-200 text-sm md:text-base mb-1">{feature.label}</p>
                    <p className="text-xs text-slate-400">{feature.subtext}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Row 4: CTA Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12"
              >
                <Link 
                  to="/projects" 
                  className="w-full sm:w-auto px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-300 border-2 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg"
                  style={{
                    backgroundColor: `${config.colorHex}15`,
                    borderColor: config.colorHex,
                    color: config.colorHex
                  }}
                >
                  <FaArrowLeft className={`text-sm ${isArabic ? 'rotate-180' : ''}`} />
                  <span>{t('sectors.allSectors')}</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="w-full sm:w-auto px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl"
                  style={{ 
                    backgroundColor: config.colorHex,
                    boxShadow: `0 0 30px ${config.colorHex}50`
                  }}
                >
                  <FaEnvelope className="text-sm" />
                  <span>{t('sectors.contactNow')}</span>
                </Link>
              </motion.div>

              {/* Row 5: Notification CTA */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center justify-center"
              >
                <button
                  onClick={handleNotify}
                  className="px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5"
                  style={{ color: config.colorHex }}
                >
                  <FaBell className={`text-sm ${isNotified ? 'animate-bounce' : ''}`} />
                  <span>
                    {isNotified ? t('sectors.subscribed') : t('sectors.notifyMe')}
                  </span>
                </button>
              </motion.div>

            </div>
          </motion.div>

          {/* Bottom Decorative Line */}
          <motion.div 
            variants={itemVariants}
            className="h-1 w-24 mx-auto mt-12 rounded-full"
            style={{ backgroundColor: config.colorHex, opacity: 0.5 }}
          />

        </motion.div>
        )}
      </main>
    </div>
  )
}