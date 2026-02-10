import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaLaptopCode, FaPaintBrush, FaRocket, FaServer, FaMobileAlt, FaCloud, FaArrowRight } from 'react-icons/fa'
import api from '../services/api'
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

// Map various database-related names to backend icon
const ICONKEY_ALIASES = {
  'database': 'backend',
  'db': 'backend',
  'database-design': 'backend',
  'api': 'backend',
  'api-development': 'backend',
  'rest-api': 'backend',
  'graphql': 'backend'
}

const normalizeIconKey = (iconKey) => {
  if (!iconKey) return 'backend'
  const normalized = iconKey.toLowerCase().trim()
  return ICONKEY_ALIASES[normalized] || iconKey
}

const getIcon = (iconKey) => {
  const normalizedKey = normalizeIconKey(iconKey)
  const IconComponent = ICON_MAP[normalizedKey]
  return IconComponent ? <IconComponent /> : null
}

// --- Default Data with Gradients ---
const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    desc: 'Scalable, high-performance web applications using modern stacks like React, Node.js, and Postgres.',
    iconKey: 'web-dev',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'group-hover:shadow-blue-500/20'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    desc: 'Intuitive, accessible, and beautiful interfaces designed to convert visitors into loyal customers.',
    iconKey: 'ui-ux',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'group-hover:shadow-purple-500/20'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    desc: 'From raw idea to market-ready MVP. We handle architecture, development, and deployment strategy.',
    iconKey: 'product',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'group-hover:shadow-orange-500/20'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    desc: 'Native and cross-platform apps (iOS & Android) built for performance and silky-smooth interactions.',
    iconKey: 'mobile',
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'group-hover:shadow-emerald-500/20'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    desc: 'Robust server-side architecture, RESTful/GraphQL APIs, and secure database management.',
    iconKey: 'backend',
    gradient: 'from-indigo-500 to-violet-600',
    shadow: 'group-hover:shadow-indigo-500/20'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    desc: 'Automated CI/CD pipelines, containerization (Docker/K8s), and cloud infrastructure (AWS/Azure).',
    iconKey: 'cloud',
    gradient: 'from-sky-500 to-blue-600',
    shadow: 'group-hover:shadow-sky-500/20'
  }
]

export default function Services() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const res = await api.get('/services')
        const data = Array.isArray(res.data) ? res.data : (res.data.items || [])
        
        if (data.length > 0) {
          // Map gradients to normalized icon keys
          const GRADIENT_MAP = {
            'web-dev': { gradient: 'from-blue-500 to-cyan-400', shadow: 'group-hover:shadow-blue-500/20' },
            'ui-ux': { gradient: 'from-purple-500 to-pink-500', shadow: 'group-hover:shadow-purple-500/20' },
            'product': { gradient: 'from-orange-500 to-red-500', shadow: 'group-hover:shadow-orange-500/20' },
            'mobile': { gradient: 'from-emerald-500 to-teal-400', shadow: 'group-hover:shadow-emerald-500/20' },
            'backend': { gradient: 'from-indigo-500 to-violet-600', shadow: 'group-hover:shadow-indigo-500/20' },
            'cloud': { gradient: 'from-sky-500 to-blue-600', shadow: 'group-hover:shadow-sky-500/20' }
          }
          
          // Merge API data with normalized icon key and correct gradient
          const merged = data.map((item) => {
             const normalizedIconKey = normalizeIconKey(item.iconKey)
             const gradientConfig = GRADIENT_MAP[normalizedIconKey] || GRADIENT_MAP['backend']
             return { 
               ...item, 
               iconKey: normalizedIconKey,
               gradient: gradientConfig.gradient, 
               shadow: gradientConfig.shadow
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* --- Hero Section --- */}
      <div className="relative pt-24 sm:pt-40 pb-12 sm:pb-20 px-4 sm:px-6 container mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6 backdrop-blur-md">
            {t('Our Capabilities') || 'OUR CAPABILITIES'}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight px-2 sm:px-0">
            {t('Engineering') || 'Engineering'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-gradient-x">
              {t('Digital Excellence') || 'Digital Excellence'}
            </span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light px-3 sm:px-0">
            {t('We combine technical expertise with creative innovation to build software that transforms businesses.')}
          </p>
        </motion.div>
      </div>

      {/* --- Services Grid --- */}
      <div className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link 
                to={`/services/${service.id}`}
                className={`
                  group relative flex flex-col justify-between h-full min-h-[300px] sm:min-h-[320px] p-5 sm:p-8 md:p-10
                  bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl md:rounded-[2rem]
                  transition-all duration-500 hover:-translate-y-2 hover:border-white/10
                  ${service.shadow} hover:shadow-2xl
                `}
              >
                {/* Hover Glow Gradient */}
                <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon Container */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`
                    relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-6 sm:mb-8
                    bg-gradient-to-br ${service.gradient} text-white flex-shrink-0 group
                  `}
                >
                  {/* Glow layers */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className={`absolute -inset-1 bg-gradient-to-br ${service.gradient} rounded-2xl opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-300 -z-10`} />
                  <div className={`absolute -inset-3 bg-gradient-to-br ${service.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-300 -z-20`} />
                  
                  {/* Icon */}
                  <span className="relative z-10 drop-shadow-lg filter drop-shadow-xl">
                    {getIcon(service.iconKey)}
                  </span>
                </motion.div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 sm:mb-8 line-clamp-3 group-hover:text-slate-300 transition-colors">
                    {service.shortDescription || service.desc}
                  </p>
                </div>

                {/* Learn More Button */}
                <div className="mt-auto flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                  <span>{t('Explore') || 'Explore'}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black transition-all ${isRtl ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <FaArrowRight className={isRtl ? 'rotate-180' : ''} />
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 sm:mt-20"
        >
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <Link to="/contact" className="block px-6 sm:px-10 py-3 sm:py-4 bg-[#0A0A0A] rounded-full hover:bg-transparent transition-colors text-white font-bold tracking-wide text-sm sm:text-base">
              {t('Start a Project') || 'START A PROJECT'}
            </Link>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  )
}