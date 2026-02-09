import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaExternalLinkAlt, FaImages, FaLaptopCode, FaTags, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'

export default function ProjectDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        // Try fetching by slug first, then ID logic handled by backend usually
        // Or fetch all and find (if backend doesn't support slug directly yet)
        const res = await api.get(`/projects/${slug}`)
        setProject(res.data)
        setActiveImage(res.data.image) // Set main image as active initially
      } catch (err) {
        console.error('Failed to fetch project details:', err)
        // Optional: navigate to 404
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Spinner /></div>

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
      <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
      <Link to="/projects" className="px-6 py-3 bg-white text-black rounded-full font-bold">Back to Portfolio</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- 1. Cinematic Hero (Full Width) --- */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div className="absolute inset-0 z-0">
          {activeImage ? (
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={activeImage} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <FaLaptopCode className="text-9xl text-slate-800" />
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-black/20" /> {/* Dimmer */}
        </div>

        {/* Navigation & Title Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between container mx-auto px-6 py-24 md:py-32">
          
          {/* Back Button */}
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
              {isArabic ? 'رجوع' : 'Back'}
            </button>
          </div>

          {/* Title Block */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
               {project.category && (
                 <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                   {project.category}
                 </span>
               )}
               {project.createdAt && (
                 <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                   <FaCalendarAlt /> {new Date(project.createdAt).getFullYear()}
                 </span>
               )}
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-4">
              {project.link && (
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {isArabic ? 'زيارة الموقع' : 'Visit Live Site'} <FaExternalLinkAlt className="text-sm" />
                </a>
              )}
              
              <button 
                onClick={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-md"
              >
                {isArabic ? 'تفاصيل المشروع' : 'Project Details'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- 2. Main Content Layout --- */}
      <div id="details" className="container mx-auto px-6 py-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Description & Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-4">
                {isArabic ? 'نظرة عامة' : 'Overview'}
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-light">
                {project.description}
              </p>
            </motion.div>

            {/* Gallery Grid */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaImages className="text-cyan-500" /> {isArabic ? 'معرض الصور' : 'Project Gallery'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Main Image included in gallery grid for completeness */}
                  <div 
                    onClick={() => setActiveImage(project.image)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all h-64 ${activeImage === project.image ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={project.image} alt="Main" className="w-full h-full object-cover" />
                  </div>

                  {project.gallery.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all h-64 ${activeImage === img ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Tech Stack Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24"
            >
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaLaptopCode className="text-cyan-500" /> {isArabic ? 'التقنيات المستخدمة' : 'Tech Stack'}
              </h4>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-cyan-300">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No specific tags listed.</span>
                )}
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <h5 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Key Features</h5>
                <ul className="space-y-3">
                  {/* This is dynamic if you have features in DB, otherwise static example */}
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Responsive & Mobile-First Design</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                    <span>High Performance & SEO Optimized</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                    <span>Secure & Scalable Architecture</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                 <Link to="/contact" className="block w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-center transition-colors">
                   {isArabic ? 'اطلب مشروع مشابه' : 'Request Similar Project'}
                 </Link>
              </div>

            </motion.div>

          </div>

        </div>
      </div>

    </div>
  )
}