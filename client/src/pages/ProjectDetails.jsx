import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaCalendarAlt, FaLayerGroup, FaTimes, FaExpand } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api' // تأكد من المسار الصحيح

export default function ProjectDetails() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isRtl = dir === 'rtl'
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null) // حالة الصور المكبرة (Lightbox)

  // بيانات افتراضية "فخمة" للعرض
  const defaultProject = {
    title: 'Nova Fintech Dashboard',
    description: 'A revolutionary financial platform allowing users to track assets in real-time. We focused on performance and security.',
    fullContent: `This project was built to solve a critical problem in the fintech space: data latency. \n\nWe utilized WebSockets for real-time updates and Redis for caching, reducing load times by 40%. The UI is designed with a "Dark Mode First" approach to reduce eye strain for traders working late hours.\n\nKey challenges included handling thousands of concurrent connections and visualizing complex datasets using D3.js.`,
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933',
    tags: ['React', 'Node.js', 'Redis', 'D3.js', 'PostgreSQL'],
    link: 'https://example.com',
    repo: 'https://github.com',
    date: '2025',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
      'https://images.unsplash.com/photo-1558002038-109155714d9a?q=80&w=2070',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
      'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1920',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
      'https://images.unsplash.com/photo-1558002038-109155714d9a?q=80&w=2070'
    ]
  }

  useEffect(() => {
    const fetchProject = async () => {
        try {
            // نحاول الجلب بالـ ID أو Slug
            // إذا كان slug نصياً، قد تحتاج لتعديل الـ Backend للبحث بـ Slug
            // هنا نفترض أن الـ Backend جاهز أو نستخدم الافتراضي
            const res = await api.get(`/projects/${slug}`).catch(() => null)
            
            if (res && res.data) {
                setProject(res.data)
            } else {
                setProject({ ...defaultProject, title: slug.replace(/-/g, ' ').toUpperCase() })
            }
        } catch (err) {
            setProject(defaultProject)
        } finally {
            setLoading(false)
        }
    }
    fetchProject()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!project) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black">
      
      {/* --- Lightbox Overlay (عرض الصور بملء الشاشة) --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition p-2 z-10">
                <FaTimes size={30} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} // منع إغلاق الـ lightbox عند الضغط على الصورة نفسها
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Cinematic Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={project.image || '/images/placeholder.jpg'} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/60 to-slate-950" />
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
          <div className="container mx-auto">
            <Link to="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
              {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform"/> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform"/>}
              <span className="uppercase tracking-widest text-xs font-bold">{t('nav.projects') || 'BACK TO PROJECTS'}</span>
            </Link>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight max-w-4xl"
            >
              {project.title}
            </motion.h1>
            
            <motion.div 
                initial={{ y: 30, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4"
            >
                <span className="px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-bold tracking-wide backdrop-blur-md">
                    FEATURED PROJECT
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-2">
                    <FaCalendarAlt /> {project.date ? new Date(project.date).getFullYear() : '2025'}
                </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Layout */}
      <div className="container mx-auto px-6 md:px-12 py-20 relative z-20 -mt-10">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Left Column: Content & Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* The Story / Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full"></span>
                The Challenge & Solution
              </h3>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-lg">
                {project.fullContent || project.description}
              </div>
            </motion.div>

            {/* --- The Premium Gallery (Bento Grid - Clean & Uniform) --- */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-end justify-between border-b border-white/10 pb-4">
                    <h3 className="text-3xl font-bold text-white">Project Gallery</h3>
                    <span className="text-slate-500 text-sm">{project.gallery.length} SHOTS</span>
                </div>
                
                {/* التعديل هنا: شبكة منتظمة (3 أعمدة للشاشات المتوسطة فما فوق، 2 للصغيرة) مع نسبة عرض إلى ارتفاع ثابتة */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.gallery.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      // استخدام aspect-video لتوحيد أبعاد الصور (مستطيلات متناسقة)
                      className="relative group overflow-hidden rounded-2xl cursor-zoom-in border border-white/5 aspect-video"
                      onClick={() => setSelectedImage(img)}
                    >
                      <div className="absolute inset-0 bg-slate-900 animate-pulse" /> {/* Placeholder loading */}
                      <img 
                        src={img} 
                        alt={`Project Shot ${idx}`} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110" 
                      />
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                            <FaExpand size={18} />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              
              {/* Project Details Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
              >
                {/* Decorative blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>

                <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <FaLayerGroup className="text-accent" /> Project Info
                </h4>
                
                <div className="space-y-6">
                  {/* Category / Type (Optional) */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                     <span className="text-slate-500 text-sm font-mono uppercase">Client / Type</span>
                     <span className="text-white font-medium">Portfolio</span>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <span className="text-slate-500 text-sm font-mono uppercase block mb-3">Technologies</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tags && project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-slate-300 font-mono transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="pt-6 flex flex-col gap-3">
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/20"
                      >
                        <FaExternalLinkAlt /> Visit Live Site
                      </a>
                    )}
                    {(project.repo || project.github) && (
                      <a 
                        href={project.repo || project.github} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full py-3.5 bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-slate-700 transition border border-white/5"
                      >
                        <FaGithub size={18} /> View Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 p-6 rounded-3xl text-center">
                <h5 className="text-white font-bold mb-2">Build something similar?</h5>
                <p className="text-sm text-slate-400 mb-4">Let's discuss how we can engineer a solution for you.</p>
                <Link to="/contact" className="text-accent text-sm font-bold tracking-wider hover:text-white transition">START A PROJECT &rarr;</Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}