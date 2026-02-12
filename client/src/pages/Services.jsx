import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaLaptopCode, FaPaintBrush, FaRocket, FaServer, FaMobileAlt, FaCloud, FaArrowRight, FaArrowLeft, FaHtml5 } from 'react-icons/fa'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'

// --- Icon Mapping & Logic (نفس المنطق لضمان التوافق) ---
const ICON_MAP = {
  'web-dev': FaLaptopCode,
  'ui-ux': FaPaintBrush,
  'product': FaRocket,
  'frontend': FaHtml5,
  'mobile': FaMobileAlt,
  'backend': FaServer,
  'cloud': FaCloud
}

const ICONKEY_ALIASES = {
  'database': 'backend', 'db': 'backend', 'api': 'backend', 
  'devops': 'cloud', 'ui': 'ui-ux', 'ux': 'ui-ux', 
  'app': 'mobile'
}

const deriveIconKeyFromTitle = (title) => {
  if (!title) return 'product'
  const lower = title.toLowerCase()
  if (lower.includes('front') || lower.includes('frontend')) return 'frontend'
  if (lower.includes('web') || lower.includes('stack')) return 'web-dev'
  if (lower.includes('ui') || lower.includes('design')) return 'ui-ux'
  if (lower.includes('mobile') || lower.includes('app')) return 'mobile'
  if (lower.includes('backend') || lower.includes('api') || lower.includes('server')) return 'backend'
  if (lower.includes('cloud') || lower.includes('devops')) return 'cloud'
  return 'product'
}

const normalizeIconKey = (iconKey, title = '') => {
  if (!iconKey) return deriveIconKeyFromTitle(title)
  const normalized = iconKey.toLowerCase().trim()
  const aliased = ICONKEY_ALIASES[normalized]
  if (aliased && aliased in ICON_MAP) return aliased
  if (normalized in ICON_MAP) return normalized
  return deriveIconKeyFromTitle(title)
}

