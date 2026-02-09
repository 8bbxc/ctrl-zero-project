import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaSearch, FaLaptopCode, FaImages } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function Projects() {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  // بيانات افتراضية "فخمة" للعرض في حال كانت قاعدة البيانات فارغة أو فشل الاتصال
  const defaultProjects = [
    {
      id: 'crypto-dashboard',
      title: 'Crypto Nexus',
      slug: 'crypto-nexus',
      description: 'A real-time cryptocurrency trading dashboard with live charts, AI-driven predictions, and secure wallet integration.',
      image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=1933',
      tags: ['React', 'Node.js', 'Socket.io', 'Tailwind'],
      category: 'Web App',
      gallery: [1, 2, 3]
    },
    {
      id: 'health-ai',
      title: 'MediScan AI',
      slug: 'mediscan-ai',
      description: 'Mobile application using Computer Vision to analyze skin conditions and provide preliminary medical advice.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
      tags: ['React Native', 'Python', 'TensorFlow', 'FastAPI'],
      category: 'Mobile App',
      gallery: [1, 2]
    },
    {
      id: 'ecommerce-pro',
      title: 'Luxe Market',
      slug: 'luxe-market',
      description: 'High-performance e-commerce platform with 3D product previews and headless CMS architecture.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
      tags: ['Next.js', 'Stripe', 'Sanity', 'Three.js'],
      category: 'E-Commerce',
      gallery: [1, 2, 3, 4]
    }
  ]

  // جلب البيانات
  useEffect(() => {
    const fetchProjects = async () => {
      // Set timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn("API request timeout, using default projects")
        setProjects(defaultProjects)
        setFilteredProjects(defaultProjects)
        setLoading(false)
      }, 5000)

      try {
        const res = await api.get('/projects')
        clearTimeout(timeoutId)
        
        let dataToUse = []
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          dataToUse = res.data
        } else if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          dataToUse = res.data.items
        }

        if (dataToUse.length > 0) {
          // معالجة البيانات وتوحيد الهيكل
          const realProjects = dataToUse.map(p => ({
            ...p,
            // تحديد التصنيف بناءً على التاغز إذا لم يكن موجوداً
            category: p.category || 'Web App', 
            // ضمان أن التاغز مصفوفة دائماً
            tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : ['Development'])
          }))
          setProjects(realProjects)
          setFilteredProjects(realProjects)
        } else {
          setProjects(defaultProjects)
          setFilteredProjects(defaultProjects)
        }
      } catch (err) {
        console.error("Using default projects due to error:", err)
        setProjects(defaultProjects)
        setFilteredProjects(defaultProjects)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // منطق الفلترة
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => 
        (p.category && p.category === activeFilter) || 
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()) || tag === activeFilter))
      ))
    }
  }, [activeFilter, projects])

  // القوائم (يمكنك تعديلها حسب الحاجة)
  const filters = ['All', 'Web App', 'Mobile App', 'E-Commerce', 'IoT', 'AI']

  return (
    <div className="min-h-screen py-20 relative overflow-hidden bg-slate-950 text-slate-50 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-accent font-mono text-xs uppercase tracking-[0.2em] mb-3 block">
            {t('projects.portfolio') || 'PORTFOLIO'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
            {t('projects.title') || 'Selected Works'}
            <span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-slate-400 font-light">
            {t('projects.subtitle') || 'Discover how we turn complex problems into elegant digital solutions through code and design.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-1.5 rounded-full flex flex-wrap justify-center gap-1 shadow-lg">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeFilter === filter ? 'text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-accent rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t(`projects.filters.${filter.toLowerCase().replace(' ', '')}`) || filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Spinner /></div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  key={project.id || idx}
                  className="group"
                >
                  {/* Card Container */}
                  <div className="h-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 flex flex-col group-hover:-translate-y-2">
                    
                    {/* Image Area - Aspect Video for consistency */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-slate-900/40 transition-colors duration-500" />
                      
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaLaptopCode className="text-5xl text-slate-700 group-hover:text-slate-500 transition-colors" />
                        </div>
                      )}

                      {/* Badge: Gallery Count */}
                      {project.gallery && project.gallery.length > 0 && (
                        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white flex items-center gap-1 border border-white/10">
                           <FaImages /> {project.gallery.length}
                        </div>
                      )}

                      {/* Floating Actions */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                         {/* View Details */}
                         <Link 
                           to={`/projects/${project.slug || project.id}`}
                           className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shadow-lg"
                           title="View Project"
                         >
                            <FaSearch />
                         </Link>
                         
                         {/* Live Link */}
                         {project.link && (
                           <a 
                             href={project.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black hover:scale-110 transition-all shadow-lg"
                             title="Visit Live Site"
                           >
                              <FaExternalLinkAlt />
                           </a>
                         )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors truncate w-full">{project.title}</h3>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-xs font-mono text-slate-300 group-hover:border-white/10 transition-colors">
                            #{tag}
                          </span>
                        ))}
                        {project.tags && project.tags.length > 3 && (
                            <span className="px-2 py-1.5 text-xs text-slate-500 font-mono">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <FaSearch className="text-3xl text-slate-600" />
            </div>
            <p className="text-lg">No projects found in this category.</p>
            <button onClick={() => setActiveFilter('All')} className="text-accent hover:underline mt-2 font-bold">Clear filters</button>
          </div>
        )}

      </div>
    </div>
  )
}