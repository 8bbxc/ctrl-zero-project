import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaSearch, FaLaptopCode, FaImages } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import SectorCards from '../components/SectorCards'

export default function Projects() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects')
        
        let dataToUse = []
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          dataToUse = res.data
        } else if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          dataToUse = res.data.items
        }

        if (dataToUse.length > 0) {
          // Process data to ensure consistent structure
          const realProjects = dataToUse.map(p => ({
            ...p,
            // Ensure tags is always an array
            tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : ['Development'])
          }))
          setProjects(realProjects)
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

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

        {/* Sector Navigation - The Premium Filter System */}
        <SectorCards selectedSector={'All'} onSectorChange={() => {}} />

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Spinner /></div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {projects.map((project, idx) => (
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

        {projects.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <FaSearch className="text-3xl text-slate-600" />
            </div>
            <p className="text-lg">No projects found.</p>
          </div>
        )}

      </div>
    </div>
  )
}