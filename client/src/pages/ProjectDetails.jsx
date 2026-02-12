import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaCalendarAlt, 
  FaLayerGroup, FaTimes, FaExpand, FaHospital, FaShoppingCart, FaUtensils, 
  FaBuilding, FaGraduationCap, FaHome 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner' // Assuming you use this or standard spinner
import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'  <-- REMOVED to prevent Double Footer issue

// --- Icon Mapping for Sectors ---
const SECTOR_ICON_MAP = {
  Medical: FaHospital,
  'E-Commerce': FaShoppingCart,
  Restaurant: FaUtensils,
  Corporate: FaBuilding,
  Education: FaGraduationCap,
  'Real Estate': FaHome
}

const getSectorIcon = (sectorName) => {
  const IconComponent = SECTOR_ICON_MAP[sectorName] || FaBuilding
  return <IconComponent />
}

// Simple sector config
const SECTOR_CONFIG = {
  Medical: { 
    colorHex: '#fb7185', 
    colorClass: 'text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/20'
  },
  'E-Commerce': { 
    colorHex: '#34d399', 
    colorClass: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/20'
  },
  Restaurant: { 
    colorHex: '#fb923c', 
    colorClass: 'text-orange-400',
    gradient: 'from-orange-500 to-amber-600',
    shadow: 'shadow-orange-500/20'
  },
  Corporate: { 
    colorHex: '#60a5fa', 
    colorClass: 'text-blue-400',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20'
  },
  Education: { 
    colorHex: '#a78bfa', 
    colorClass: 'text-purple-400',
    gradient: 'from-purple-500 to-violet-600',
    shadow: 'shadow-purple-500/20'
  },
  'Real Estate': { 
    colorHex: '#06b6d4', 
    colorClass: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/20'
  }
}

const defaultProject = {
  title: 'Nova Fintech Dashboard',
  description: 'A revolutionary financial platform allowing users to track assets in real-time.',
  fullContent: `This project was built to solve a critical problem in the fintech space: data latency.\n\nWe utilized WebSockets for real-time updates and Redis for caching, reducing load times by 40%. The UI is designed with a "Dark Mode First" approach to reduce eye strain for traders working late hours.\n\nKey challenges included handling thousands of concurrent connections and visualizing complex datasets using D3.js.`,
  image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933',
  tags: ['React', 'Node.js', 'Redis', 'D3.js', 'PostgreSQL'],
  link: 'https://example.com',
  repo: 'https://github.com',
  date: '2025',
  gallery: []
}

export default function ProjectDetails() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [prevProj, setPrevProj] = useState(null)
  const [nextProj, setNextProj] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchProject = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/projects/${slug}`).catch(() => null)
        const proj = (res && res.data) ? res.data : { ...defaultProject, title: slug?.replace(/-/g, ' ').toUpperCase() }
        if (mounted) setProject(proj)
      } catch (err) {
        console.error(err)
        if (mounted) setProject(defaultProject)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProject()
    return () => { mounted = false }
  }, [slug])

  // Fetch siblings
  useEffect(() => {
    if (!project) return
    let mounted = true
    const fetchSiblings = async () => {
      try {
        const res = await api.get('/api/projects')
        const all = Array.isArray(res.data) ? res.data : (res.data.items || [])
        const siblings = all.filter(p => p.category === project.category)
        const idx = siblings.findIndex(p => (p.slug || p.id) === (project.slug || project.id))
        if (idx !== -1 && mounted) {
          setPrevProj(siblings[(idx - 1 + siblings.length) % siblings.length])
          setNextProj(siblings[(idx + 1) % siblings.length])
        }
      } catch (err) {
        console.error('Failed to fetch siblings', err)
      }
    }
    fetchSiblings()
    return () => { mounted = false }
  }, [project])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!project) return null

  const cfg = SECTOR_CONFIG[project.category] || { colorHex: '#60a5fa', colorClass: 'text-blue-400', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative pb-24">
      <Navbar />
      
      {/* === Subtle Background Effects === */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${cfg.gradient} rounded-full blur-3xl opacity-5`} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${cfg.gradient} rounded-full blur-3xl opacity-5`} />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer">
            <button className="absolute top-6 right-6 text-white/60 hover:text-white transition p-2 z-10"><FaTimes size={28} /></button>
            <motion.img initial={{ scale: 0.85 }} animate={{ scale: 1 }} src={selectedImage} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HERO SECTION - Simplified === */}
      <header className="relative pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-all px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/30">
              <FaArrowLeft className={isAr ? 'rotate-180' : ''} />
              <span>{isAr ? 'جميع المشاريع' : 'Back to Projects'}</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Image - Left Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl bg-slate-800">
                <img 
                  src={project.image || defaultProject.image} 
                  alt={project.title} 
                  className="w-full h-96 object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>
            </motion.div>

            {/* Content - Right Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${cfg.colorClass} bg-slate-800/40`}>
                  {isAr ? 'مشروع' : 'PROJECT'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-50 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed">
                {project.description}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700">
                {project.category && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'القطاع' : 'Sector'}</p>
                    <p className="text-slate-100 font-semibold mt-1">{project.category}</p>
                  </div>
                )}
                {project.date && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'العام' : 'Year'}</p>
                    <p className="text-slate-100 font-semibold mt-1">{new Date(project.date).getFullYear()}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${cfg.gradient} hover:shadow-lg transition-all transform hover:scale-105`}
                  >
                    {isAr ? 'زيارة المشروع' : 'View Live'} 
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
                {(project.repo || project.github) && (
                  <a 
                    href={project.repo || project.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-slate-100 font-semibold hover:bg-slate-800/50 transition-all"
                  >
                    {isAr ? 'الكود' : 'Code'} 
                    <FaGithub className="text-lg" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* === CONTENT SECTION - Simplified === */}
      <main className="relative z-20 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="space-y-12">

          {/* Full Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/40 rounded-xl p-8 md:p-10 border border-slate-700"
          >
            <h2 className={`text-3xl font-bold mb-6 ${cfg.colorClass}`}>
              {isAr ? 'التفاصيل' : 'About'}
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                {project.fullContent || project.description}
              </p>
            </div>
          </motion.div>

          {/* Tech Stack */}
          {project.tags && project.tags.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-800/40 rounded-xl p-8 border border-slate-700"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-100">{isAr ? 'التقنيات' : 'Tech Stack'}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/40 rounded-xl p-8 border border-slate-700"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-100">{isAr ? 'المعرض' : 'Gallery'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.gallery.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-lg bg-slate-900 group cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <FaExpand className="text-white text-2xl" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prevProj ? (
              <Link 
                to={`/projects/${prevProj.slug || prevProj.id}`} 
                className="group bg-slate-800/40 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-4"
              >
                <FaArrowLeft className={`text-2xl text-slate-400 group-hover:text-slate-200 transition-colors ${isAr ? 'rotate-180' : ''}`} />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'السابق' : 'Previous'}</p>
                  <p className="text-slate-100 font-semibold group-hover:text-white transition-colors truncate">{prevProj.title}</p>
                </div>
              </Link>
            ) : <div />}
            
            {nextProj ? (
              <Link 
                to={`/projects/${nextProj.slug || nextProj.id}`} 
                className="group bg-slate-800/40 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-between gap-4 text-right"
              >
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'التالي' : 'Next'}</p>
                  <p className="text-slate-100 font-semibold group-hover:text-white transition-colors truncate">{nextProj.title}</p>
                </div>
                <FaArrowRight className={`text-2xl text-slate-400 group-hover:text-slate-200 transition-colors ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            ) : <div />}
          </nav>

        </div>
      </main>
    </div>
  )
}