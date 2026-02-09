import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaExternalLinkAlt, FaSearch, FaLaptopCode, FaImages } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Sector Data with Hero Images and Colors
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والصحة',
    hero: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
    color: 'from-red-600/20 to-pink-600/20',
    borderColor: 'border-red-500/30',
    accentColor: 'text-red-400',
    description: 'Advanced healthcare solutions transforming medical care delivery',
    descriptionAr: 'حلول طبية متقدمة لتحويل الخدمات الصحية'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    color: 'from-green-600/20 to-emerald-600/20',
    borderColor: 'border-green-500/30',
    accentColor: 'text-green-400',
    description: 'Modern e-commerce platforms with cutting-edge features',
    descriptionAr: 'منصات تجارة إلكترونية حديثة مع ميزات متقدمة'
  },
  Restaurant: {
    title: 'Restaurant & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1600&q=80',
    color: 'from-orange-600/20 to-yellow-600/20',
    borderColor: 'border-orange-500/30',
    accentColor: 'text-orange-400',
    description: 'Restaurant management systems revolutionizing food service',
    descriptionAr: 'أنظمة إدارة مطاعم تحول صناعة الغذاء'
  },
  Corporate: {
    title: 'Corporate & Enterprise',
    titleAr: 'الشركات والمؤسسات',
    hero: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    color: 'from-blue-600/20 to-sky-600/20',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-400',
    description: 'Enterprise solutions for modern businesses',
    descriptionAr: 'حلول مؤسسية للشركات الحديثة'
  },
  Education: {
    title: 'Education & E-Learning',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    color: 'from-purple-600/20 to-violet-600/20',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-400',
    description: 'Innovative learning platforms empowering education',
    descriptionAr: 'منصات تعليمية مبتكرة لتمكين التعليم'
  },
  'Real Estate': {
    title: 'Real Estate & Properties',
    titleAr: 'العقارات والسياحة',
    hero: 'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1600&q=80',
    color: 'from-indigo-600/20 to-blue-600/20',
    borderColor: 'border-indigo-500/30',
    accentColor: 'text-indigo-400',
    description: 'Real estate platforms with immersive property experiences',
    descriptionAr: 'منصات عقارية مع تجارب عرض عقارات غامرة'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descriptionAr : config.description

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await api.get('/projects')
        const allProjects = Array.isArray(res.data) ? res.data : res.data.items || []
        
        // Filter by sector
        const sectorProjects = allProjects.filter(p => p.category === sector)
        
        setProjects(sectorProjects)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [sector])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src={config.hero} 
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Back Button */}
          <Link 
            to="/projects"
            className="absolute top-8 left-8 md:left-12 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
          >
            <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
          </Link>

          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-4 block">
              {isArabic ? 'قطاع متخصص' : 'SPECIALIZED SECTOR'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-white">
              {displayTitle}
              <span className={`${config.accentColor}`}>.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light">
              {displayDesc}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        
        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-slate-500"
          >
            <div className="w-24 h-24 bg-slate-900/40 rounded-full flex items-center justify-center mb-6 border border-white/5">
              <FaSearch className="text-5xl text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isArabic ? 'لا توجد مشاريع' : 'No Projects Yet'}
            </h2>
            <p className="text-slate-400 mb-6">
              {isArabic 
                ? 'سيتم إضافة مشاريع في هذا القطاع قريباً' 
                : 'Projects in this sector coming soon!'
              }
            </p>
            <Link 
              to="/projects"
              className="px-8 py-3 bg-accent text-black rounded-xl font-bold hover:shadow-lg hover:shadow-accent/50 transition-all"
            >
              {isArabic ? 'الرجوع' : 'Back to Projects'}
            </Link>
          </motion.div>
        ) : (
          <div>
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {projects.length} {isArabic ? 'مشروع' : 'Projects'}
              </h2>
              <div className={`w-24 h-1 bg-gradient-to-r ${config.color} rounded-full mx-auto`} />
            </div>

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
                    <div className={`h-full bg-gradient-to-br ${config.color} backdrop-blur-xl border ${config.borderColor} rounded-3xl overflow-hidden hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 flex flex-col group-hover:-translate-y-2`}>
                      
                      {/* Image Area */}
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
                            <FaLaptopCode className="text-6xl text-slate-700 group-hover:text-slate-500 transition-colors" />
                          </div>
                        )}

                        {/* Gallery Badge */}
                        {project.gallery && project.gallery.length > 0 && (
                          <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white flex items-center gap-1.5 border border-white/10">
                            <FaImages className="text-sm" /> {project.gallery.length}
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                          <Link 
                            to={`/projects/${project.slug || project.id}`}
                            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent hover:scale-110 transition-all shadow-xl font-bold text-xl"
                            title="View Project"
                          >
                            →
                          </Link>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors mb-3 truncate">
                          {project.title}
                        </h3>

                        <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 font-light flex-grow">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300 group-hover:border-white/20 transition-colors">
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
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="py-20 text-center px-6"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {isArabic ? 'هل تريد مشروع مماثل؟' : 'Ready to Start a Similar Project?'}
            </h2>
            <p className="text-slate-400 mb-8 font-light">
              {isArabic 
                ? 'دعنا نناقش كيف يمكننا بناء حل مخصص لعملك' 
                : 'Let\'s discuss how we can build a solution for your business'
              }
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/contact"
                className="px-8 py-3 bg-accent text-black rounded-xl font-bold hover:shadow-lg hover:shadow-accent/50 transition-all"
              >
                {isArabic ? 'احصل على عرض سعر' : 'Get a Quote'}
              </Link>
              <Link 
                to="/projects"
                className="px-8 py-3 bg-white/5 text-white border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                {isArabic ? 'عودة للقطاعات' : 'Back to Sectors'}
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}
