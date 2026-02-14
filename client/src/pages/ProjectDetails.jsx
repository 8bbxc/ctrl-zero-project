import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, 
  FaTimes, FaExpand, FaHospital, FaShoppingCart, FaUtensils, 
  FaBuilding, FaGraduationCap, FaHome, FaImage, FaStar, FaFire, FaRocket
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
    shadow: 'shadow-rose-500/30'
  },
  'E-Commerce': { 
    colorHex: '#34d399', 
    colorClass: 'text-emerald-400',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    shadow: 'shadow-emerald-500/30'
  },
  Restaurant: { 
    colorHex: '#fb923c', 
    colorClass: 'text-orange-400',
    gradient: 'from-orange-500 via-amber-500 to-yellow-600',
    shadow: 'shadow-orange-500/30'
  },
  Corporate: { 
    colorHex: '#60a5fa', 
    colorClass: 'text-blue-400',
    gradient: 'from-blue-500 via-cyan-500 to-indigo-600',
    shadow: 'shadow-blue-500/30'
  },
  Education: { 
    colorHex: '#a78bfa', 
    colorClass: 'text-purple-400',
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    shadow: 'shadow-purple-500/30'
  },
  'Real Estate': { 
    colorHex: '#06b6d4', 
    colorClass: 'text-cyan-400',
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
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
  
  // Check if this is a featured project (hotel booking)
  const isFeatured = project.slug && project.slug.includes('mern-hotel')
  
  // Combine main image with gallery for full gallery view
  const allImages = [project.image, ...(project.gallery || [])].filter(Boolean)
  const mainImageIndex = 0

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ============ DYNAMIC BACKGROUND ============ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] rounded-full opacity-20 blur-[150px] bg-gradient-to-br ${cfg.gradient}`} />
        <div className={`absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full opacity-15 blur-[120px] bg-gradient-to-tr ${cfg.gradient}`} />
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

          {/* Hero Content */}
          <div className="space-y-8">
            
            {/* Featured Badge - Only for Hotel Project */}
            {isFeatured && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-bold"
              >
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <FaFire className="text-lg" />
                </motion.div>
                <span>{isAr ? '⭐ مشروع مميز' : '⭐ Featured Project'}</span>
                <FaRocket className="text-lg" />
              </motion.div>
            )}
            
            {/* Main Hero Image - Full Width & Strong */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${cfg.gradient} p-[2px]`}>
                <div className="relative rounded-[26px] overflow-hidden bg-slate-950">
                  <motion.img 
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src={project.image || defaultProject.image} 
                    alt={project.title} 
                    onClick={() => setSelectedImage(project.image)}
                    className="w-full h-96 sm:h-[500px] lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  {/* Expand Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <FaExpand className="text-white text-3xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Sector Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`absolute -bottom-6 left-8 px-6 py-3 rounded-2xl bg-gradient-to-r ${cfg.gradient} text-white font-bold text-sm uppercase tracking-wider shadow-2xl flex items-center gap-2 border border-white/20`}
              >
                <SectorIcon className="text-lg" />
                {isAr ? 'مشروع ' : ''}{project.category}
              </motion.div>
            </motion.div>

            {/* Title & Info Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pt-12 space-y-8"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {new Date(project.date || new Date()).getFullYear()}
                  </span>
                </div>

                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-4 ${
                    isFeatured 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500' 
                      : 'text-white'
                  }`}
                >
                  {project.title}
                </motion.h1>

                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              {project.tags && project.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">
                    {isAr ? 'التقنيات المستخدمة' : 'Tech Stack'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                          isFeatured
                            ? 'bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border border-cyan-500/50 text-cyan-300 hover:border-cyan-400'
                            : 'bg-slate-800/60 border border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {project.link && (
                  <motion.a 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r ${cfg.gradient} hover:shadow-2xl transition-all duration-300`}
                  >
                    {isAr ? 'زيارة المشروع' : 'View Live'}
                    <FaExternalLinkAlt className="text-sm" />
                  </motion.a>
                )}
                {(project.repo || project.github) && (
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.repo || project.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-600 text-slate-100 font-bold hover:bg-slate-800/50 transition-all"
                  >
                    {isAr ? 'الكود' : 'View Code'}
                    <FaGithub className="text-lg" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ============ CONTENT SECTION ============ */}
      <main className="relative z-20 pt-12 pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">

          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-800/40 rounded-2xl p-8 md:p-12 border border-slate-700 backdrop-blur-sm"
          >
            <h2 className={`text-3xl font-bold mb-8 bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
              {isAr ? 'عن المشروع' : 'Project Overview'}
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
              {(project.fullContent || project.description).split('\n').map((line, idx) => (
                line.trim() && <p key={idx} className="text-lg leading-relaxed">{line.trim()}</p>
              ))}
            </div>
          </motion.div>

          {/* Gallery Section - Only show if has images */}
          {allImages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FaImage className={`text-2xl ${cfg.colorClass}`} />
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                    {isAr ? 'معرض المشروع' : 'Project Gallery'}
                  </h2>
                </div>
                <p className="text-slate-400 text-sm">{isAr ? 'اضغط على أي صورة لتكبيرها' : 'Click any image to expand'}</p>
              </div>

              {/* Gallery Grid - Enhanced for Hotel Project */}
              <div className={`grid gap-6 ${isFeatured ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {allImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -8 }}
                    className={`group relative rounded-xl overflow-hidden bg-slate-900 border transition-all cursor-pointer ${
                      isFeatured 
                        ? `border-cyan-500/30 hover:border-cyan-400 ${
                            idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                          }`
                        : `border-slate-700 hover:border-slate-600 ${
                            idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                          }`
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <motion.img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`}
                      className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                        idx === 0 ? 'h-[400px]' : 'h-64'
                      }`}
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                          isFeatured
                            ? 'bg-cyan-500/30 border-cyan-400'
                            : 'bg-white/20 border-white/30'
                        }`}
                      >
                        <FaExpand className="text-white text-2xl" />
                      </motion.div>
                    </div>

                    {/* Image Counter Badge */}
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-white text-xs font-bold backdrop-blur-sm ${
                        isFeatured
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                          : 'bg-black/60'
                      }`}
                    >
                      {idx + 1}/{allImages.length}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* ============ NAVIGATION ============ */}
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
