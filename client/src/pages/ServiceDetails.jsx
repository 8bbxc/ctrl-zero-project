import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaArrowRight, FaLaptopCode, FaPaintBrush, 
  FaRocket, FaServer, FaMobileAlt, FaCloud, FaCheckCircle, 
  FaQuoteRight 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'

// --- Icon Mapping ---
const ICON_MAP = {
  'web-dev': FaLaptopCode,
  'ui-ux': FaPaintBrush,
  'product': FaRocket,
  'mobile': FaMobileAlt,
  'backend': FaServer,
  'cloud': FaCloud
}

// Map various names to icon keys
const ICONKEY_ALIASES = {
  'database': 'backend',
  'db': 'backend',
  'database-design': 'backend',
  'api': 'backend',
  'api-development': 'backend',
  'rest-api': 'backend',
  'graphql': 'backend',
  'devops': 'cloud',
  'infrastructure': 'cloud',
  'ui': 'ui-ux',
  'ux': 'ui-ux',
  'design': 'ui-ux',
  'frontend': 'product',
  'app': 'mobile',
  'native': 'mobile'
}

// Extract iconKey from service title using keywords
const deriveIconKeyFromTitle = (title) => {
  if (!title) return 'product'
  const lower = title.toLowerCase()
  
  // Check for keywords in title
  if (lower.includes('full') || lower.includes('web') || lower.includes('stack')) return 'web-dev'
  if (lower.includes('ui') || lower.includes('design') || lower.includes('ux')) return 'ui-ux'
  if (lower.includes('product') || lower.includes('engineering')) return 'product'
  if (lower.includes('mobile') || lower.includes('app')) return 'mobile'
  if (lower.includes('backend') || lower.includes('api') || lower.includes('database') || lower.includes('server')) return 'backend'
  if (lower.includes('cloud') || lower.includes('devops') || lower.includes('deploy') || lower.includes('infrastructure')) return 'cloud'
  
  return 'product' // default fallback
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
  const IconComponent = ICON_MAP[normalizedKey] || FaRocket
  return <IconComponent />
}

