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
        const res = await api.get(`/projects/${slug}`).catch(() => null)
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
        const res = await api.get('/projects')
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
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <Navbar />
      
      {/* === PREMIUM BACKGROUND EFFECTS (Subtle Animations) === */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-15%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-br ${cfg.gradient} rounded-full blur-3xl opacity-10 animate-pulse-slow`} />
        <div className={`absolute bottom-[-20%] left-[-8%] w-[800px] h-[800px] bg-gradient-to-tr ${cfg.gradient} rounded-full blur-3xl opacity-10 animate-pulse-slower`} />
        {/* Darker Vignette to prevent content washing out */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer">
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-10"><FaTimes size={28} /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HERO SECTION === */}
      <header className="relative min-h-[75vh] flex items-center pt-32 pb-32 overflow-hidden z-0">
        {/* FIXED: Darker overlay on image to make text readable */}
        <img src={project.image || defaultProject.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover filter brightness-50 scale-105 -z-20" />
        
        {/* FIXED: Stronger Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/40 to-[#050505] -z-10" />
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3"
          >
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-all bg-black/30 hover:bg-black/50 backdrop-blur-lg px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>{isAr ? 'جميع المشاريع' : 'All Projects'}</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Icon Section */}
            <motion.div 
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
              className={`
                relative group
                w-52 h-52 lg:w-64 lg:h-64
                rounded-3xl lg:rounded-[2.5rem]
                bg-gradient-to-br ${cfg.gradient}
                flex items-center justify-center
                text-8xl lg:text-9xl text-white
                shadow-2xl
                overflow-hidden
                mx-auto lg:mx-0
              `}
            >
               <motion.span 
                whileHover={{ rotate: 20, scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="relative z-20 drop-shadow-2xl filter brightness-125"
              >
                {getSectorIcon(project.category)}
              </motion.span>
            </motion.div>

            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center lg:text-left space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className={`inline-block text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-md bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`}>
                  {isAr ? '⭐ مشروع متميز' : '⭐ FEATURED PROJECT'}
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                {project.title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl drop-shadow-md">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                {project.category && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cfg.gradient}`} />
                    <span className="text-sm font-bold text-slate-200">{project.category}</span>
                  </div>
                )}
                {project.date && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-lg">
                    <FaCalendarAlt className="text-xs text-slate-400" />
                    <span className="text-sm font-bold text-slate-200">{new Date(project.date).getFullYear()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* === CONTENT SECTION === */}
      {/* FIXED: Z-index ensures this sits ABOVE the hero image nicely */}
      <main className="relative z-20 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Main Details */}
          <article className="lg:col-span-8 space-y-8">

            {/* FIXED: Background Opacity increased (slate-900/80) to prevent text overlap issues with background */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <div className="flex flex-col gap-6">
                
                {/* Content Header */}
                <div>
                   <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${cfg.colorClass}`}>{isAr ? 'حول المشروع' : 'About The Project'}</h2>
                   <div className="prose prose-invert prose-lg max-w-none">
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {project.fullContent || project.description}
                      </p>
                   </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3">{isAr ? 'التقنيات المستخدمة' : 'Technologies Used'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((t, idx) => (
                      <span key={idx} className="text-sm bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-slate-200 hover:bg-white/10 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons (Mobile friendly) */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${cfg.gradient} hover:shadow-lg hover:shadow-${cfg.colorHex}/20 transition-all transform hover:-translate-y-1`}>
                      {isAr ? 'زيارة الموقع' : 'Live Demo'} <FaExternalLinkAlt className="text-sm" />
                    </a>
                  )}
                  {(project.repo || project.github) && (
                    <a href={project.repo || project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">
                      {isAr ? 'الكود المصدري' : 'Source Code'} <FaGithub className="text-lg" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <section className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FaLayerGroup className={cfg.colorClass} /> {isAr ? 'معرض الصور' : 'Gallery'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((img, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-xl cursor-zoom-in group border border-white/10 aspect-video" onClick={() => setSelectedImage(img)}>
                      <img src={img} alt={`Shot ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaExpand className="text-white text-2xl drop-shadow-md" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation Cards */}
            <nav className="flex flex-col sm:flex-row gap-4 pt-4">
              {prevProj ? (
                <Link to={`/projects/${prevProj.slug || prevProj.id}`} className="flex-1 group relative overflow-hidden bg-slate-900 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4 relative z-10">
                    <FaArrowLeft className="text-slate-500 group-hover:text-white transition-colors" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{isAr ? 'السابق' : 'Previous'}</p>
                      <h4 className="font-bold text-slate-200 group-hover:text-white truncate max-w-[150px]">{prevProj.title}</h4>
                    </div>
                  </div>
                </Link>
              ) : <div className="flex-1" />}

              {nextProj ? (
                <Link to={`/projects/${nextProj.slug || nextProj.id}`} className="flex-1 group relative overflow-hidden bg-slate-900 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all text-right">
                  <div className="flex items-center justify-end gap-4 relative z-10">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{isAr ? 'التالي' : 'Next'}</p>
                      <h4 className="font-bold text-slate-200 group-hover:text-white truncate max-w-[150px]">{nextProj.title}</h4>
                    </div>
                    <FaArrowRight className="text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ) : <div className="flex-1" />}
            </nav>

          </article>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Project Info Card */}
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <h4 className="font-bold text-white">{isAr ? 'بطاقة المشروع' : 'Project Info'}</h4>
                  <div className={`w-2 h-2 rounded-full ${project.link ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-yellow-500'}`} />
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'العميل' : 'Client'}</span>
                    <span className="text-slate-200 font-medium">{project.client || 'Personal Project'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'التاريخ' : 'Date'}</span>
                    <span className="text-slate-200 font-medium">{project.date ? new Date(project.date).getFullYear() : '2025'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-slate-400">{isAr ? 'النوع' : 'Type'}</span>
                    <span className="text-slate-200 font-medium">{project.category || 'Web App'}</span>
                  </li>
                </ul>
              </div>

              {/* Call to Action */}
              <div className="relative overflow-hidden rounded-2xl p-6 border border-white/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-10`} />
                <h5 className="relative z-10 text-white font-bold mb-2">{isAr ? 'هل أعجبك العمل؟' : 'Like what you see?'}</h5>
                <p className="relative z-10 text-sm text-slate-400 mb-4">{isAr ? 'تواصل معي لبناء مشروعك القادم.' : 'Contact me to build your next project.'}</p>
                <Link to="/contact" className="relative z-10 block w-full text-center py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-semibold transition-all">
                  {isAr ? 'تواصل معي' : 'Get in Touch'}
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </main>
      
      {/* FIXED: Removed explicit <Footer /> here to avoid Double Footer duplication. 
          The Layout.js should handle the global footer. */}
    </div>
  )
}