import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaArrowLeft, FaSearch, FaLaptopCode, FaImages, FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar' // تأكد من المسار
import Footer from '../components/Footer' // تأكد من المسار

// --- إعدادات الأقسام (صور، ألوان، وصف) ---
const SECTOR_CONFIG = {
  Medical: {
    title: 'Healthcare & Medical',
    titleAr: 'الطب والرعاية الصحية',
    hero: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=2000&q=80',
    color: 'text-red-400', // لون النصوص
    bgGlow: 'hover:shadow-red-500/20 hover:border-red-500/30', // توهج الكرت
    gradient: 'from-red-900/40 to-black', // تدرج الخلفية العلوية
    description: 'Transforming patient care with advanced digital health solutions.',
    descriptionAr: 'نحول رعاية المرضى بحلول صحية رقمية متقدمة.'
  },
  'E-Commerce': {
    title: 'E-Commerce & Retail',
    titleAr: 'التجارة الإلكترونية',
    hero: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=2000&q=80',
    color: 'text-emerald-400',
    bgGlow: 'hover:shadow-emerald-500/20 hover:border-emerald-500/30',
    gradient: 'from-emerald-900/40 to-black',
    description: 'High-conversion stores aimed at maximizing revenue.',
    descriptionAr: 'متاجر عالية التحويل تهدف لزيادة الأرباح.'
  },
  Restaurant: {
    title: 'Food & Hospitality',
    titleAr: 'المطاعم والضيافة',
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    color: 'text-orange-400',
    bgGlow: 'hover:shadow-orange-500/20 hover:border-orange-500/30',
    gradient: 'from-orange-900/40 to-black',
    description: 'Digital menus and management systems for modern dining.',
    descriptionAr: 'قوائم رقمية وأنظمة إدارة لتجربة طعام حديثة.'
  },
  Corporate: {
    title: 'Corporate & Business',
    titleAr: 'الشركات والأعمال',
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
    color: 'text-blue-400',
    bgGlow: 'hover:shadow-blue-500/20 hover:border-blue-500/30',
    gradient: 'from-blue-900/40 to-black',
    description: 'Professional platforms that define brand authority.',
    descriptionAr: 'منصات احترافية ترسخ هيبة العلامة التجارية.'
  },
  Education: {
    title: 'Education & LMS',
    titleAr: 'التعليم والتدريب',
    hero: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=80',
    color: 'text-yellow-400',
    bgGlow: 'hover:shadow-yellow-500/20 hover:border-yellow-500/30',
    gradient: 'from-yellow-900/40 to-black',
    description: 'Interactive learning experiences for the future.',
    descriptionAr: 'تجارب تعليمية تفاعلية للمستقبل.'
  },
  'Real Estate': {
    title: 'Real Estate & Property',
    titleAr: 'العقارات والسياحة',
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
    color: 'text-cyan-400',
    bgGlow: 'hover:shadow-cyan-500/20 hover:border-cyan-500/30',
    gradient: 'from-cyan-900/40 to-black',
    description: 'Immersive property showcases and booking engines.',
    descriptionAr: 'معارض عقارية غامرة ومحركات حجز متطورة.'
  }
}

export default function SectorProjects() {
  const { sector } = useParams()
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // إعدادات Parallax (حركة الخلفية مع السكرول)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) // الصورة تتحرك بنصف سرعة السكرول

  // إعدادات القسم الافتراضية في حال عدم العثور عليه
  const config = SECTOR_CONFIG[sector] || SECTOR_CONFIG.Corporate
  const displayTitle = isArabic ? config.titleAr : config.title
  const displayDesc = isArabic ? config.descriptionAr : config.description

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const res = await api.get('/projects')
        const allProjects = Array.isArray(res.data) ? res.data : res.data.items || []
        
        // --- الفلترة السحرية ---
        // نقوم بجلب المشاريع التي تطابق القسم المختار
        const sectorProjects = allProjects.filter(p => p.category === sector)
        setProjects(sectorProjects)
      } catch (err) {
        console.error('Failed to fetch projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [sector])

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-slate-50 font-sans overflow-x-hidden">
      <Navbar />

      {/* --- 1. Cinematic Parallax Hero Section --- */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        {/* صورة الخلفية المتحركة */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img 
            src={config.hero} 
            alt={displayTitle}
            className="w-full h-full object-cover scale-110" 
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-80`} />
        </motion.div>

        {/* محتوى الهيرو */}
        <div className="relative z-10 text-center px-4 max-w-4xl pt-20">
          <Link 
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors border border-white/10 px-4 py-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/40 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            {isArabic ? 'العودة للقطاعات' : 'Back to Sectors'}
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
          >
            {displayTitle} <span className={config.color}>.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-300 font-light"
          >
            {displayDesc}
          </motion.p>
        </div>
      </div>

      {/* --- 2. Projects Grid Section --- */}
      <div className="container mx-auto px-4 md:px-8 py-24 relative z-10 -mt-20">
        
        {loading ? (
          <div className="flex justify-center h-64 items-center bg-slate-900/50 rounded-3xl backdrop-blur-xl border border-white/5">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          
          // --- حالة عدم وجود مشاريع (Empty State) ---
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-16 text-center shadow-2xl"
          >
            <FaSearch className="text-6xl text-slate-700 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">{isArabic ? 'قريباً...' : 'Coming Soon'}</h2>
            <p className="text-slate-400 mb-8">{isArabic ? 'لم نضف مشاريع في هذا القسم بعد، تواصل معنا لبدء مشروعك!' : 'We haven\'t added projects to this sector yet.'}</p>
            <Link to="/contact" className={`px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-opacity-90 transition-colors`}>
              {isArabic ? 'اطلب مشروعاً' : 'Start a Project'}
            </Link>
          </motion.div>

        ) : (
          
          // --- قائمة المشاريع (Grid System) ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group h-full"
              >
                {/* كرت المشروع الفخم */}
                <div className={`
                  h-full bg-slate-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col
                  transition-all duration-500 shadow-xl
                  ${config.bgGlow} hover:-translate-y-2
                `}>
                  
                  {/* صورة المشروع */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <FaLaptopCode className="text-5xl text-slate-700" />
                      </div>
                    )}
                    
                    {/* بادج الصور */}
                    <div className="absolute top-4 right-4 z-20">
                       {project.gallery?.length > 0 && (
                         <span className="bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                           <FaImages /> {project.gallery.length}
                         </span>
                       )}
                    </div>
                  </div>

                  {/* تفاصيل المشروع */}
                  <div className="p-6 flex flex-col flex-grow relative">
                    {/* خلفية نويز خفيفة */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

                    <h3 className={`text-2xl font-bold text-white mb-2 transition-colors group-hover:${config.color}`}>
                      {project.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                      {project.description}
                    </p>

                    {/* التاغات والزر */}
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex gap-2">
                        {project.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-white/5 rounded text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link 
                        to={`/projects/${project.slug || project.id}`}
                        className={`
                          w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white
                          hover:bg-white hover:text-black transition-all transform group-hover:rotate-45
                        `}
                      >
                        <FaExternalLinkAlt className="text-xs" />
                      </Link>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}