const getIcon = (iconKey, title = '') => {
  const normalizedKey = normalizeIconKey(iconKey, title)
  const IconComponent = ICON_MAP[normalizedKey]
  return IconComponent ? <IconComponent /> : <FaRocket />
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

// --- Default Data ---
const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    titleAr: 'تطوير متكامل',
    desc: 'Scalable, high-performance web applications using modern stacks like React, Node.js, and Postgres.',
    descAr: 'تطبيقات ويب قابلة للتوسع والأداء العالي باستخدام React وNode.js وPostgres.',
    features: ['React & Next.js', 'Node.js & Express', 'Postgres & Databases', 'Secure APIs'],
    featuresAr: ['إطارات React و Next.js', 'خوادم Node.js و Express', 'Postgres وإدارة قواعد البيانات', 'واجهات API آمنة'],
    iconKey: 'web-dev',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    titleAr: 'تصميم واجهة وتجربة المستخدم',
    desc: 'Intuitive, accessible, and beautiful interfaces designed to convert visitors into loyal customers.',
    descAr: 'واجهات بديهية وسهلة الاستخدام تركز على التحويل والوصول.',
    features: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing'],
    featuresAr: ['بحث المستخدم', 'نماذج أولية', 'أنظمة تصميم', 'اختبارات قابلية الاستخدام'],
    iconKey: 'ui-ux',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    titleAr: 'هندسة المنتجات',
    desc: 'From raw idea to market-ready MVP. We handle architecture, development, and deployment strategy.',
    descAr: 'من الفكرة إلى منتج جاهز للسوق. نتولى التخطيط، التطوير، والاستراتيجية.',
    features: ['MVP Strategy', 'Agile Development', 'QA & Testing', 'Go-to-market Support'],
    featuresAr: ['استراتيجية MVP', 'دورة تطوير رشيقة', 'اختبارات الجودة', 'دعم الإطلاق'],
    iconKey: 'product',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/20'
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    titleAr: 'تطوير الواجهات',
    desc: 'Pixel-perfect, performance-first frontends using React, Next.js and modern CSS.',
    descAr: 'واجهات دقيقة الأداء والاستجابة باستخدام React و CSS الحديثة.',
    features: ['Responsive Design', 'Accessibility (a11y)', 'Performance Optimization', 'Interactive Animations'],
    featuresAr: ['تصميم متجاوب', 'قابلية الوصول', 'تحسين الأداء', 'حركات تفاعلية'],
    iconKey: 'frontend',
    gradient: 'from-yellow-400 to-orange-500',
    shadow: 'shadow-yellow-400/20'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    titleAr: 'تطوير الموبايل',
    desc: 'Native and cross-platform apps (iOS & Android) built for performance and silky-smooth interactions.',
    descAr: 'تطبيقات أصلية وعبر المنصات لأداء سلس وتجربة مستخدم ممتازة.',
    features: ['React Native & Flutter', 'Native iOS/Android', 'Offline-first', 'App Store Optimization'],
    featuresAr: ['React Native و Flutter', 'تطبيقات iOS و Android أصلية', 'تصميم دون اتصال (Offline)', 'تحسين المتاجر'],
    iconKey: 'mobile',
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-500/20'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    titleAr: 'الخوادم وواجهات API',
    desc: 'Robust server-side architecture, RESTful/GraphQL APIs, and secure database management.',
    descAr: 'بنية خوادم قوية، واجهات API آمنة، وإدارة قواعد بيانات متقدمة.',
    features: ['Microservices', 'Database Optimization', 'Advanced Security', 'Scalable Architectures'],
    featuresAr: ['هندسة مايكروسيرفيس', 'تحسين قواعد البيانات', 'أمان متقدم', 'هندسة قابلة للتوسع'],
    iconKey: 'backend',
    gradient: 'from-indigo-500 to-violet-600',
    shadow: 'shadow-indigo-500/20'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    titleAr: 'السحابة و DevOps',
    desc: 'Automated CI/CD pipelines, containerization (Docker/K8s), and cloud infrastructure (AWS/Azure).',
    descAr: 'خطوط CI/CD آلية، حاويات، وبنية تحتية سحابية قابلة للإدارة والأمان.',
    features: ['CI/CD Pipelines', 'Docker & Kubernetes', 'IaC (Terraform)', 'Monitoring & Alerts'],
    featuresAr: ['خطوط CI/CD', 'Docker & Kubernetes', 'البنية ككود (IaC)', 'مراقبة وتنبيهات'],
    iconKey: 'cloud',
    gradient: 'from-sky-500 to-blue-600',
    shadow: 'shadow-sky-500/20'
  }
]

