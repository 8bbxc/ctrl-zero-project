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

  // Hero parallax
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
        // filter by category (case-sensitive as stored in DB), ensure unique slugs
        const sectorProjects = all.filter(p => p.category === sector)
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]/60" />

        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-20 md:py-28">
            <h2 className="text-sm uppercase tracking-wider text-slate-300 mb-4">{isArabic ? 'القطاع' : 'Sector'}</h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              {displayTitle} <span style={{ color: config.colorHex }}>.</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">{displayDesc}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-white/5 px-4 py-2 rounded-full bg-white/5 backdrop-blur"> <FaArrowLeft /> {isArabic ? 'الرجوع' : 'Back to sectors'}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CONTENT ---------- */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-28">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <FaSearch className="text-2xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{isArabic ? 'قريباً...' : 'Coming Soon'}</h3>
            <p className="text-slate-400 mb-6">{isArabic ? 'نقوم بتحضير مشاريع رائعة في هذا القسم.' : 'We are preparing exciting projects for this sector.'}</p>
            <Link to="/contact" className="inline-block px-6 py-3 rounded-md bg-white text-black font-semibold">{isArabic ? 'تواصل معنا' : 'Contact Us'}</Link>
          </div>
        ) : (
          <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, i) => (
              <motion.article key={project.slug || project.id} variants={cardVariants} className="relative">
                {/* Whole card is clickable */}
                <Link to={`/projects/${project.slug || project.id}`} className="block rounded-2xl overflow-hidden">
                  <div
                    className="group relative bg-slate-900/60 backdrop-blur-md border border-white/6 hover:scale-[1.01] transition-transform duration-300"
                    style={{ boxShadow: `0 14px 40px ${config.colorHex}20` }}
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      {project.image ? (
                        <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <FaLaptopCode className="text-4xl text-slate-600" />
                        </div>
                      )}

                      {/* Floating tags on top-left */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2 z-20">
                        {project.tags?.slice(0,3).map((t, idx) => (
                          <span key={idx} className="text-[11px] bg-black/40 backdrop-blur text-white/90 px-2 py-1 rounded-full border border-white/10">#{t}</span>
                        ))}
                      </div>

                      {/* Gallery count top-right */}
                      {project.gallery?.length > 0 && (
                        <div className="absolute right-3 top-3 z-20">
                          <span className="text-[11px] bg-black/40 backdrop-blur text-white/90 px-2 py-1 rounded-full border border-white/8 flex items-center gap-2"> <FaImages /> {project.gallery.length}</span>
                        </div>
                      )}

                    </div>

                    {/* Content */}
                    <div className="p-5 md:p-6">
                      <h4 className={`text-lg md:text-xl font-bold mb-2 ${config.colorClass}`}>{project.title}</h4>
                      <p className="text-sm text-slate-300 mb-4 line-clamp-3">{project.description}</p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {project.tags?.slice(0,3).map((t, idx) => (
                            <span key={idx} className="text-[11px] text-slate-300 bg-white/3 px-2 py-1 rounded-md">{t}</span>
                          ))}
                        </div>

                        <span className="ml-auto">
                          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/6 text-white hover:bg-white hover:text-black transition-colors text-sm font-semibold">
                            {isArabic ? 'عرض التفاصيل' : 'View Details'} <FaExternalLinkAlt className="text-xs" />
                          </button>
                        </span>
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