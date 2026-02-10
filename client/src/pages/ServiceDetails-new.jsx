import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaArrowRight, FaLaptopCode, FaPaintBrush, 
  FaRocket, FaServer, FaMobileAlt, FaCloud, FaCheck, FaCode 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- Default Services Data (Enhanced Colors) ---
const DEFAULT_SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Development',
    shortDescription: 'Scalable, high-performance web applications built for growth.',
    fullContent: 'We build end-to-end web solutions using modern stacks like React, Node.js, and Postgres. Our approach includes strategic planning, beautiful UIs, robust backends, and seamless deployments. We ensure your application is future-proof and scalable.',
    features: ['React & Next.js', 'Node.js / Python', 'PostgreSQL / Mongo', 'High Scalability'],
    icon: <FaLaptopCode />,
    color: '#06b6d4', // Cyan-500
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    shortDescription: 'Crafting intuitive interfaces that users love.',
    fullContent: 'Design is not just about looks; it’s about how it works. We craft interfaces that users love. Every pixel is intentional. Every interaction is smooth. We focus on accessibility, performance, and conversion optimization.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    icon: <FaPaintBrush />,
    color: '#a855f7', // Purple-500
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'product',
    title: 'Product Engineering',
    shortDescription: 'Transforming raw ideas into market-ready products.',
    fullContent: 'From concept to launch. We handle everything: strategy, design, development, testing, and deployment. Our goal is to help you build products that matter and solve real problems for your users.',
    features: ['MVP Strategy', 'Agile Process', 'Market Fit', 'Growth Hacking'],
    icon: <FaRocket />,
    color: '#f97316', // Orange-500
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    shortDescription: 'Native and cross-platform mobile experiences.',
    fullContent: 'High-performance apps for iOS and Android. We use React Native for cross-platform efficiency or native technologies for maximum performance. We ensure smooth animations and native feel.',
    features: ['React Native', 'iOS & Android', 'Offline Mode', 'App Store SEO'],
    icon: <FaMobileAlt />,
    color: '#10b981', // Emerald-500
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'backend',
    title: 'Backend & API',
    shortDescription: 'Secure, scalable, and lightning-fast server architecture.',
    fullContent: 'We build robust backends that power your business logic. From REST APIs to GraphQL, real-time websockets, and microservices. We prioritize security, data integrity, and speed.',
    features: ['REST / GraphQL', 'Microservices', 'Auth & Security', 'AWS / Cloud'],
    icon: <FaServer />,
    color: '#6366f1', // Indigo-500
    gradient: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'cloud',
    title: 'Cloud & DevOps',
    shortDescription: 'Automated infrastructure and seamless deployment.',
    fullContent: 'From CI/CD pipelines to containerization and cloud management. We ensure your app is always available, secure, and performing at peak capacity. Let us handle the servers while you focus on business.',
    features: ['CI/CD Pipelines', 'Docker & K8s', 'AWS / Azure', '24/7 Monitoring'],
    icon: <FaCloud />,
    color: '#3b82f6', // Blue-500
    gradient: 'from-blue-500 to-sky-600'
  }
]

// Variants for Animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true)
      
      // 1. Try Local Data
      const localService = DEFAULT_SERVICES.find(s => s.id === id)
      if (localService) {
        setService(localService)
        setLoading(false)
        return
      }

      // 2. Try API (fallback)
      if (/^\d+$/.test(String(id))) {
        try {
          const res = await api.get(`/services/${id}`)
          setService(res.data)
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030305]">
      <Spinner />
    </div>
  )

  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030305] text-white">
      <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
      <Link to="/services" className="px-6 py-2 bg-white text-black rounded-full font-bold">Back to Services</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Dynamic Background Glow based on Service Color */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
          style={{ backgroundColor: service.color }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
          {/* Back Navigation */}
          <button 
            onClick={() => navigate(-1)} 
            className="group mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />}
            <span>{isRtl ? 'رجوع' : 'Back'}</span>
          </button>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Icon Box */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div 
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl text-white shadow-2xl bg-gradient-to-br ${service.gradient}`}
                style={{ boxShadow: `0 10px 40px -10px ${service.color}50` }}
              >
                {service.icon}
              </div>
            </motion.div>

            {/* Texts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
                {service.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT GRID ================= */}
      <section className="py-12 md:py-20 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* --- Left Column: Main Content --- */}
            <motion.div 
              className="lg:col-span-2 space-y-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Overview */}
              <motion.div variants={itemVariants} className="prose prose-invert prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: service.color }}></span>
                  {isRtl ? 'نظرة عامة' : 'Overview'}
                </h3>
                <p className="text-slate-400 leading-8">
                  {service.fullContent}
                </p>
              </motion.div>

              {/* Our Process (Static Example) */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {isRtl ? 'كيف نعمل؟' : 'How We Work'}
                </h3>
                <div className="grid gap-4">
                  {[
                    { title: 'Discovery', desc: 'Understanding your goals and requirements.' },
                    { title: 'Strategy', desc: 'Planning the architecture and roadmap.' },
                    { title: 'Execution', desc: 'Development with agile methodology.' },
                    { title: 'Launch', desc: 'Deployment, testing, and handover.' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-sm font-bold text-white border border-white/10">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-white font-bold text-base">{step.title}</h4>
                        <p className="text-sm text-slate-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* --- Right Column: Sidebar --- */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="sticky top-28 space-y-6">
                
                {/* Features Card */}
                <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-xl">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    {isRtl ? 'التقنيات والميزات' : 'Key Features'}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {service.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                         <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-white/5 text-[10px]" style={{ color: service.color }}>
                           <FaCheck />
                         </span>
                         {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Card */}
                <div 
                  className="p-6 rounded-2xl relative overflow-hidden text-center border border-white/10"
                  style={{ background: `linear-gradient(145deg, ${service.color}15, transparent)` }}
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {isRtl ? 'هل أنت مستعد؟' : 'Ready to Start?'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                      {isRtl ? 'دعنا نبني شيئاً عظيماً معاً.' : 'Let’s build something amazing together.'}
                    </p>
                    <Link 
                      to="/contact" 
                      className="block w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-transform hover:scale-105"
                      style={{ backgroundColor: service.color, boxShadow: `0 4px 20px ${service.color}40` }}
                    >
                      {isRtl ? 'تواصل معنا الآن' : 'Get in Touch'}
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5">
        <Footer />
      </div>
    </div>
  )
}