import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'

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
    titleAr: 'العقارات',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#06b6d4', // Cyan-500
    icon: '🏢',
    desc: 'Immersive property showcases and booking engines.',
    descAr: 'معارض عقارية متقدمة ومحركات حجز تفاعلية.'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  // Fallback to Corporate if sector not found
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descAr : config.desc

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
                        {isArabic ? 'القطاع' : 'SECTOR'}
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
                <span className="hidden xs:inline">{isArabic ? 'العودة' : 'Back'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMING SOON PAGE ================= */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12 md:pt-20 relative z-20 min-h-[70vh] flex items-center justify-center">
        {/* Coming Soon Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl"
        >
          {/* Main Coming Soon Card */}
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 md:p-16 text-center">
            {/* Background Glow */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundColor: config.colorHex }}
            />
            
            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Animated Hourglass Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="mx-auto mb-8 inline-block text-6xl md:text-7xl"
              >
                ⏳
              </motion.div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                <span className="text-white">{isArabic ? 'قريباً جداً' : 'Coming Soon'}</span>
                <span style={{ color: config.colorHex }}>!</span>
              </h2>

              {/* Sector Name with Color */}
              <p className="text-lg md:text-xl font-semibold" style={{ color: config.colorHex }}>
                {displayTitle}
              </p>

              {/* Description */}
              <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {isArabic 
                  ? 'نحن نعمل بجد لجلب أفضل المشاريع والحلول الرقمية في هذا القطاع. ترقب معنا!' 
                  : 'We are working hard to bring you the best projects and digital solutions in this sector. Stay tuned!'}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm font-semibold text-slate-300">{isArabic ? 'سريع جداً' : 'Lightning Fast'}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-sm font-semibold text-slate-300">{isArabic ? 'تصميم احترافي' : 'Beautiful Design'}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="text-2xl mb-2">🚀</div>
                  <p className="text-sm font-semibold text-slate-300">{isArabic ? 'قريباً جداً' : 'Very Soon'}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link 
                  to="/projects" 
                  className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2 text-sm md:text-base w-full sm:w-auto"
                  style={{
                    backgroundColor: `${config.colorHex}20`,
                    borderColor: config.colorHex,
                    color: config.colorHex
                  }}
                >
                  {isArabic ? '← جميع القطاعات' : 'All Sectors ←'}
                </Link>
                <Link 
                  to="/contact" 
                  className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 text-white text-sm md:text-base w-full sm:w-auto"
                  style={{ backgroundColor: config.colorHex, boxShadow: `0 0 20px ${config.colorHex}40` }}
                >
                  {isArabic ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}