import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaImages, FaLaptopCode, FaTags, FaCalendarAlt, FaCheckCircle, FaGithub } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ProjectDetails() {
  // 1. Logic: Hooks & State
  const { slug } = useParams() // Get ID or Slug from URL
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(null) // For Gallery Interaction

  // 2. Logic: Fetch Data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        // Fetch project by ID or Slug
        const res = await api.get(`/projects/${slug}`)
        const data = res.data
        
        setProject(data)
        // Set initial active image (Cover image)
        setActiveImage(data.image) 
      } catch (err) {
        console.error('Failed to fetch project details:', err)
        // Optional: Redirect to 404 or show error state
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  // 3. Logic: Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Spinner />
    </div>
  )

  // 4. Logic: Error/Empty State
  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
      <h2 className="text-3xl font-bold mb-4">{t('Project Not Found')}</h2>
      <Link to="/projects" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors">
        {t('Back to Portfolio')}
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- UI: Cinematic Hero Section (Full Width) --- */}
      <div className="relative h-[60vh] md:h-[80vh] w-full bg-slate-900">
        
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {activeImage ? (
            <motion.img 
              key={activeImage} // Key change triggers animation
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={activeImage} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center opacity-30">
                <FaLaptopCode className="text-9xl text-slate-700" />
             </div>
          )}
          {/* Gradient Overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between container mx-auto px-6 py-24 md:py-20">
          
          {/* Back Navigation */}
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 group text-sm font-bold uppercase tracking-wider"
            >
              {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />}
              {t('Back')}
            </button>
          </div>

          {/* Project Title & Meta */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-5xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
               {/* Category Badge */}
               {project.category && (
                 <span className="px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                   {project.category}
                 </span>
               )}
               {/* Date */}
               {project.createdAt && (
                 <span className="flex items-center gap-2 text-slate-300 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                   <FaCalendarAlt className="text-slate-400" /> {new Date(project.createdAt).getFullYear()}
                 </span>
               )}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
              {project.title}
            </h1>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)] text-sm md:text-base"
                >
                  {isRtl ? 'زيارة الموقع' : 'Visit Live Site'} {isRtl ? <FaArrowLeft /> : <FaArrowRight />}
                </a>
              )}
              
              {/* Optional: Add GitHub Link if exists in your data model */}
              {project.github && (
                 <a 
                   href={project.github}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-8 py-4 bg-black/50 text-white border border-white/20 font-bold rounded-full flex items-center gap-2 hover:bg-white hover:text-black transition-all backdrop-blur-md text-sm md:text-base"
                 >
                   <FaGithub className="text-lg" /> {t('View Code')}
                 </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- UI: Content Layout (Grid) --- */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12">
          
          {/* Left Column: Description & Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            
            {/* 1. Project Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 sm:h-8 bg-cyan-500 rounded-full"></span>
                {t('Project Overview')}
              </h3>
              {/* Supports Markdown rendering style text */}
              <div className="text-slate-300 leading-relaxed text-sm sm:text-lg whitespace-pre-wrap font-light">
                {project.content || project.description || "No detailed description available."}
              </div>
            </motion.div>

            {/* 2. Interactive Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2">
                  <FaImages className="text-cyan-500" /> {t('Project Gallery')}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Include Main Image first */}
                  <div 
                    onClick={() => setActiveImage(project.image)}
                    className={`cursor-pointer rounded-lg sm:rounded-2xl overflow-hidden border-2 transition-all h-48 sm:h-64 relative group ${activeImage === project.image ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                  >
                    <img src={project.image} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    {activeImage === project.image && <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />}
                  </div>

                  {/* Other Gallery Images */}
                  {project.gallery.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all h-64 relative group ${activeImage === img ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {activeImage === img && <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Sidebar Info (4 cols) - Sticky */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="sticky top-24 sm:top-28 space-y-6 sm:space-y-8">
              
              {/* 1. Tech Stack Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl"
              >
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <FaLaptopCode className="text-cyan-500" /> {t('Technologies')}
                </h4>
                
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {project.tags && Array.isArray(project.tags) && project.tags.length > 0 ? (
                    project.tags.map((tag, i) => (
                      <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm font-mono text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-default">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic text-xs sm:text-sm">No tags listed.</span>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 sm:pt-6 space-y-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Highlights')}</h5>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm">
                      <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{t('Responsive Design')}</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm">
                      <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{t('High Performance')}</span>
                    </li>
                    {project.category && (
                      <li className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm">
                        <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{project.category} {t('Solution')}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>

              {/* 2. CTA Box */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-xl sm:rounded-3xl p-5 sm:p-8 text-center"
              >
                 <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{t('Need something similar?')}</h4>
                 <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">{t('Let us build a custom solution for your business.')}</p>
                 <Link to="/contact" className="block w-full py-2 sm:py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm sm:text-base">
                   {t('Start a Project')}
                 </Link>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}