// --- Default Services Data ---
const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    shortDescription: 'Scalable, high-performance web applications built for the future.',
    fullContent: 'We build end-to-end web solutions using modern stacks like React, Node.js, and Postgres. Our approach includes strategic planning, beautiful UIs, robust backends, and seamless deployments to ensure your business stays ahead.',
    features: ['React & Next.js Ecosystem', 'Node.js & Python Backends', 'High Performance Databases', 'Secure RESTful APIs'],
    iconKey: 'web-dev',
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/20'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    shortDescription: 'Crafting intuitive and engaging user experiences that convert.',
    fullContent: 'We craft interfaces that users love. Every pixel is intentional. Every interaction is smooth. We focus on accessibility, performance, and conversion optimization to turn visitors into loyal customers.',
    features: ['User Research & Personas', 'Wireframing & Prototyping', 'Interactive Design Systems', 'Usability Testing'],
    iconKey: 'ui-ux',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    shortDescription: 'Turning raw ideas into market-ready digital products.',
    fullContent: 'From concept to launch. We handle everything: strategy, design, development, testing, and deployment. Our goal is to help you build products that matter and solve real problems.',
    features: ['MVP Strategy & Roadmap', 'Agile Development Cycle', 'Quality Assurance (QA)', 'Go-to-market Support'],
    iconKey: 'product',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/20'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    shortDescription: 'Native and cross-platform mobile apps for iOS and Android.',
    fullContent: 'High-performance apps for iOS and Android. We use React Native for cross-platform efficiency or native technologies for maximum performance, ensuring a native feel on every device.',
    features: ['React Native & Flutter', 'iOS (Swift) & Android (Kotlin)', 'Offline-First Architecture', 'App Store Optimization'],
    iconKey: 'mobile',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    shortDescription: 'Robust server-side architecture for scalable systems.',
    fullContent: 'We build scalable, secure, and lightning-fast backends. REST APIs, GraphQL, real-time websockets, and microservices. We ensure your data is secure and your system can handle growth.',
    features: ['Microservices Architecture', 'Database Optimization', 'Advanced Security', 'Cloud Scalability'],
    iconKey: 'backend',
    gradient: 'from-indigo-500 to-violet-600',
    shadow: 'shadow-indigo-500/20'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    shortDescription: 'Automated deployment and resilient infrastructure.',
    fullContent: 'From CI/CD pipelines to containerization and cloud management. We ensure your app is always available, secure, and performing at peak capacity using AWS, Azure, or Google Cloud.',
    features: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Infrastructure as Code', '24/7 Monitoring'],
    iconKey: 'cloud',
    gradient: 'from-sky-500 to-blue-600',
    shadow: 'shadow-sky-500/20'
  }
]

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      const localService = DEFAULT_SERVICES.find(s => s.id === id)
      if (localService) {
        setService(localService)
        setLoading(false)
        return
      }

      if (/^\d+$/.test(String(id))) {
        try {
          const res = await api.get(`/services/${id}`)
          const normalizedIconKey = normalizeIconKey(res.data.iconKey, res.data.title)
          
          // Map normalized icon key to gradient
          const GRADIENT_MAP = {
            'web-dev': { gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
            'ui-ux': { gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20' },
            'product': { gradient: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/20' },
            'mobile': { gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
            'backend': { gradient: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/20' },
            'cloud': { gradient: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' }
          }
          
          const gradientConfig = GRADIENT_MAP[normalizedIconKey] || { gradient: 'from-slate-700 to-slate-900', shadow: 'shadow-white/10' }
          
          setService({
            ...res.data,
            iconKey: normalizedIconKey,
            gradient: gradientConfig.gradient,
            shadow: gradientConfig.shadow
          })
        } catch (err) {
          console.error('Error fetching service:', err)
          setService(null)
        }
      } else {
        setService(null)
      }
      
      setLoading(false)
    }
    fetchService()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Spinner /></div>

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
      <Link to="/services" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors">
        Back to Services
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <Navbar />

      {/* === PREMIUM BACKGROUND EFFECTS === */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Primary Gradient Blob */}
        <div className={`absolute top-[-15%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-br ${service.gradient} rounded-full blur-3xl opacity-20 animate-pulse-slow`} />
        
        {/* Secondary Gradient Blob */}
        <div className={`absolute bottom-[-20%] left-[-8%] w-[800px] h-[800px] bg-gradient-to-tr ${service.gradient} rounded-full blur-3xl opacity-15 animate-pulse-slower`} />
        
        {/* Accent Glow */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-20" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.05)25%,transparent_25%,transparent_50%,rgba(255,255,255,.05)50%,rgba(255,255,255,.05)75%,transparent_75%,transparent)] bg-[length:50px_50px] opacity-50" />
        
        {/* Radial Gradient Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/20 to-[#050505]/90" />
      </div>

      {/* === HERO SECTION === */}
      <section className="relative pt-32 pb-28 overflow-hidden min-h-[70vh] flex flex-col justify-center z-10">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          {/* Navigation Button */}
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-lg px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30 mb-12 group"
          >
            {isRtl ? <FaArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
            <span>{isRtl ? 'الخدمات' : 'Services'}</span>
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* === PREMIUM ICON SECTION === */}
            <motion.div 
              initial={{ scale: 0.6, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, duration: 1 }}
              className={`
                relative group
                w-52 h-52 lg:w-64 lg:h-64
                rounded-3xl lg:rounded-[2.5rem]
                bg-gradient-to-br ${service.gradient}
                flex items-center justify-center
                text-8xl lg:text-9xl text-white
                shadow-2xl
                overflow-hidden
                mx-auto lg:mx-0
              `}
            >
              {/* Outer Glow - Strongest */}
              <div className={`absolute -inset-3 bg-gradient-to-br ${service.gradient} rounded-[2.5rem] opacity-50 blur-3xl -z-30 animate-pulse group-hover:opacity-70 transition-opacity`} />
              
              {/* Middle Glow */}
              <div className={`absolute -inset-2 bg-gradient-to-br ${service.gradient} rounded-[2.5rem] opacity-40 blur-2xl -z-20 animate-pulse group-hover:opacity-60 transition-opacity`} />
              
              {/* Inner Layer Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${service.gradient} rounded-[2.5rem] opacity-30 blur-xl -z-10 group-hover:opacity-50 transition-opacity`} />
              
              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl lg:rounded-[2.5rem]" />
              
              {/* Icon with Heavy Effects */}
              <motion.span 
                whileHover={{ rotate: 20, scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="relative z-20 drop-shadow-2xl filter brightness-125 group-hover:brightness-150 transition-all text-shadow-lg"
              >
                {getIcon(service.iconKey, service.title)}
              </motion.span>
            </motion.div>

            {/* === HERO TEXT === */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              {/* Service Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className={`inline-block text-xs font-bold uppercase tracking-[0.25em] px-5 py-3 rounded-full bg-gradient-to-r ${service.gradient} text-white shadow-lg shadow-current/20 drop-shadow-lg`}>
                  {isRtl ? '⭐ خدمة متخصصة' : '⭐ Specialized Service'}
                </span>
              </motion.div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
                {service.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl">
                {service.shortDescription}
              </p>

              {/* Quick Badges */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:border-white/40 transition-all hover:bg-white/15"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.gradient} shadow-lg shadow-current/50`} />
                  <span className="text-sm font-bold text-slate-200">{isRtl ? '✓ متقدم' : '✓ Professional'}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:border-white/40 transition-all hover:bg-white/15"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${service.gradient} shadow-lg shadow-current/50`} />
                  <span className="text-sm font-bold text-slate-200">{isRtl ? '✓ مضمون' : '✓ Guaranteed'}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* === CONTENT SECTION === */}
      <section className="py-28 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                   <motion.div 
                     className={`h-16 w-1.5 bg-gradient-to-b ${service.gradient} rounded-full shadow-lg shadow-current/30`}
                   />
                   <h2 className="text-4xl lg:text-5xl font-black text-white">
                     {isRtl ? 'التفاصيل الكاملة' : 'Full Details'}
                   </h2>
                </div>
                
                <p className="text-slate-300 text-lg lg:text-xl leading-relaxed font-light">
                  {service.fullContent}
                </p>
              </motion.div>

              {/* Premium Quote Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`
                  group relative rounded-3xl p-10 lg:p-14 overflow-hidden
                  border border-white/10 hover:border-white/40 transition-all
                  hover:shadow-2xl hover:shadow-current/20 bg-gradient-to-br from-slate-900/40 to-slate-900/10 backdrop-blur-xl
                `}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 blur transition-opacity -z-10`} />
                
                <div className="relative z-10">
                  <FaQuoteRight className="text-6xl lg:text-7xl text-white/15 mb-6 group-hover:text-white/25 transition-colors" />
                  <p className="text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                    "{isRtl ? 'لا نكتب أكوادا فقط، بل نهندس حلولاً تحفز النمو' : 'We engineer solutions that drive real business growth.'}"
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Premium Features Card */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`
                  group sticky top-32
                  rounded-3xl overflow-hidden
                  bg-gradient-to-br from-slate-900/70 to-slate-900/40 backdrop-blur-2xl
                  border border-white/10 hover:border-white/40
                  p-10 shadow-2xl
                  transition-all hover:shadow-2xl hover:shadow-current/30
                `}
              >
                {/* Animated Gradient Background */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 blur-lg transition-opacity -z-10`} />
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10 group-hover:border-white/20 transition-colors">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg shadow-current/30`}>
                    <FaCheckCircle className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wider">
                    {isRtl ? 'الميزات' : 'Features'}
                  </h3>
                </div>
                
                {/* Features List */}
                <ul className="space-y-5 mb-10">
                  {service.features && service.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-start gap-3 group/item"
                    >
                      <div className={`min-w-max mt-1 p-2 rounded-lg bg-gradient-to-br ${service.gradient} shadow-lg shadow-current/20 group-hover/item:scale-125 transition-transform group-hover/item:shadow-lg group-hover/item:shadow-current/40`}>
                        <FaCheckCircle className="text-white text-base" />
                      </div>
                      <span className="text-slate-300 font-semibold text-base group-hover/item:text-white transition-colors leading-relaxed">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button Area */}
                <div className="pt-8 border-t border-white/10 space-y-4">
                   <p className="text-slate-400 text-sm text-center font-bold tracking-wide">
                     {isRtl ? '🚀 ابدأ مشروعك الآن' : '🚀 Start Your Project'}
                   </p>
                   <motion.div
                     whileHover={{ scale: 1.08 }}
                     whileTap={{ scale: 0.92 }}
                   >
                     <Link 
                       to="/contact" 
                       className={`
                         block w-full py-4 px-6 rounded-2xl font-bold text-center text-white
                         bg-gradient-to-r ${service.gradient}
                         shadow-xl shadow-current/40
                         hover:shadow-2xl hover:shadow-current/60
                         transition-all relative overflow-hidden group/btn
                         hover:scale-105 duration-300
                       `}
                     >
                       <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                       <span className="relative font-black uppercase tracking-wide">{isRtl ? 'اطلب الخدمة' : 'Get Started'}</span>
                     </Link>
                   </motion.div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
