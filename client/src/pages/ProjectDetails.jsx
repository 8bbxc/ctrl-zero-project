import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, 
  FaTimes, FaExpand, FaHospital, FaShoppingCart, FaUtensils, 
  FaBuilding, FaGraduationCap, FaHome, FaArrowDown
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'

// Sector Icon & Color Mapping
const SECTOR_ICON_MAP = {
  Medical: FaHospital,
  'E-Commerce': FaShoppingCart,
  Restaurant: FaUtensils,
  Corporate: FaBuilding,
  Education: FaGraduationCap,
  'Real Estate': FaHome
}

const SECTOR_CONFIG = {
  Medical: { 
    colorHex: '#fb7185', 
    colorClass: 'text-rose-400',
    gradient: 'from-rose-500 via-pink-500 to-red-600',
    light: 'from-rose-500/20 via-pink-500/20 to-red-600/20',
    shadow: 'shadow-rose-500/30'
  },
  'E-Commerce': { 
    colorHex: '#34d399', 
    colorClass: 'text-emerald-400',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    light: 'from-emerald-500/20 via-teal-500/20 to-cyan-600/20',
    shadow: 'shadow-emerald-500/30'
  },
  Restaurant: { 
    colorHex: '#fb923c', 
    colorClass: 'text-orange-400',
    gradient: 'from-orange-500 via-amber-500 to-yellow-600',
    light: 'from-orange-500/20 via-amber-500/20 to-yellow-600/20',
    shadow: 'shadow-orange-500/30'
  },
  Corporate: { 
    colorHex: '#60a5fa', 
    colorClass: 'text-blue-400',
    gradient: 'from-blue-500 via-cyan-500 to-indigo-600',
    light: 'from-blue-500/20 via-cyan-500/20 to-indigo-600/20',
    shadow: 'shadow-blue-500/30'
  },
  Education: { 
    colorHex: '#a78bfa', 
    colorClass: 'text-purple-400',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    light: 'from-purple-500/20 via-violet-500/20 to-fuchsia-600/20',
    shadow: 'shadow-purple-500/30'
  },
  'Real Estate': { 
    colorHex: '#06b6d4', 
    colorClass: 'text-cyan-400',
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    light: 'from-cyan-500/20 via-sky-500/20 to-blue-600/20',
    shadow: 'shadow-cyan-500/30'
  }
}

