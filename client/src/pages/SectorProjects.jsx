import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSearch, FaImages, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fallback to Corporate if sector not found
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descAr : config.desc

  useEffect(() => {
    let mounted = true
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/projects')
        const all = Array.isArray(res.data) ? res.data : (res.data.items || [])
        
        // Filter logic preserved exactly as requested
        const sectorProjects = all.filter(p => {
          const category = p.category ? String(p.category).trim() : null;
          return category === sector;
        });
        
        const unique = []
        const seen = new Set()
        sectorProjects.forEach(p => {
          const key = p.slug || p.id
          if (!seen.has(key)) { seen.add(key); unique.push(p) }
        })
        
        if (mounted) setProjects(unique)
      } catch (err) {
        console.error('Failed fetching projects:', err)
        if (mounted) setProjects([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProjects()
    return () => { mounted = false }
  }, [sector])

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION - Enhanced Banner ================= */}
      <section className="relative overflow-hidden pt-20 pb-12">
        
        {/* Distinctive Sector Header */}
        <div 
          className="relative py-16 md:py-20 overflow-hidden"
          style={{ backgroundColor: `${config.colorHex}15` }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <img
              src={config.hero}
              alt={displayTitle}
              className="w-full h-full object-cover opacity-10 filter grayscale contrast-125 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-transparent to-[#030305]" />
          </div>

          {/* Ambient Glow (Sector Color) */}
          <div 
            className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px] z-0 pointer-events-none"
            style={{ backgroundColor: config.colorHex }}
          />

          {/* Banner Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Left: Icon + Title */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-4">
                  {/* Sector Icon */}
                  <div 
                    className="p-4 rounded-2xl flex items-center justify-center text-4xl md:text-5xl transition-all hover:scale-110 duration-300"
                    style={{ backgroundColor: `${config.colorHex}20`, border: `2px solid ${config.colorHex}40` }}
                  >
                    <span className="filter drop-shadow-lg">{config.icon || '📦'}</span>
                  </div>
                  
                  {/* Title Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.colorHex }}
                      />
                      <span 
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: config.colorHex }}
                      >
                        {isArabic ? 'القطاع' : 'SECTOR'}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                      {displayTitle}
                      <span style={{ color: config.colorHex }}>.</span>
                    </h1>
                  </div>
                </div>
                
                <p className="text-slate-300 font-light max-w-2xl leading-relaxed text-sm md:text-base">
                  {displayDesc}
                </p>
              </div>

              {/* Right: Back Button */}
              <Link 
                to="/projects" 
                className="px-6 py-3 rounded-xl border transition-all hover:scale-105 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
                style={{
                  backgroundColor: `${config.colorHex}10`,
                  borderColor: config.colorHex,
                  color: config.colorHex
                }}
              >
                <FaArrowLeft className={isArabic ? 'rotate-180' : ''} />
                {isArabic ? 'العودة' : 'Back'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS GRID ================= */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-20">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          // --- Empty State ---
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto text-center py-24 bg-[#0A0A0A] border border-white/5 rounded-[2rem] relative overflow-hidden"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: config.colorHex }} />
             
             <div className="relative z-10">
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6 border border-white/5 text-slate-500">
                 <FaSearch className="text-4xl" />
               </div>
               <h3 className="text-3xl font-bold mb-3 text-white">{isArabic ? 'لا يوجد مشاريع حالياً' : 'No Projects Yet'}</h3>
               <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                 {isArabic 
                   ? 'ما رأيك أن يكون مشروعك هو الأول هنا؟ تواصل معنا لعرض أعمالك في هذا القطاع المتخصص.' 
                   : 'What if your project could be the first one here? Contact us to showcase your work in this specialized sector.'}
               </p>
               <Link 
                 to="/contact" 
                 className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold transition-all hover:scale-105"
                 style={{ backgroundColor: config.colorHex, boxShadow: `0 0 20px ${config.colorHex}40` }}
               >
                 {isArabic ? 'ابدأ مشروعك' : 'Start Your Project'}
               </Link>
             </div>
          </motion.div>
        ) : (
          // --- Projects List ---
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {isArabic ? 'مشاريعنا المميزة' : 'Featured Projects'}
              </h2>
              <div 
                className="w-20 h-1 rounded-full"
                style={{ backgroundColor: config.colorHex }}
              />
            </motion.div>

            <motion.section 
              variants={containerVariants} 
              initial="hidden" 
              animate="show" 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.article 
                  key={project.slug || project.id} 
                  variants={cardVariants} 
                  className="group h-full"
                >
                  <Link 
                    to={`/projects/${project.slug || project.id}`} 
                    className="block h-full"
                  >
                    {/* Card Container with Premium Styling */}
                    <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 transition-all duration-500 hover:border-slate-600 shadow-lg hover:shadow-2xl group-hover:shadow-xl"
                      style={{
                        boxShadow: `0 0 0 1px rgba(15, 23, 42, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)`
                      }}
                    >
                      {/* Gradient Overlay for Hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"
                        style={{ backgroundColor: config.colorHex }}
                      />

                      {/* Image Area with Enhanced Styling */}
                      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
                        {project.image ? (
                          <>
                            <img 
                              src={project.image} 
                              alt={project.title} 
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter group-hover:brightness-110" 
                            />
                            {/* Image Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-60" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 gap-4 relative z-10">
                            <div 
                              className="w-20 h-20 rounded-full bg-opacity-20 flex items-center justify-center transition-all duration-300"
                              style={{ backgroundColor: `${config.colorHex}30` }}
                            >
                              <FaImages size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-sm font-light">{isArabic ? 'بدون صورة' : 'No Image'}</p>
                          </div>
                        )}
                        
                        {/* Category Badge - Premium Style */}
                        <div className="absolute top-4 right-4 z-20">
                          <div 
                            className="text-xs font-bold uppercase tracking-widest text-white px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 group-hover:scale-105"
                            style={{ 
                              backgroundColor: `${config.colorHex}20`,
                              borderColor: `${config.colorHex}60`,
                              boxShadow: `0 0 12px ${config.colorHex}30`
                            }}
                          >
                            {project.category || displayTitle.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Content Area - Enhanced */}
                      <div className="p-6 relative z-10 flex flex-col h-auto min-h-[160px] justify-between">
                        {/* Title with Enhanced Typography */}
                        <div className="mb-4 flex-grow">
                          <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300 line-clamp-2"
                            style={{
                              backgroundImage: `linear-gradient(to right, #ffffff, ${config.colorHex})`,
                            }}
                          >
                            {project.title}
                          </h3>
                          <p className="text-slate-400 text-sm font-light line-clamp-3 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                            {project.description}
                          </p>
                        </div>

                        {/* Footer with Enhanced Styling */}
                        <div className="flex items-center justify-between pt-5 border-t border-slate-700/50 group-hover:border-slate-600/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2 h-2 rounded-full animate-pulse transition-colors duration-300"
                              style={{ backgroundColor: config.colorHex }}
                            />
                            <span className="text-xs text-slate-500 font-mono uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                              {isArabic ? 'عرض' : 'View'}
                            </span>
                          </div>
                          
                          <div 
                            className="w-9 h-9 rounded-full border flex items-center justify-center text-slate-300 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
                            style={{ 
                              borderColor: `${config.colorHex}60`,
                              backgroundColor: `${config.colorHex}10`
                            }}
                          >
                            <FaArrowRight className={`text-sm transition-transform duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      </div>

                      {/* Corner Accent */}
                      <div 
                        className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: config.colorHex }}
                      />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.section>
          </div>
        )}
      </main>
    </div>
  )
}