import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaArrowLeft, FaSearch, FaLaptopCode, FaImages, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- Enhanced Sector Configuration ---
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والرعاية الصحية',
    hero: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2000&q=80',
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-pink-600/5',
    border: 'group-hover:border-rose-500/50',
    shadow: 'group-hover:shadow-rose-500/20',
    description: 'Transforming patient care with advanced digital health solutions.',
    descriptionAr: 'نحول رعاية المرضى بحلول صحية رقمية متقدمة.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=2000&q=80',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-teal-600/5',
    border: 'group-hover:border-emerald-500/50',
    shadow: 'group-hover:shadow-emerald-500/20',
    description: 'High-conversion stores aimed at maximizing revenue.',
    descriptionAr: 'متاجر عالية التحويل تهدف لزيادة الأرباح.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-600/5',
    border: 'group-hover:border-orange-500/50',
    shadow: 'group-hover:shadow-orange-500/20',
    description: 'Digital menus and management systems for modern dining.',
    descriptionAr: 'قوائم رقمية وأنظمة إدارة لتجربة طعام حديثة.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-indigo-600/5',
    border: 'group-hover:border-blue-500/50',
    shadow: 'group-hover:shadow-blue-500/20',
    description: 'Professional platforms that define brand authority.',
    descriptionAr: 'منصات احترافية ترسخ هيبة العلامة التجارية.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-violet-600/5',
    border: 'group-hover:border-purple-500/50',
    shadow: 'group-hover:shadow-purple-500/20',
    description: 'Interactive learning experiences for the future.',
    descriptionAr: 'تجارب تعليمية تفاعلية للمستقبل.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات والسياحة',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-sky-600/5',
    border: 'group-hover:border-cyan-500/50',
    shadow: 'group-hover:shadow-cyan-500/20',
    description: 'Immersive property showcases and booking engines.',
    descriptionAr: 'معارض عقارية غامرة ومحركات حجز متطورة.'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Parallax Effect
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Config Fallback
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descriptionAr : config.description

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await api.get('/projects')
        const allProjects = Array.isArray(res.data) ? res.data : res.data.items || []
        const sectorProjects = allProjects.filter(p => p.category === sector)
        setProjects(sectorProjects)
      } catch (err) {
        console.error('Failed to fetch projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [sector])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-slate-50 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      {/* --- 1. Cinematic Hero Section --- */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden flex items-center justify-center">
        {/* Parallax Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src={config.hero} 
            alt={displayTitle}
            className="w-full h-full object-cover scale-110 blur-[2px]" 
          />
          <div className="absolute inset-0 bg-[#050505]/60" />
          <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-40 mix-blend-overlay`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl pt-20">
          <Link 
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors border border-white/5 px-5 py-2 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 group text-sm font-medium uppercase tracking-wider"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            {isArabic ? 'العودة للقطاعات' : 'Back to Sectors'}
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight"
          >
            {displayTitle} <span className={config.color}>.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed"
          >
            {displayDesc}
          </motion.p>
        </div>
      </div>

      {/* --- 2. Projects Grid --- */}
      <div className="container mx-auto px-4 md:px-8 py-24 relative z-10 -mt-32">
        
        {loading ? (
          <div className="flex justify-center h-80 items-center">
             <Spinner />
          </div>
        ) : projects.length === 0 ? (
          
          // Empty State
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-20 text-center shadow-2xl max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
               <FaSearch className="text-4xl text-slate-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{isArabic ? 'قريباً...' : 'Coming Soon'}</h2>
            <p className="text-slate-400 mb-10 text-lg font-light">
              {isArabic ? 'لم نضف مشاريع في هذا القسم بعد.' : 'We haven\'t added projects to this sector yet.'}
            </p>
            <Link to="/contact" className={`inline-block px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform`}>
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </motion.div>

        ) : (
          
          // Projects List
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className={`
                  relative h-full bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col
                  transition-all duration-500 hover:-translate-y-2
                  ${config.border} ${config.shadow} hover:shadow-2xl
                `}>
                  
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <FaLaptopCode className="text-6xl text-slate-800" />
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                    {/* Gallery Badge */}
                    <div className="absolute top-5 right-5 z-20">
                       {project.gallery?.length > 0 && (
                         <span className="bg-black/40 backdrop-blur-md text-white/90 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                           <FaImages /> {project.gallery.length}
                         </span>
                       )}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-8 flex flex-col flex-grow relative z-10">
                    
                    <h3 className={`text-2xl font-bold text-white mb-3 transition-colors duration-300 group-hover:${config.color}`}>
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 font-light">
                      {project.description}
                    </p>

                    {/* Bottom Row */}
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex gap-2">
                        {project.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded text-slate-400 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link 
                        to={`/projects/${project.slug || project.id}`}
                        className={`
                          w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white
                          hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform group-hover:rotate-45
                        `}
                      >
                        <FaExternalLinkAlt className="text-sm" />
                      </Link>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}