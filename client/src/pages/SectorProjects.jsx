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
    desc: 'Transforming patient care with advanced digital health solutions.',
    descAr: 'نحو رعاية صحية رقمية متقدمة وأنظمة إدارة عيادات ذكية.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#10b981', // Emerald-500
    desc: 'High-conversion stores aimed at maximizing revenue.',
    descAr: 'متاجر إلكترونية عالية الأداء مصممة لزيادة المبيعات.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#f97316', // Orange-500
    desc: 'Digital menus and management systems for modern dining.',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة للمطاعم والكافيهات.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#3b82f6', // Blue-500
    desc: 'Professional platforms that define brand authority.',
    descAr: 'منصات احترافية تعكس هوية الشركة وتعزز الثقة.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#8b5cf6', // Violet-500
    desc: 'Interactive learning experiences for the future.',
    descAr: 'تجارب تعليمية تفاعلية وأنظمة إدارة تعلم متطورة.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#06b6d4', // Cyan-500
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

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
        
        {/* 1. Background Image with heavy overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={config.hero}
            alt={displayTitle}
            className="w-full h-full object-cover opacity-20 filter grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#030305]/80 to-[#030305]" />
        </div>

        {/* 2. Ambient Glow (Sector Color) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[150px] z-0 pointer-events-none"
          style={{ backgroundColor: config.colorHex }}
        />

        {/* 3. Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Button */}
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all text-xs font-mono uppercase tracking-widest text-slate-300"
            >
              <FaArrowLeft className={isArabic ? 'rotate-180' : ''} />
              {isArabic ? 'جميع القطاعات' : 'All Sectors'}
            </Link>

            {/* Title with Dynamic Color */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6">
              {displayTitle.split(' ')[0]} 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                 {' '}{displayTitle.split(' ').slice(1).join(' ')}
              </span>
              <span style={{ color: config.colorHex }}>.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              {displayDesc}
            </p>
          </motion.div>
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
               <h3 className="text-3xl font-bold mb-3 text-white">{isArabic ? 'جاري العمل...' : 'In The Works'}</h3>
               <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                 {isArabic 
                   ? 'نقوم حالياً بتجهيز مشاريع استثنائية في هذا القطاع. تواصل معنا لمعرفة المزيد.' 
                   : 'We are currently crafting exceptional digital experiences for this sector. Contact us for a portfolio preview.'}
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
          <motion.section 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <motion.article 
                key={project.slug || project.id} 
                variants={cardVariants} 
                className="group h-full"
              >
                <Link 
                  to={`/projects/${project.slug || project.id}`} 
                  className="block h-full rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 transition-all duration-500 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50"
                  style={{ '--hover-color': config.colorHex }}
                >
                  {/* Image Area */}
                  <div className="relative w-full h-56 overflow-hidden bg-slate-900">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white/40`}>
                           <FaImages size={28} />
                        </div>
                        <p className="text-slate-400 text-sm font-light">{isArabic ? 'لا توجد صورة' : 'No Image'}</p>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span 
                        className="text-xs font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20"
                        style={{ borderColor: `${config.colorHex}40` }}
                      >
                        {project.category || config.title}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 relative z-10 flex flex-col h-auto min-h-[140px] justify-between">
                    {/* Title & Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-slate-50 transition-colors duration-300 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-light line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {project.description}
                      </p>
                    </div>

                    {/* Footer with Year and Arrow */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700 group-hover:border-slate-600 transition-colors">
                      <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                        {new Date(project.date || Date.now()).getFullYear()}
                      </span>
                      
                      <div 
                        className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 transition-all duration-300 group-hover:border-white group-hover:text-white"
                        style={{ backgroundColor: `${config.colorHex}15` }}
                      >
                        <FaArrowRight className={`text-xs transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.section>
        )}
      </main>
    </div>
  )
}