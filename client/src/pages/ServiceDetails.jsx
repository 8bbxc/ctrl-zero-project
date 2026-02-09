import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight, FaWhatsapp, FaCheckCircle, FaLaptopCode, FaPaintBrush, FaRocket, FaServer, FaMobileAlt, FaCloud } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function ServiceDetails() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  const dir = i18n.dir()
  const isRtl = dir === 'rtl'

  // --- البيانات الافتراضية (لحل مشكلة الخدمات التجريبية) ---
  const defaultServices = [
    {
      id: 'web-dev',
      title: 'Full-Stack Development',
      shortDescription: 'End-to-end web solutions using modern stacks (React, Node.js, Postgres).',
      fullContent: `We build scalable, secure, and high-performance applications.
      
      Our process includes:
      1. Requirement Analysis
      2. Architecture Design
      3. Frontend & Backend Development
      4. Testing & Deployment`,
      icon: <FaLaptopCode />,
      image: '/images/home/1.jpg' // صورة افتراضية
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      shortDescription: 'Crafting intuitive and engaging user experiences.',
      fullContent: 'We focus on accessibility, aesthetics, and conversion-driven interfaces.',
      icon: <FaPaintBrush />,
      image: '/images/home/2.jpg'
    },
    {
      id: 'product',
      title: 'Product Engineering',
      shortDescription: 'Turning raw ideas into market-ready MVPs.',
      fullContent: 'From architectural planning to deployment, we handle the entire lifecycle.',
      icon: <FaRocket />,
      image: '/images/home/3.jpg'
    },
    {
      id: 'mobile',
      title: 'Mobile Apps',
      shortDescription: 'Native and Cross-platform mobile apps.',
      fullContent: 'High performance apps on iOS and Android devices using React Native.',
      icon: <FaMobileAlt />,
      image: '/images/home/4.jpg'
    },
    {
      id: 'backend',
      title: 'Backend & API',
      shortDescription: 'Robust server-side architecture and RESTful APIs.',
      fullContent: 'Ensuring your data is secure, fast, and scalable.',
      icon: <FaServer />,
      image: '/images/home/1.jpg'
    },
    {
      id: 'cloud',
      title: 'Cloud & DevOps',
      shortDescription: 'Seamless deployment pipelines and cloud infrastructure.',
      fullContent: 'Management of AWS, DigitalOcean, and Docker containerization.',
      icon: <FaCloud />,
      image: '/images/home/2.jpg'
    }
  ]

  useEffect(() => {
    const fetchService = async () => {
      console.log('🔧 ServiceDetails - Fetching service:', { id, type: typeof id });
      
      // Guard against undefined id
      if (!id) {
        console.warn('⚠️ ServiceDetails - No ID provided');
        setService(null);
        setLoading(false);
        return;
      }

      // Treat purely numeric IDs as DB IDs; otherwise treat as a slug/key
      const isNumericId = /^\d+$/.test(String(id));
      console.log('🔧 ServiceDetails - isNumericId:', isNumericId);

      if (!isNumericId) {
        // Try local/default services for slugs like 'web-dev'
        const localService = defaultServices.find(s => s.id === id);
        console.log('🔧 ServiceDetails - Looking for local service with id:', id, 'Found:', !!localService);
        if (localService) {
          setService(localService);
          setLoading(false);
          return;
        }

        // If not found locally, show not-found without calling API (per requirement)
        setService(null);
        setLoading(false);
        return;
      }

      // Numeric ID -> call backend
      try {
        console.log('🔧 ServiceDetails - Fetching from API: /services/', id);
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error('❌ ServiceDetails - Error fetching service', err);
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><Spinner /></div>
  
  if (!service) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
      <h2 className="text-2xl font-bold">Service not found</h2>
      <Link to="/services" className="btn-primary px-6 py-2">Back to Services</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      {/* 1. Hero Image Section */}
      <div className="relative h-[60vh] w-full overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-950 z-20" />
        
        {service.image ? (
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
             <div className="text-center">
                <FaLaptopCode className="text-6xl mx-auto mb-4 opacity-20" />
                <span className="text-2xl font-bold opacity-30">CTRL ZERO SERVICE</span>
             </div>
          </div>
        )}
        
        {/* Back Button */}
        <Link 
          to="/services" 
          className={`absolute top-8 z-30 flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 group ${isRtl ? 'right-8' : 'left-8'}`}
        >
          {isRtl ? <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> : <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />}
          <span className="font-medium">{t('Back to Services') || 'Back to Services'}</span>
        </Link>

        {/* Hero Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-30 pb-24 pt-32 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="container mx-auto px-4">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="max-w-4xl"
             >
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
                  {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl leading-relaxed drop-shadow-lg">
                  {service.shortDescription}
                </p>
             </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Content Container */}
      <div className="container mx-auto px-4 relative z-20 -mt-10 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />

               <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
                    {service.icon ? (
                      typeof service.icon === 'string' ? (
                        <img src={service.icon} alt="" className="w-10 h-10 object-contain" />
                      ) : <span className="text-accent">{service.icon}</span>
                    ) : <FaCheckCircle className="text-accent" />}
                  </div>
                  <div>
                    <span className="text-accent font-mono text-xs uppercase tracking-widest">{t('Service Details')}</span>
                    <h2 className="text-2xl font-bold text-white">{t('Overview')}</h2>
                  </div>
               </div>

               <div className="prose prose-invert prose-lg max-w-none">
                 <div className="text-slate-300 whitespace-pre-wrap leading-loose font-light text-lg">
                   {service.fullContent || t('No detailed description available yet.')}
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Sidebar CTA */}
          <motion.div 
            initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-8 shadow-xl sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-2">{t('Ready to start?')}</h3>
              <p className="text-slate-400 mb-6 text-sm">{t('Let’s turn this service into a reality for your business.')}</p>
              
              <div className="space-y-3">
                <Link to="/contact" className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all">
                  {t('Get a Quote')} {isRtl ? <FaArrowLeft /> : <FaArrowRight />}
                </Link>
                
                <a 
                  href="https://wa.me/qr/ZEUXAVWSSI44K1" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full py-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <FaWhatsapp className="text-xl" /> {t('Chat on WhatsApp')}
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">{t('Why Choose Us?')}</h4>
                <ul className="space-y-2">
                  {['Professional Engineering', '24/7 Support', 'Scalable Solutions'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <FaCheckCircle className="text-accent text-xs" /> {t(item) || item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}