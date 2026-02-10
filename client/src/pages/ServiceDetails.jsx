import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaArrowRight, FaLaptopCode, FaPaintBrush, 
  FaRocket, FaServer, FaMobileAlt, FaCloud, FaCheckCircle, 
  FaQuoteRight, FaCheck 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'

// --- 1. LOGIC AREA (DO NOT TOUCH) ---
// الحفاظ على المنطق كما هو تماماً بناءً على طلبك

const ICON_MAP = {
  'web-dev': FaLaptopCode,
  'ui-ux': FaPaintBrush,
  'product': FaRocket,
  'mobile': FaMobileAlt,
  'backend': FaServer,
  'cloud': FaCloud
}

const ICONKEY_ALIASES = {
  'database': 'backend', 'db': 'backend', 'database-design': 'backend',
  'api': 'backend', 'api-development': 'backend', 'rest-api': 'backend', 'graphql': 'backend',
  'devops': 'cloud', 'infrastructure': 'cloud',
  'ui': 'ui-ux', 'ux': 'ui-ux', 'design': 'ui-ux',
  'frontend': 'product',
  'app': 'mobile', 'native': 'mobile'
}

const deriveIconKeyFromTitle = (title) => {
  if (!title) return 'product'
  const lower = title.toLowerCase()
  if (lower.includes('full') || lower.includes('web') || lower.includes('stack')) return 'web-dev'
  if (lower.includes('ui') || lower.includes('design') || lower.includes('ux')) return 'ui-ux'
  if (lower.includes('product') || lower.includes('engineering')) return 'product'
  if (lower.includes('mobile') || lower.includes('app')) return 'mobile'
  if (lower.includes('backend') || lower.includes('api') || lower.includes('database') || lower.includes('server')) return 'backend'
  if (lower.includes('cloud') || lower.includes('devops') || lower.includes('deploy') || lower.includes('infrastructure')) return 'cloud'
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
  const IconComponent = ICON_MAP[normalizedKey] || FaRocket
  return <IconComponent />
}

// Visual Helper: Maps normalized keys to specific colors for the DESIGN only
const THEME_MAP = {
  'web-dev': { color: '#06b6d4', gradient: 'from-cyan-500 via-blue-500 to-indigo-600' },
  'ui-ux': { color: '#d946ef', gradient: 'from-fuchsia-500 via-purple-500 to-pink-600' },
  'product': { color: '#f97316', gradient: 'from-orange-500 via-red-500 to-rose-600' },
  'mobile': { color: '#10b981', gradient: 'from-emerald-400 via-teal-500 to-cyan-600' },
  'backend': { color: '#6366f1', gradient: 'from-indigo-500 via-violet-500 to-purple-600' },
  'cloud': { color: '#3b82f6', gradient: 'from-blue-400 via-sky-500 to-cyan-600' }
}

