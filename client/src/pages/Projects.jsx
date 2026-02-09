import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaGithub, FaExternalLinkAlt, FaSearch, FaLaptopCode, FaImages,
  FaStethoscope, FaShoppingCart, FaUtensils, FaBriefcase, FaGraduationCap, FaBuilding, FaGlobe, FaCode
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function Projects() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  // --- تعريف الأقسام (Sectors) ---
  // هذه هي "المربعات" التي ستظهر في الأعلى
  const categories = [
    { id: 'All', label: 'All Projects', icon: <FaGlobe />, desc: 'Explore our full portfolio' },
    { id: 'Medical', label: 'Medical & Health', icon: <FaStethoscope />, desc: 'Clinics, Labs & Hospitals' },
    { id: 'Ecommerce', label: 'E-Commerce', icon: <FaShoppingCart />, desc: 'Online Stores & Retail' },
    { id: 'Restaurant', label: 'Food & Beverage', icon: <FaUtensils />, desc: 'Restaurants & Menus' },
    { id: 'Corporate', label: 'Corporate', icon: <FaBriefcase />, desc: 'Business & Agencies' },
    { id: 'Education', label: 'Education', icon: <FaGraduationCap />, desc: 'LMS & Schools' },
    { id: 'RealEstate', label: 'Real Estate', icon: <FaBuilding />, desc: 'Booking & Properties' },
  ];

  // بيانات افتراضية "فخمة" (Updated to match new categories)
  const defaultProjects = [
    {
      id: 'med-dashboard',
      title: 'CarePlus Clinic',
      slug: 'careplus-clinic',
      description: 'A comprehensive management system for clinics with patient records, appointment booking, and AI diagnosis assistance.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
      tags: ['React', 'Node.js', 'MongoDB'],
      category: 'Medical', // Matches new category
      gallery: [1, 2]
    },
    {
      id: 'shop-pro',
      title: 'Velvet Fashion',
      slug: 'velvet-fashion',
      description: 'High-performance e-commerce platform with 3D product previews and secure payment gateways.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
      tags: ['Next.js', 'Stripe', 'Sanity'],
      category: 'Ecommerce', // Matches new category
      gallery: [1, 2, 3]
    },
    {
      id: 'corp-site',
      title: 'NexGen Agency',
      slug: 'nexgen-agency',
      description: 'A futuristic corporate website for a marketing agency featuring heavy animations and dark mode aesthetic.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069',
      tags: ['React', 'GSAP', 'Tailwind'],
      category: 'Corporate', // Matches new category
      gallery: [1]
    }
  ]

  // جلب البيانات
  useEffect(() => {
    const fetchProjects = async () => {
      const timeoutId = setTimeout(() => {
        setProjects(defaultProjects)
        setFilteredProjects(defaultProjects)
        setLoading(false)
      }, 5000)

      try {
        const res = await api.get('/projects')
        clearTimeout(timeoutId)
        
        let dataToUse = []
        if (Array.isArray(res.data)) dataToUse = res.data
        else if (res.data?.items) dataToUse = res.data.items

        if (dataToUse.length > 0) {
          const realProjects = dataToUse.map(p => ({
            ...p,
            // التأكد من وجود قسم، وإذا لم يوجد نضعه عام
            category: p.category || 'General', 
            tags: Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : [])
          }))
          setProjects(realProjects)
          setFilteredProjects(realProjects)
        } else {
          setProjects(defaultProjects)
          setFilteredProjects(defaultProjects)
        }
      } catch (err) {
        setProjects(defaultProjects)
        setFilteredProjects(defaultProjects)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // منطق الفلترة الجديد (بناءً على القسم)
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeFilter))
    }
  }, [activeFilter, projects])

  return (
    <div className="min-h-screen py-20 relative overflow-hidden bg-slate-950 text-slate-50 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <span className="text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-3 block">
            {t('projects.portfolio') || 'OUR EXPERTISE'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
            Specialized Solutions for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Every Industry</span>
          </h1>
          <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
            Browse our projects by industry sector. We deliver tailored digital experiences that fit your specific business niche.
          </p>
        </div>

        {/* --- New Category Blocks (Grid System) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 group
                ${activeFilter === cat.id 
                  ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105 z-10' 
                  : 'bg-slate-900/40 border-white/5 hover:bg-slate-800 hover:border-white/10'}
              `}
            >
              <div className={`text-3xl mb-3 transition-colors ${activeFilter === cat.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {cat.icon}
              </div>
              <span className={`text-sm font-bold text-center ${activeFilter === cat.id ? 'text-white' : 'text-slate-400'}`}>
                {cat.label}
              </span>
              {/* Optional: Show subtle indicator for active */}
              {activeFilter === cat.id && (
                <div className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center h-64 items-center"><Spinner /></div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id || idx}
                  className="group"
                >
                  {/* Card Container */}
                  <div className="h-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col">
                    
                    {/* Image Area */}
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-slate-900/0 transition-all duration-500" />
                      
                      {/* Category Badge over Image */}
                      <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-400 border border-cyan-500/20 shadow-lg">
                        {project.category}
                      </div>

                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaLaptopCode className="text-5xl text-slate-700" />
                        </div>
                      )}

                      {/* Hover Overlay with Actions */}
                      <div className="absolute inset-0 z-20 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                         <Link 
                           to={`/projects/${project.slug || project.id}`}
                           className="w-12 h-12 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 hover:scale-110 transition-all shadow-lg"
                         >
                            <FaSearch />
                         </Link>
                         {project.link && (
                           <a 
                             href={project.link} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all shadow-lg"
                           >
                             <FaExternalLinkAlt />
                           </a>
                         )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tags (Bottom) */}
                      <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
                        {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-slate-500 font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-500">
             <div className="inline-block p-4 rounded-full bg-slate-900 border border-white/5 mb-4">
                <FaCode className="text-2xl" />
             </div>
             <p>No projects found in this sector yet.</p>
             <button onClick={() => setActiveFilter('All')} className="text-cyan-400 mt-2 hover:underline">View All</button>
          </div>
        )}

      </div>
    </div>
  )
}