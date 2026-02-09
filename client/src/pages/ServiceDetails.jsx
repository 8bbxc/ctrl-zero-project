import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaLaptopCode, FaPaintBrush, FaRocket, FaServer, FaMobileAlt, FaCloud, FaCheckCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- Icon Mapping ---
const ICON_MAP = {
  'web-dev': FaLaptopCode,
  'ui-ux': FaPaintBrush,
  'product': FaRocket,
  'mobile': FaMobileAlt,
  'backend': FaServer,
  'cloud': FaCloud
}

const getIcon = (iconKey) => {
  const IconComponent = ICON_MAP[iconKey]
  return IconComponent ? <IconComponent /> : null
}

// --- Default Services Data ---
const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    shortDescription: 'Scalable, high-performance web applications',
    fullContent: 'We build end-to-end web solutions using modern stacks like React, Node.js, and Postgres. Our approach includes strategic planning, beautiful UIs, robust backends, and seamless deployments.',
    features: ['React/Vue/Angular', 'Node.js/Python', 'PostgreSQL/MongoDB', 'RESTful APIs'],
    iconKey: 'web-dev',
    gradient: 'from-blue-500 to-cyan-400',
    color: '#0891b2'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    shortDescription: 'Beautiful and intuitive user experiences',
    fullContent: 'We craft interfaces that users love. Every pixel is intentional. Every interaction is smooth. We focus on accessibility, performance, and conversion optimization.',
    features: ['Wireframing', 'Prototyping', 'Design Systems', 'User Testing'],
    iconKey: 'ui-ux',
    gradient: 'from-purple-500 to-pink-500',
    color: '#a855f7'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    shortDescription: 'Turn ideas into market-ready products',
    fullContent: 'From concept to launch. We handle everything: strategy, design, development, testing, and deployment. Our goal is to help you build products that matter.',
    features: ['MVP Strategy', 'Agile Development', 'Quality Assurance', 'Go-to-market'],
    iconKey: 'product',
    gradient: 'from-orange-500 to-red-500',
    color: '#f97316'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    shortDescription: 'Native and cross-platform mobile apps',
    fullContent: 'High-performance apps for iOS and Android. We use React Native for cross-platform efficiency or native technologies for maximum performance.',
    features: ['React Native', 'Swift/Kotlin', 'Firebase', 'App Store Optimization'],
    iconKey: 'mobile',
    gradient: 'from-emerald-500 to-teal-400',
    color: '#10b981'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    shortDescription: 'Robust server-side architecture',
    fullContent: 'We build scalable, secure, and lightning-fast backends. REST APIs, GraphQL, real-time websockets, and microservices - we know it all.',
    features: ['REST/GraphQL', 'Database Design', 'Authentication/Security', 'Scalability'],
    iconKey: 'backend',
    gradient: 'from-indigo-500 to-violet-600',
    color: '#6366f1'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    shortDescription: 'Automated deployment and infrastructure',
    fullContent: 'From CI/CD pipelines to containerization and cloud management. We ensure your app is always available, secure, and performing at peak capacity.',
    features: ['CI/CD Pipelines', 'Docker/Kubernetes', 'AWS/Azure/GCP', 'Monitoring & Logging'],
    iconKey: 'cloud',
    gradient: 'from-sky-500 to-blue-600',
    color: '#0ea5e9'
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
      console.log('🔧 ServiceDetails - Fetching:', { id });
      
      if (!id) {
        setService(null)
        setLoading(false)
        return
      }

      // Try local services first
      const localService = DEFAULT_SERVICES.find(s => s.id === id)
      if (localService) {
        console.log('✅ Found local service:', id);
        setService(localService)
        setLoading(false)
        return
      }

      // Try API if numeric ID
      if (/^\d+$/.test(String(id))) {
        try {
          console.log('🌐 Fetching from API: /services/', id);
          const res = await api.get(`/services/${id}`)
          setService(res.data)
        } catch (err) {
          console.error('❌ Error fetching service:', err)
          setService(null)
        }
      } else {
        setService(null)
      }
      
      setLoading(false)
    }
    fetchService()
  }, [id])

  // Loading state
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <Spinner />
    </div>
  )

  // Not found state
  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white text-center px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Service Not Found</h2>
      <p className="text-slate-400 mb-8 text-sm sm:text-base">The service you're looking for doesn't exist.</p>
      <Link to="/services" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors text-sm sm:text-base">
        Back to Services
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-[#050505] to-[#050505] -z-10" />
        <div className="absolute top-0 right-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-full border border-white/10 hover:border-white/20 group mb-6 sm:mb-8"
          >
            {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />}
            <span>{isRtl ? 'الخدمات' : 'Services'}</span>
          </button>

          {/* Icon & Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl sm:text-4xl flex-shrink-0 shadow-lg shadow-blue-500/20`}>
              {getIcon(service.iconKey)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              {service.title}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed mb-8 sm:mb-12"
          >
            {service.shortDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link to="/contact" className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded-lg sm:rounded-full font-bold hover:bg-slate-200 transition-all text-sm sm:text-base text-center">
              {isRtl ? 'احصل على عرض' : 'Get a Quote'}
            </Link>
            <Link to="/services" className="px-6 sm:px-8 py-2.5 sm:py-3 border border-white/20 text-slate-300 hover:text-white rounded-lg sm:rounded-full font-bold hover:bg-white/5 transition-all backdrop-blur-md text-sm sm:text-base text-center">
              {isRtl ? 'الخدمات الأخرى' : 'Other Services'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- Content Section --- */}
      <section className="py-12 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              {/* Full Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></span>
                  {isRtl ? 'تفاصيل الخدمة' : 'About This Service'}
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {service.fullContent}
                </p>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              {/* Features Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="sticky top-24 sm:top-28 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400" /> 
                  <span>{isRtl ? 'الميزات' : 'Features'}</span>
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {service.features && service.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <span className="text-emerald-400 mt-1 flex-shrink-0">✓</span>
                      <span className="text-slate-300 text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center"
              >
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">Ready to get started?</p>
                <Link to="/contact" className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-lg sm:rounded-full font-bold hover:bg-slate-200 transition-all text-sm sm:text-base">
                  {isRtl ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