const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    shortDescription: 'Scalable, high-performance web applications built for the future.',
    fullContent: 'We build end-to-end web solutions using modern stacks like React, Node.js, and Postgres. Our approach includes strategic planning, beautiful UIs, robust backends, and seamless deployments to ensure your business stays ahead.',
    features: ['React & Next.js Ecosystem', 'Node.js & Python Backends', 'High Performance Databases', 'Secure RESTful APIs'],
    iconKey: 'web-dev'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    shortDescription: 'Crafting intuitive and engaging user experiences that convert.',
    fullContent: 'We craft interfaces that users love. Every pixel is intentional. Every interaction is smooth. We focus on accessibility, performance, and conversion optimization to turn visitors into loyal customers.',
    features: ['User Research & Personas', 'Wireframing & Prototyping', 'Interactive Design Systems', 'Usability Testing'],
    iconKey: 'ui-ux'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    shortDescription: 'Turning raw ideas into market-ready digital products.',
    fullContent: 'From concept to launch. We handle everything: strategy, design, development, testing, and deployment. Our goal is to help you build products that matter and solve real problems.',
    features: ['MVP Strategy & Roadmap', 'Agile Development Cycle', 'Quality Assurance (QA)', 'Go-to-market Support'],
    iconKey: 'product'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    shortDescription: 'Native and cross-platform mobile apps for iOS and Android.',
    fullContent: 'High-performance apps for iOS and Android. We use React Native for cross-platform efficiency or native technologies for maximum performance, ensuring a native feel on every device.',
    features: ['React Native & Flutter', 'iOS (Swift) & Android (Kotlin)', 'Offline-First Architecture', 'App Store Optimization'],
    iconKey: 'mobile'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    shortDescription: 'Robust server-side architecture for scalable systems.',
    fullContent: 'We build scalable, secure, and lightning-fast backends. REST APIs, GraphQL, real-time websockets, and microservices. We ensure your data is secure and your system can handle growth.',
    features: ['Microservices Architecture', 'Database Optimization', 'Advanced Security', 'Cloud Scalability'],
    iconKey: 'backend'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    shortDescription: 'Automated deployment and resilient infrastructure.',
    fullContent: 'From CI/CD pipelines to containerization and cloud management. We ensure your app is always available, secure, and performing at peak capacity using AWS, Azure, or Google Cloud.',
    features: ['CI/CD Pipelines', 'Docker & Kubernetes', 'Infrastructure as Code', '24/7 Monitoring'],
    iconKey: 'cloud'
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
      // Logic unchanged
      if (!id) { setLoading(false); return }

      const localService = DEFAULT_SERVICES.find(s => s.id === id)
      if (localService) {
        // Apply visual theme based on normalized key
        const normKey = normalizeIconKey(localService.iconKey, localService.title)
        const theme = THEME_MAP[normKey] || THEME_MAP['product']
        setService({ ...localService, iconKey: normKey, ...theme })
        setLoading(false)
        return
      }

      if (/^\d+$/.test(String(id))) {
        try {
          const res = await api.get(`/services/${id}`)
          const normKey = normalizeIconKey(res.data.iconKey, res.data.title)
          const theme = THEME_MAP[normKey] || THEME_MAP['product']
          
          setService({
            ...res.data,
            iconKey: normKey,
            ...theme
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#030305]"><Spinner /></div>

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030305] text-white text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
      <Link to="/services" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors">
        Back to Services
      </Link>
    </div>
  )

  // --- 2. DESIGN AREA (VISUAL OVERHAUL) ---
  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[60vh] flex flex-col justify-center">
        
        {/* Dynamic Background Effects (Matches Service Color) */}
        <div className="fixed inset-0 pointer-events-none -z-10">
           {/* Gradient Blob 1 */}
           <div className={`absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] bg-gradient-to-br ${service.gradient}`} />
           {/* Gradient Blob 2 */}
           <div className={`absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 blur-[100px] bg-gradient-to-tr ${service.gradient}`} />
           {/* Noise Overlay */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          {/* Back Button */}
          <motion.button 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)} 
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
          >
            {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />}
            <span>{isRtl ? 'رجوع للخدمات' : 'Back to Services'}</span>
          </motion.button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
            {/* Glass Icon Box */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative flex-shrink-0"
            >
              <div 
                className={`relative w-40 h-40 lg:w-48 lg:h-48 rounded-[2rem] flex items-center justify-center text-6xl lg:text-7xl text-white shadow-2xl bg-gradient-to-br ${service.gradient}`}
                style={{ boxShadow: `0 20px 60px -10px ${service.color}60` }}
              >
                {/* Inner Bevel/Shine */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/20 bg-white/10" />
                
                {/* The Icon */}
                <span className="relative z-10 drop-shadow-md transform group-hover:scale-110 transition-transform duration-500">
                   {getIcon(service.iconKey, service.title)}
                </span>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#030305] border border-white/10 flex items-center justify-center text-slate-400 z-20">
                <FaCheckCircle className="text-xl" style={{ color: service.color }} />
              </div>
            </motion.div>

            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left lg:pt-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed">
                {service.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="py-20 bg-[#050505] relative z-20 border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
            
            {/* --- Left Column: Main Description --- */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Description Body */}
              <div className="prose prose-invert prose-lg max-w-none">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: service.color }}></span>
                  {isRtl ? 'تفاصيل الخدمة' : 'About the Service'}
                </h3>
                <p className="text-slate-400 leading-9 text-lg font-light">
                  {service.fullContent}
                </p>
              </div>

              {/* Styled Quote Box */}
              <div className="relative p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 overflow-hidden">
                 {/* Decorative Blur inside card */}
                 <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10" style={{ backgroundColor: service.color }} />
                 
                 <FaQuoteRight className="text-4xl text-white/10 mb-6" />
                 <p className="text-xl md:text-2xl font-bold text-white relative z-10 leading-relaxed">
                   "{isRtl 
                     ? 'نحن لا نقدم مجرد كود، بل نبني حلولاً هندسية تدفع عجلة نمو مشروعك.' 
                     : 'We don’t just deliver code; we engineer solutions that drive measurable business growth.'}"
                 </p>
              </div>
            </motion.div>

            {/* --- Right Column: Sticky Sidebar --- */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-32 space-y-8"
              >
                
                {/* Features List Card */}
                <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl relative overflow-hidden">
                  {/* Top colored line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ backgroundColor: service.color }} />
                  
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                    {isRtl ? 'الميزات الرئيسية' : 'Key Features'}
                  </h3>
                  
                  <ul className="space-y-4">
                    {service.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 group">
                         <span 
                           className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center bg-white/5 text-[10px] transition-colors group-hover:bg-white/10"
                           style={{ color: service.color }}
                         >
                           <FaCheck />
                         </span>
                         <span className="text-sm md:text-base leading-relaxed group-hover:text-white transition-colors">
                            {feature}
                         </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call To Action Card */}
                <div className="relative rounded-3xl p-[1px] overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative bg-[#080808] rounded-[23px] p-8 text-center h-full">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {isRtl ? 'جاهز للبدء؟' : 'Ready to Start?'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-8">
                      {isRtl ? 'دعنا نحول فكرتك إلى واقع ملموس.' : 'Let’s turn your vision into reality.'}
                    </p>
                    
                    <Link 
                      to="/contact" 
                      className="block w-full py-4 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-all transform group-hover:scale-[1.02]"
                      style={{ 
                        background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                        boxShadow: `0 10px 30px -10px ${service.color}40`
                      }}
                    >
                      {isRtl ? 'ابدأ المشروع' : 'Start Project'}
                    </Link>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}