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
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative pb-24">
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

            {/* Content Section - Enhanced */}
            <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
              
              <div className="flex flex-col gap-8 relative z-10">
                
                {/* About Section */}
                <div>
                   <h2 className={`text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 ${cfg.colorClass}`}>
                     {isAr ? 'ℹ️ حول المشروع' : '✨ About The Project'}
                   </h2>
                   <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
                        {project.fullContent || project.description}
                      </p>
                   </div>
                </div>

                {/* Tech Stack Tags - Enhanced */}
                {project.tags && project.tags.length > 0 && (
                  <div className="border-t border-white/5 pt-8">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"></span>
                      {isAr ? 'التقنيات المستخدمة' : 'Tech Stack'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((t, idx) => (
                        <span 
                          key={idx} 
                          className="text-sm bg-gradient-to-r from-slate-800/50 to-slate-900/30 border border-white/10 px-4 py-2 rounded-full text-slate-200 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-900 hover:border-white/20 transition-all duration-300 transform hover:scale-105 cursor-default"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons - Enhanced */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/5">
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${cfg.gradient} hover:shadow-2xl hover:scale-105 transition-all transform active:scale-95 group/btn`}
                    >
                      {isAr ? 'زيارة المشروع' : 'View Live'} 
                      <FaExternalLinkAlt className="text-sm group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  {(project.repo || project.github) && (
                    <a 
                      href={project.repo || project.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl border-2 border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 hover:border-white/40 transition-all hover:scale-105 transform active:scale-95 group/btn"
                    >
                      {isAr ? 'الكود' : 'GitHub'} 
                      <FaGithub className="text-lg group-hover/btn:rotate-12 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery - Enhanced */}
            {project.gallery && project.gallery.length > 0 && (
              <section className="bg-gradient-to-br from-slate-900/40 to-slate-950/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                  <FaLayerGroup className={`${cfg.colorClass} text-lg`} /> 
                  {isAr ? 'معرض المشروع' : 'Project Gallery'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {project.gallery.map((img, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="relative overflow-hidden rounded-xl cursor-zoom-in group/img border border-white/10 aspect-video bg-slate-950 shadow-lg hover:shadow-2xl transition-all duration-300" 
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-125" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-lg`}>
                          <FaExpand className="text-lg" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation Cards - Enhanced */}
            <nav className="flex flex-col sm:flex-row gap-6 pt-6">
              {prevProj ? (
                <Link 
                  to={`/projects/${prevProj.slug || prevProj.id}`} 
                  className="flex-1 group relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-950/30 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-slate-700/20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <div className="flex items-center gap-4 relative z-10">
                    <FaArrowLeft className={`text-lg text-slate-500 group-hover:text-slate-300 transition-colors ${isArabic ? 'rotate-180' : ''}`} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{isAr ? 'المشروع السابق' : 'Previous Project'}</p>
                      <h4 className="font-bold text-slate-200 group-hover:text-white truncate max-w-[200px] transition-colors">{prevProj.title}</h4>
                    </div>
                  </div>
                </Link>
              ) : <div className="flex-1" />}

              {nextProj ? (
                <Link 
                  to={`/projects/${nextProj.slug || nextProj.id}`} 
                  className="flex-1 group relative overflow-hidden bg-gradient-to-br from-slate-900/60 to-slate-950/30 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-xl text-right"
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-slate-700/20 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  <div className="flex items-center justify-end gap-4 relative z-10">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{isAr ? 'المشروع التالي' : 'Next Project'}</p>
                      <h4 className="font-bold text-slate-200 group-hover:text-white truncate max-w-[200px] transition-colors">{nextProj.title}</h4>
                    </div>
                    <FaArrowRight className={`text-lg text-slate-500 group-hover:text-slate-300 transition-colors ${isArabic ? 'rotate-180' : ''}`} />
                  </div>
                </Link>
              ) : <div className="flex-1" />}
            </nav>
              ) : <div className="flex-1" />}
            </nav>

          </article>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Project Info Card - Enhanced */}
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-7 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-slate-700/20 to-transparent rounded-full blur-3xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5 relative z-10">
                  <h4 className="font-bold text-white text-lg">{isAr ? 'بطاقة المشروع' : 'Project Details'}</h4>
                  <div className={`w-3 h-3 rounded-full shadow-lg ${project.link ? 'bg-green-500 shadow-green-500/50' : 'bg-amber-500 shadow-amber-500/50'} animate-pulse`} />
                </div>

                <ul className="space-y-5 text-sm relative z-10">
                  {project.client && (
                    <li className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">{isAr ? 'العميل' : 'Client'}</span>
                      <span className="text-slate-200 font-semibold">{project.client}</span>
                    </li>
                  )}
                  {project.date && (
                    <li className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium flex items-center gap-2">
                        <FaCalendarAlt className="text-xs opacity-60" /> {isAr ? 'التاريخ' : 'Date'}
                      </span>
                      <span className="text-slate-200 font-semibold">{new Date(project.date).getFullYear()}</span>
                    </li>
                  )}
                  {project.category && (
                    <li className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">{isAr ? 'القطاع' : 'Sector'}</span>
                      <span className="text-slate-200 font-semibold">{project.category}</span>
                    </li>
                  )}
                  <li className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">{isAr ? 'النوع' : 'Type'}</span>
                    <span className="text-slate-200 font-semibold">{project.type || 'Web Application'}</span>
                  </li>
                </ul>
              </div>

              {/* Quick Stats */}
              {project.stats && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all">
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{value}</p>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Call to Action - Enhanced */}
              <div className="relative overflow-hidden rounded-2xl p-7 border border-white/10 backdrop-blur-xl group cursor-pointer hover:border-white/20 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundColor: cfg.colorHex }} />
                
                <div className="relative z-10">
                  <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-lg">{isAr ? '💡' : '🚀'}</span>
                    {isAr ? 'هل أعجبك المشروع؟' : 'Ready to collaborate?'}
                  </h5>
                  <p className="text-sm text-slate-300 mb-5 leading-relaxed">{isAr ? 'تواصل معي لبناء مشروعك القادم أو مناقشة فرصة جديدة.' : 'Let\'s discuss your next project or opportunity.'}</p>
                  <Link 
                    to="/contact" 
                    className="block w-full text-center py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-white/20 hover:border-white/40 rounded-lg text-white font-semibold transition-all transform hover:scale-105 active:scale-95"
                  >
                    {isAr ? 'ابدأ محادثة' : 'Start Conversation'}
                  </Link>
                </div>
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