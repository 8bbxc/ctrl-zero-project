import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaSearch, FaImages, FaExternalLinkAlt, FaLaptopCode } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'

// --- SECTOR CONFIG (includes hex for glow) ---
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والرعاية الصحية',
    hero: 'https://images.unsplash.com/photo-1586773860410-da3b1b9f5b97?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#fb7185',
    colorClass: 'text-rose-400',
    desc: 'Transforming patient care with advanced digital health solutions.',
    descAr: 'نحو رعاية صحية رقمية متقدمة.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#34d399',
    colorClass: 'text-emerald-400',
    desc: 'High-conversion stores aimed at maximizing revenue.',
    descAr: 'متاجر إلكترونية عالية الأداء.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#fb923c',
    colorClass: 'text-orange-400',
    desc: 'Digital menus and management systems for modern dining.',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#60a5fa',
    colorClass: 'text-blue-400',
    desc: 'Professional platforms that define brand authority.',
    descAr: 'منصات احترافية تعكس هوية الشركة.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#a78bfa',
    colorClass: 'text-purple-400',
    desc: 'Interactive learning experiences for the future.',
    descAr: 'تجارب تعليمية تفاعلية.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات',
    hero: 'https://images.unsplash.com/photo-1505691723518-36a8b2f9f1d9?auto=format&fit=crop&w=2000&q=80',
    colorHex: '#06b6d4',
    colorClass: 'text-cyan-400',
    desc: 'Immersive property showcases and booking engines.',
    descAr: 'معارض عقارية متقدمة.'
  }
}

// Motion variants for container + cards (staggered entrance)
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Hero parallax ref (simplified)
  const heroRef = useRef(null)

  // Use config (fallback to Corporate)
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descAr : config.desc

  useEffect(() => {
    let mounted = true
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await api.get('/projects')
        const all = Array.isArray(res.data) ? res.data : (res.data.items || [])
        // Filter by category (case-sensitive as stored in DB)
        const sectorProjects = all.filter(p => p.category === sector)
        
        // Ensure unique projects based on ID or slug
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
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <Navbar />

      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="relative h-[56vh] md:h-[64vh] lg:h-[72vh] overflow-hidden flex items-center">
        <img
          src={config.hero}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/90" />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-20 md:py-28">
            <h2 className="text-sm uppercase tracking-wider text-slate-300 mb-4 bg-white/5 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {isArabic ? 'القطاع' : 'Sector'}
            </h2>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
              {displayTitle} <span style={{ color: config.colorHex }}>.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed">
              {displayDesc}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm md:text-base text-slate-300 hover:text-white transition-all border border-white/10 px-6 py-3 rounded-full bg-black/40 hover:bg-white/10 backdrop-blur-md"> 
                <FaArrowLeft /> {isArabic ? 'الرجوع' : 'Back to sectors'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CONTENT ---------- */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 -mt-20 relative z-20">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <FaSearch className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">{isArabic ? 'قريباً...' : 'Coming Soon'}</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">{isArabic ? 'نقوم بتحضير مشاريع رائعة في هذا القسم.' : 'We are crafting exceptional projects for this sector.'}</p>
            <Link to="/contact" className="inline-block px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-opacity-90 transition-all">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        ) : (
          <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.article key={project.slug || project.id} variants={cardVariants} className="group relative h-full">
                {/* Whole card is clickable */}
                <Link to={`/projects/${project.slug || project.id}`} className="block h-full rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <FaLaptopCode className="text-5xl text-slate-700" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                    {/* Floating tags top-left */}
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-20">
                      {project.tags?.slice(0,2).map((t, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-bold tracking-wider bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-lg border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Gallery count top-right */}
                    {project.gallery?.length > 0 && (
                      <div className="absolute right-4 top-4 z-20">
                        <span className="text-[10px] font-bold bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5"> 
                          <FaImages /> {project.gallery.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col h-full justify-between">
                    <div>
                      <h4 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:${config.colorClass}`}>
                        {project.title}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6 font-light">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        {isArabic ? 'استكشف المزيد' : 'Explore Case Study'}
                      </span>
                      <span className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white bg-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300`}>
                        <FaExternalLinkAlt className="text-xs" />
                      </span>
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