const defaultProject = {
  title: 'Showcase Project',
  category: 'Corporate',
  description: 'A comprehensive digital solution engineered for excellence and innovation.',
  fullContent: `This is a showcase project demonstrating our full-stack capabilities. Built with modern technologies and best practices, it represents our commitment to delivering scalable, high-performance solutions.\n\nOur approach focuses on user experience, performance optimization, and maintainability. Every line of code is crafted with precision to ensure your system operates flawlessly.\n\nKey achievements:\n• 40% performance improvement\n• Seamless user interactions\n• Enterprise-grade reliability\n• Scalable architecture`,
  image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933',
  tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
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
  const [activeTab, setActiveTab] = useState('about')

  useEffect(() => {
    let mounted = true
    const fetchProject = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/projects/${slug}`).catch(() => null)
        const proj = (res?.data) ? res.data : { ...defaultProject }
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
        const all = Array.isArray(res.data) ? res.data : (res.data?.items || [])
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
    <div className="min-h-screen bg-[#030305] flex items-center justify-center">
      <Spinner />
    </div>
  )

  if (!project) return null

  const cfg = SECTOR_CONFIG[project.category] || SECTOR_CONFIG['Corporate']
  const SectorIcon = SECTOR_ICON_MAP[project.category] || FaBuilding

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ============ DYNAMIC BACKGROUND ============ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient Blobs */}
        <div className={`absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full opacity-20 blur-[150px] bg-gradient-to-br ${cfg.gradient}`} />
        <div className={`absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full opacity-15 blur-[120px] bg-gradient-to-tr ${cfg.gradient}`} />
        
        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* ============ HERO SECTION ============ */}
      <header className="relative pt-24 pb-12 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:border-slate-600 transition-all backdrop-blur-sm"
            >
              <FaArrowLeft className={isAr ? 'rotate-180' : ''} />
              {isAr ? 'جميع المشاريع' : 'Back to Projects'}
            </Link>
          </motion.div>

          {/* Hero Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            
            {/* ===== LEFT: HERO IMAGE (60% width) ===== */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="relative group">
                {/* Image Container with Border Animation */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 group-hover:border-slate-600 transition-all duration-500 shadow-2xl">
                  <div className="aspect-video w-full overflow-hidden">
                    <motion.img 
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                      src={project.image || defaultProject.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40`} />
                  
                  {/* Play Button Overlay (if has link) */}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <FaExternalLinkAlt className="text-white text-xl" />
                      </div>
                    </a>
                  )}
                </div>

                {/* Floating Sector Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute -bottom-6 left-6 px-6 py-3 rounded-xl bg-gradient-to-r ${cfg.gradient} text-white font-bold text-sm uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-white/20`}
                >
                  <SectorIcon className="text-lg" />
                  {isAr ? 'مشروع ' : ''}{project.category}
                </motion.div>
              </div>
            </motion.div>

            {/* ===== RIGHT: HERO TEXT (40% width) ===== */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 pt-6"
            >
              <div className="space-y-8">
                {/* Category & Year */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {new Date(project.date).getFullYear()}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-black leading-[1.1] text-white mb-4"
                  >
                    {project.title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-slate-300 leading-relaxed"
                >
                  {project.description}
                </motion.p>

                {/* Tech Stack Quick View */}
                {project.tags && project.tags.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 border-t border-slate-700"
                  >
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
                      {isAr ? 'التقنيات' : 'Tech Stack'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-slate-400">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3 pt-4"
                >
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${cfg.gradient} hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
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
                      className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-slate-100 font-bold hover:bg-slate-800/50 transition-all"
                    >
                      {isAr ? 'الكود' : 'Code'}
                      <FaGithub className="text-lg" />
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ============ SCROLL INDICATOR ============ */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex justify-center py-8 text-slate-500"
      >
        <FaArrowDown className="text-xl animate-pulse" />
      </motion.div>

      {/* ============ CONTENT SECTION ============ */}
      <main className="relative z-20 pt-12 pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-slate-800/40 border border-slate-700 rounded-full p-1">
              {['about', 'tech', 'gallery'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'about' && (isAr ? 'حول المشروع' : 'About')}
                  {tab === 'tech' && (isAr ? 'التقنيات' : 'Tech Stack')}
                  {tab === 'gallery' && (isAr ? 'المعرض' : 'Gallery')}
                </button>
              ))}
            </div>
          </div>

          {/* Content Tabs */}
          <AnimatePresence mode="wait">
            {/* About Tab */}
            {activeTab === 'about' && (
              <motion.div 
                key="about"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid lg:grid-cols-3 gap-8"
              >
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-800/40 rounded-2xl p-8 md:p-10 border border-slate-700 backdrop-blur-sm">
                    <h2 className={`text-3xl font-bold mb-6 bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                      {isAr ? 'عن المشروع' : 'Project Overview'}
                    </h2>
                    <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
                      {(project.fullContent || project.description).split('\n').map((line, idx) => (
                        <p key={idx} className="text-lg leading-relaxed">
                          {line.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                  <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700 backdrop-blur-sm">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
                      {isAr ? 'معلومات المشروع' : 'Project Info'}
                    </p>
                    <div className="space-y-4">
                      {project.category && (
                        <div className="pb-4 border-b border-slate-700/50">
                          <p className="text-xs text-slate-500 mb-1">{isAr ? 'القطاع' : 'Sector'}</p>
                          <p className={`font-bold ${cfg.colorClass}`}>{project.category}</p>
                        </div>
                      )}
                      {project.date && (
                        <div className="pb-4 border-b border-slate-700/50">
                          <p className="text-xs text-slate-500 mb-1">{isAr ? 'التاريخ' : 'Date'}</p>
                          <p className="text-slate-100 font-semibold">{new Date(project.date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {project.link && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">{isAr ? 'الرابط' : 'Live URL'}</p>
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-cyan-400 hover:text-cyan-300 break-all"
                          >
                            {project.link.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === 'tech' && project.tags && project.tags.length > 0 && (
              <motion.div 
                key="tech"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-800/40 rounded-2xl p-8 md:p-10 border border-slate-700 backdrop-blur-sm"
              >
                <h2 className={`text-3xl font-bold mb-8 bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                  {isAr ? 'المكتبات والأدوات' : 'Technologies & Tools'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.tags.map((tag, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-600 hover:border-slate-500 transition-all"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${cfg.gradient}`} />
                      <span className="font-semibold text-slate-200">{tag}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <motion.div 
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {project.gallery && project.gallery.length > 0 ? (
                  <div>
                    <h2 className={`text-3xl font-bold mb-8 bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                      {isAr ? 'معرض الصور' : 'Project Gallery'}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.gallery.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                          onClick={() => setSelectedImage(img)}
                        >
                          <img 
                            src={img} 
                            alt={`Gallery ${idx + 1}`} 
                            className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FaExpand className="text-white text-3xl" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-slate-400 text-lg">{isAr ? 'لا توجد صور في المعرض' : 'No gallery images available'}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ============ NAVIGATION CARDS ============ */}
      <section className="relative z-20 border-t border-slate-700 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-slate-300 mb-8">{isAr ? 'مشاريع أخرى' : 'More Projects'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {prevProj ? (
              <Link 
                to={`/projects/${prevProj.slug || prevProj.id}`}
                className="group bg-slate-800/40 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-4">
                  <FaArrowLeft className={`text-2xl text-slate-500 group-hover:text-slate-300 transition-colors ${isAr ? 'rotate-180' : ''}`} />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'المشروع السابق' : 'Previous'}</p>
                    <p className="text-slate-100 font-semibold group-hover:text-white truncate">{prevProj.title}</p>
                  </div>
                </div>
              </Link>
            ) : <div />}
            
            {nextProj ? (
              <Link 
                to={`/projects/${nextProj.slug || nextProj.id}`}
                className="group bg-slate-800/40 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:bg-slate-800/60 text-right"
              >
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex-1 text-left">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">{isAr ? 'المشروع التالي' : 'Next'}</p>
                    <p className="text-slate-100 font-semibold group-hover:text-white truncate">{nextProj.title}</p>
                  </div>
                  <FaArrowRight className={`text-2xl text-slate-500 group-hover:text-slate-300 transition-colors ${isAr ? 'rotate-180' : ''}`} />
                </div>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* ============ IMAGE LIGHTBOX ============ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)} 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition z-10 p-2"
            >
              <FaTimes size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
