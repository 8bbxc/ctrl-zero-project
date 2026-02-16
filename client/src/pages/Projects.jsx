import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaStethoscope, FaShoppingCart, FaUtensils, FaBriefcase, 
  FaGraduationCap, FaBuilding, FaArrowRight 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'

// --- 1. تعريف القطاعات (نفس البيانات تماماً) ---
const sectors = [
  { 
    id: 'Medical', 
    label: 'Medical & Health', 
    labelAr: 'الطب والرعاية الصحية',
    icon: <FaStethoscope />, 
    desc: 'Digital solutions for clinics & hospitals',
    descAr: 'حلول رقمية متقدمة للعيادات والمستشفيات',
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    shadow: 'shadow-rose-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'group-hover:border-rose-500/50',
    glowColor: 'bg-rose-500'
  },
  { 
    id: 'E-Commerce', 
    label: 'E-Commerce', 
    labelAr: 'التجارة الإلكترونية',
    icon: <FaShoppingCart />, 
    desc: 'High-conversion online stores',
    descAr: 'متاجر إلكترونية عالية التحويل والأداء',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/50',
    glowColor: 'bg-emerald-500'
  },
  { 
    id: 'Restaurant', 
    label: 'Restaurants', 
    labelAr: 'المطاعم والضيافة',
    icon: <FaUtensils />, 
    desc: 'Menus & management systems',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة',
    gradient: 'from-orange-400 via-amber-500 to-yellow-600',
    shadow: 'shadow-orange-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'group-hover:border-orange-500/50',
    glowColor: 'bg-orange-500'
  },
  { 
    id: 'Corporate', 
    label: 'Corporate', 
    labelAr: 'الشركات والأعمال',
    icon: <FaBriefcase />, 
    desc: 'Professional business portfolios',
    descAr: 'منصات احترافية تعكس هوية الشركة',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
    shadow: 'shadow-blue-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'group-hover:border-blue-500/50',
    glowColor: 'bg-blue-500'
  },
  { 
    id: 'Education', 
    label: 'Education', 
    labelAr: 'التعليم والتدريب',
    icon: <FaGraduationCap />, 
    desc: 'LMS & E-learning platforms',
    descAr: 'منصات تعليمية وتدريبية تفاعلية',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    shadow: 'shadow-purple-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/50',
    glowColor: 'bg-purple-500'
  },
  { 
    id: 'Real Estate', 
    label: 'Real Estate', 
    labelAr: 'العقارات',
    icon: <FaBuilding />, 
    desc: 'Property listing & booking engines',
    descAr: 'محركات حجز وعرض عقارات غامرة',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadow: 'shadow-cyan-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/50',
    glowColor: 'bg-cyan-500',
    bgImage: '/images/REALSTATE.jpeg'
  }
]

export default function Projects() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const MotionLink = motion(Link)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030305] to-[#050505] text-slate-100 font-sans selection:bg-cyan-500/20 overflow-hidden pb-24">
      <Navbar />
      
      {/* --- Advanced Background with Multiple Layers --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] right-[-20%] w-[1000px] h-[1000px] bg-gradient-to-br from-indigo-900/15 to-purple-900/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-30%] left-[-20%] w-[1000px] h-[1000px] bg-gradient-to-tr from-cyan-900/15 to-blue-900/10 rounded-full blur-[150px] animate-pulse-slower" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">
        
        {/* --- Enhanced Header Section --- */}
        <div className="text-center mb-20 sm:mb-28 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] mb-8 backdrop-blur-md hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 cursor-default shadow-lg shadow-cyan-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></span>
              {t('projects.expertiseBadge')}
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
              <span className="text-slate-100">
                {t('projects.mainTitle')}
              </span>
              <br/>
              <span className="relative inline-block">
                <span className="absolute -inset-2 blur-3xl opacity-30 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse-slow"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
                  {t('projects.mainSubtitle')}
                </span>
              </span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
              {t('projects.headerDesc')}
            </p>
          </motion.div>
        </div>

        {/* --- Link to All Projects --- */}
        <div className="text-center mb-12 md:mb-20">
          <Link
            to="/projects/all"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm md:text-base hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/30"
          >
            <span>{t('projects.viewAll') || 'View All Projects'}</span>
            <FaArrowRight className={i18n.dir() === 'rtl' ? 'rotate-180' : ''} />
          </Link>
        </div>

        {/* --- Professional Grid with Enhanced Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-6">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <MotionLink 
                to={`/projects/sector/${sector.id}`}
                className={`
                  group relative overflow-hidden h-80 lg:h-72 rounded-2xl 
                  ${sector.bgImage ? 'bg-black/60' : 'bg-gradient-to-br from-slate-900/40 to-slate-950/20'}
                  border ${sector.bgImage ? 'border-white/10' : 'border-slate-800/50'}
                  transition-all duration-500 ease-out
                  hover:border-white/20 hover:-translate-y-3
                  shadow-lg shadow-black/40
                  active:scale-95
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Background image (if provided) — visible & zoomed on hover */}
                {sector.bgImage && (
                  <div
                    className="absolute inset-0 bg-cover bg-center transform transition-all duration-700 group-hover:scale-110 group-hover:opacity-95 opacity-85 z-0"
                    style={{ backgroundImage: `url(${sector.bgImage})`, filter: 'brightness(0.75) saturate(1.1)' }}
                  />
                )}
                {/* Dynamic overlay for text readability */}
                <div className={`absolute inset-0 transition-all duration-700 pointer-events-none z-[5] ${sector.bgImage ? 'bg-gradient-to-t from-black/85 via-black/45 to-black/20 group-hover:from-black/75 group-hover:via-black/35 group-hover:to-black/10' : ''}`} />

                {/* Dynamic Glow Effect */}
                <div className={`
                  absolute -inset-1 rounded-2xl blur-2xl opacity-0 
                  group-hover:opacity-15 transition-opacity duration-700
                  bg-gradient-to-r ${sector.gradient}
                  -z-10 group-hover:z-0
                `} />

                {/* Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[6]" />
                <div className={`
                  absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-0 
                  group-hover:opacity-10 transition-opacity duration-700
                  ${sector.glowColor} -mr-40 -mt-40 pointer-events-none z-[6]
                `} />

                <div className="relative h-full p-8 flex flex-col justify-between z-20">
                  
                  {/* Header: Icon & Arrow */}
                  <div className="flex justify-between items-start">
                    <div className={`
                      relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                      bg-gradient-to-br from-slate-900/80 to-slate-950/40 
                      border border-slate-800/60 shadow-inner backdrop-blur-sm
                      transition-all duration-500 ease-out
                      ${sector.iconColor}
                      group-hover:scale-125 group-hover:bg-gradient-to-br group-hover:${sector.gradient} 
                      group-hover:text-white group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-current/30
                    `}>
                      <span className="relative z-10 filter drop-shadow-md group-hover:drop-shadow-lg">{sector.icon}</span>
                    </div>

                    <div className={`
                      w-11 h-11 rounded-full border border-slate-700/60 flex items-center justify-center
                      text-slate-500 bg-transparent
                      transition-all duration-300
                      group-hover:border-slate-400 group-hover:text-slate-100 group-hover:bg-white/5
                    `}>
                      <FaArrowRight className={`text-sm transform group-hover:scale-125 ${isArabic ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl lg:text-xl xl:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors duration-300 group-hover:translate-y-0">
                      {isArabic ? sector.labelAr : sector.label}
                    </h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {isArabic ? sector.descAr : sector.desc}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div className={`
                    absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${sector.gradient} 
                    transition-all duration-500 group-hover:w-full
                  `} />
                </div>
              </MotionLink>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}