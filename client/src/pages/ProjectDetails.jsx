import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaLayerGroup, FaTimes, FaExpand } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'

// Simple sector config for colors & heroes (used for glow and hero fallback)
const SECTOR_CONFIG = {
  Medical: { colorHex: '#fb7185', colorClass: 'text-rose-400' },
  'E-Commerce': { colorHex: '#34d399', colorClass: 'text-emerald-400' },
  Restaurant: { colorHex: '#fb923c', colorClass: 'text-orange-400' },
  Corporate: { colorHex: '#60a5fa', colorClass: 'text-blue-400' },
  Education: { colorHex: '#a78bfa', colorClass: 'text-purple-400' },
  'Real Estate': { colorHex: '#06b6d4', colorClass: 'text-cyan-400' }
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

  // Fetch siblings to compute prev/next
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

  const cfg = SECTOR_CONFIG[project.category] || { colorHex: '#60a5fa', colorClass: 'text-blue-400' }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30">

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer">
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-10"><FaTimes size={28} /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={selectedImage} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <header className="relative h-[60vh] lg:h-[72vh] overflow-hidden">
        <img src={project.image || defaultProject.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/25 via-transparent to-[#050505]/60" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-end">
          <div className="py-12 md:py-20 w-full">
            <p className="text-sm uppercase tracking-wider text-slate-300 mb-2">{isAr ? 'مشروع' : 'Project'}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">{project.title} <span style={{ color: cfg.colorHex }}>.</span></h1>
            <p className="text-lg text-slate-300 max-w-3xl">{project.description}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Details */}
          <article className="lg:col-span-8 space-y-8 bg-transparent">

            {/* Glassy details box */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/8 rounded-2xl p-6 md:p-8 shadow-2xl" style={{ boxShadow: `0 20px 50px ${cfg.colorHex}20` }}>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-full md:w-2/5 rounded-lg overflow-hidden aspect-[16/10]">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${cfg.colorClass}`}>{project.title}</h2>
                  <p className="text-slate-300 mb-4 leading-relaxed">{project.fullContent || project.description}</p>

                  <div className="flex flex-wrap gap-3">
                    {project.tags?.map((t, idx) => (
                      <span key={idx} className="text-[12px] bg-white/4 px-3 py-1 rounded-md text-slate-200">{t}</span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black font-semibold">{isAr ? 'الموقع' : 'Live'} <FaExternalLinkAlt className="text-xs" /></a>}
                    {(project.repo || project.github) && <a href={project.repo || project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/8 text-white">{isAr ? 'المصدر' : 'Code'} <FaGithub /></a>}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">{isAr ? 'معرض المشروع' : 'Project Gallery'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.gallery.map((img, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} viewport={{ once: true }} className="relative overflow-hidden rounded-xl cursor-zoom-in border border-white/6 aspect-video" onClick={() => setSelectedImage(img)}>
                      <img src={img} alt={`Shot ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/10"><FaExpand /></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Prev / Next Navigation */}
            <nav className="mt-8 flex items-center justify-between gap-4">
              {prevProj ? (
                <Link to={`/projects/${prevProj.slug || prevProj.id}`} className="group flex-1 block bg-slate-900/40 backdrop-blur border border-white/8 rounded-2xl p-4 hover:scale-[1.01] transition-transform" style={{ boxShadow: `0 12px 30px ${cfg.colorHex}10` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                      <img src={prevProj.image} alt={prevProj.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{isAr ? 'المشروع السابق' : 'Previous Project'}</p>
                      <h4 className="font-bold text-white">{prevProj.title}</h4>
                    </div>
                    <div className="ml-auto text-slate-400 group-hover:text-white"><FaArrowLeft /></div>
                  </div>
                </Link>
              ) : <div />}

              {nextProj ? (
                <Link to={`/projects/${nextProj.slug || nextProj.id}`} className="group flex-1 block bg-slate-900/40 backdrop-blur border border-white/8 rounded-2xl p-4 hover:scale-[1.01] transition-transform" style={{ boxShadow: `0 12px 30px ${cfg.colorHex}10` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center text-xs text-slate-300">
                      <img src={nextProj.image} alt={nextProj.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{isAr ? 'المشروع التالي' : 'Next Project'}</p>
                      <h4 className="font-bold text-white">{nextProj.title}</h4>
                    </div>
                    <div className="ml-auto text-slate-400 group-hover:text-white"><FaArrowRight /></div>
                  </div>
                </Link>
              ) : <div />}
            </nav>

          </article>

          {/* Right: Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/8 rounded-2xl p-6 shadow-xl" style={{ boxShadow: `0 20px 50px ${cfg.colorHex}20` }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">{isAr ? 'معلومات المشروع' : 'Project Info'}</h4>
                  <span className="text-slate-400 text-sm">{project.date ? new Date(project.date).getFullYear() : ''}</span>
                </div>

                <div className="mb-4">
                  <p className="text-slate-400 text-sm">{project.client || project.type || 'Portfolio'}</p>
                </div>

                <div className="mb-4">
                  <h5 className="text-sm text-slate-400 mb-2 uppercase tracking-wide">{isAr ? 'التقنيات' : 'Technologies'}</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((t, idx) => (
                      <span key={idx} className="text-[12px] bg-white/4 px-2 py-1 rounded-md text-slate-200">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-white text-black text-sm font-semibold">{isAr ? 'الموقع' : 'Live'}<FaExternalLinkAlt /></a>}
                  {(project.repo || project.github) && <a href={project.repo || project.github} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-white/8 text-white text-sm">{isAr ? 'المصدر' : 'Code'}<FaGithub /></a>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 p-6 rounded-2xl text-center">
                <h5 className="text-white font-bold mb-2">{isAr ? 'بناء شيء مشابه؟' : 'Build something similar?'}</h5>
                <p className="text-sm text-slate-400 mb-4">{isAr ? 'دعنا نناقش مشروعك.' : 'Let\'s discuss your project.'}</p>
                <Link to="/contact" className="text-accent text-sm font-bold tracking-wider hover:text-white transition">{isAr ? 'ابدأ مشروع' : 'START A PROJECT'} &rarr;</Link>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}