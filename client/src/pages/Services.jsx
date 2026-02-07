import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaLaptopCode, FaPaintBrush, FaRocket, FaServer, FaMobileAlt, FaCloud } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'

export default function Services() {
  const { t, i18n } = useTranslation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // خدمات افتراضية (تظهر في حال لم يكن هناك بيانات في قاعدة البيانات)
  const defaultServices = [
    {
      id: 'web-dev',
      title: 'Full-Stack Development',
      desc: 'End-to-end web solutions using modern stacks (React, Node.js, Postgres). We build scalable, secure, and high-performance applications.',
      icon: <FaLaptopCode />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      desc: 'Crafting intuitive and engaging user experiences. We focus on accessibility, aesthetics, and conversion-driven interfaces.',
      icon: <FaPaintBrush />,
      color: 'from-purple-500 to-pink-400'
    },
    {
      id: 'product',
      title: 'Product Engineering',
      desc: 'Turning raw ideas into market-ready MVPs. We handle the entire lifecycle from architectural planning to deployment.',
      icon: <FaRocket />,
      color: 'from-orange-400 to-red-500'
    },
    {
      id: 'mobile',
      title: 'Mobile Development',
      desc: 'Native and Cross-platform mobile apps that perform flawlessly on iOS and Android devices.',
      icon: <FaMobileAlt />,
      color: 'from-emerald-400 to-green-500'
    },
    {
      id: 'backend',
      title: 'Backend & API',
      desc: 'Robust server-side architecture, RESTful APIs, and GraphQL integration ensuring your data is secure and fast.',
      icon: <FaServer />,
      color: 'from-indigo-500 to-violet-500'
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      desc: 'Seamless deployment pipelines, cloud infrastructure management (AWS/DigitalOcean), and containerization.',
      icon: <FaCloud />,
      color: 'from-sky-400 to-blue-600'
    }
  ]

  useEffect(() => {
    // Attempt to fetch from backend via api instance (points to http://localhost:4000/api)
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/services')
        const data = res.data
        if (Array.isArray(data) && data.length > 0) {
          setServices(data)
        } else {
          setServices(defaultServices)
        }
      } catch (err) {
        console.error('Services load failed:', err)
        setServices(defaultServices)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const dir = i18n.dir()

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {t('services.ourServices') || 'Our Premium Services'}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            {t('services.ourServicesDesc') || 'We deliver engineering excellence across the entire tech stack. From stunning interfaces to powerful backends, we cover it all.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
            >
              {/* Hover Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color || 'from-blue-500 to-purple-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color || 'from-blue-500 to-purple-500'} flex items-center justify-center text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {service.icon ? (typeof service.icon === 'string' ? <img src={service.icon} alt="" className="w-8 h-8 object-contain"/> : service.icon) : <FaLaptopCode />}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-400 mb-6 leading-relaxed line-clamp-3">
                {service.shortDescription || service.desc}
              </p>

              {/* Action Link */}
              <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {t('services.learnMore') || 'Learn More'}
                </span>
                <HiArrowRight className={`text-accent transform transition-transform duration-300 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </div>

              {/* Click Area Overlay (Makes whole card clickable if using link logic) */}
              {service.id && (
                <Link to={`/services/${service.id}`} className="absolute inset-0 z-10" aria-label={service.title} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <Link to="/contact" className="block px-10 py-4 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors text-white font-bold text-lg">
              {t('services.cta') || 'Start Your Project'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}