export default function Services() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Add extra bottom spacing so Footer doesn't sit immediately under the cards/CTA
  const pagePaddingBottom = 'pb-48'

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/services')
        const data = Array.isArray(res.data) ? res.data : (res.data.items || [])
        
        if (data.length > 0) {
          const GRADIENT_MAP = {
            'web-dev': { gradient: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
            'ui-ux': { gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
            'product': { gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/20' },
            'frontend': { gradient: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-400/20' },
            'mobile': { gradient: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20' },
            'backend': { gradient: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/20' },
            'cloud': { gradient: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' }
          }
          
          // If API returns numeric IDs, map them to DEFAULT_SERVICES by index
          const merged = data.map((item, apiIndex) => {
             // Ensure item.iconKey and item.title are strings
             const iconKeyStr = String(item.iconKey || item.id || '').trim()
             const titleStr = String(item.title || '').trim()
             
             const normalizedIconKey = normalizeIconKey(iconKeyStr, titleStr)
             const config = GRADIENT_MAP[normalizedIconKey] || GRADIENT_MAP['product']
             
             // Find matching service in DEFAULT_SERVICES by normalized key
             // This is important - we match by the derived key, not by API index
             let defaults = DEFAULT_SERVICES.find(s => s.id === normalizedIconKey)
             if (!defaults) {
               defaults = {}
             }
             
             // Determine the best ID to use for routing
             // ALWAYS use the normalized string ID (web-dev, ui-ux, etc)
             // This is more reliable than numeric index
             let routeId = normalizedIconKey || defaults.id || normalizedIconKey
             
             return { 
               ...defaults,
               ...item,
               id: routeId, // Use normalized string ID for routing to /services/${id}
               iconKey: normalizedIconKey,
               gradient: config.gradient, 
               shadow: config.shadow,
               titleAr: item.titleAr || defaults.titleAr,
               descAr: item.descAr || defaults.descAr || item.shortDescriptionAr,
               features: item.features || defaults.features || [],
               featuresAr: item.featuresAr || defaults.featuresAr || []
             }
          })
          setServices(merged)
        } else {
          setServices(DEFAULT_SERVICES)
        }
      } catch (err) {
        console.error(err)
        setServices(DEFAULT_SERVICES)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Spinner /></div>

  return (
    <div className={`min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden ${pagePaddingBottom}`}>
      <Navbar />

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- Hero Section --- */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 container mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            {t('Our Capabilities') || 'OUR EXPERTISE'}
          </span>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            {t('Engineering') || 'Engineering'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-gradient-x">
              {t('Digital Excellence') || 'Digital Excellence'}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            {t('We combine technical expertise with creative innovation to build software that transforms businesses.')}
          </p>
        </motion.div>
      </div>

      {/* --- Services Grid --- */}
      <div className="container mx-auto px-4 sm:px-6 pb-32 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.id || idx}
              variants={itemVariants}
            >
              <Link 
                to={`/services/${service.id}`} // وهذا الرابط الصحيح الذي يصلح مشكلة Service Not Found
                className={`
                  group relative flex flex-col justify-between h-full min-h-[320px] p-8
                  bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden
                  transition-all duration-500 hover:-translate-y-2 hover:border-white/10
                `}
              >
                {/* 1. Background Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                
                {/* 2. Top Line Gradient (Subtle) */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-[${service.color}] transition-all duration-500`} />

                {/* 3. Icon Container */}
                <div className="mb-8 relative">
                   {/* Icon Glow */}
                   <div className={`absolute -inset-4 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-full`} />
                   
                   <div className={`
                     relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                     bg-gradient-to-br ${service.gradient} text-white shadow-lg
                     transition-transform duration-500
                   `}>
                      {/* Inner Shine */}
                      <div className="absolute inset-0 border border-white/20 rounded-2xl bg-white/10" />
                      <motion.span 
                        className="relative z-10"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 12, -12, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          repeatDelay: 0.5
                        }}
                        style={{
                          filter: `drop-shadow(0 0 12px ${service.gradient.split(' to-')[1]?.split(')')[0] || '#fff'})`
                        }}
                      >
                        {getIcon(service.iconKey, service.title)}
                      </motion.span>
                   </div>
                </div>

                {/* 4. Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {isRtl ? (service.titleAr || service.title) : service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-8 line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {isRtl ? (service.shortDescriptionAr || service.descAr || service.shortDescription || service.desc) : (service.shortDescription || service.desc)}
                  </p>
                </div>

                {/* 5. Footer / Button */}
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                    {t('Explore') || 'View Details'}
                  </span>
                  
                  <div className={`
                    w-10 h-10 rounded-full border border-white/10 flex items-center justify-center 
                    text-white bg-white/5 
                    transition-all duration-300 
                    group-hover:bg-white group-hover:text-black group-hover:border-transparent
                    ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}
                  `}>
                    <motion.div
                      animate={{ 
                        x: [0, isRtl ? -6 : 6, 0],
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                      style={{
                        textShadow: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
                        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
                      }}
                    >
                      {isRtl ? <FaArrowLeft /> : <FaArrowRight />}
                    </motion.div>
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <p className="text-slate-400 mb-6">{t('Need a custom solution?') || 'Looking for something specific?'}</p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            <span>{t('Start a Project') || 'Contact Us'}</span>
            {isRtl ? <FaArrowLeft /> : <FaArrowRight />}
          </Link>
        </motion.div>

      </div>
    </div>
  )
}