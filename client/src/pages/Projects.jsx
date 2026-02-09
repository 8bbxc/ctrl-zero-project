import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaStethoscope, FaShoppingCart, FaUtensils, FaBriefcase, 
  FaGraduationCap, FaBuilding 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'

// --- 1. تعريف القطاعات مع ألوان نيون قوية ---
const sectors = [
  { 
    id: 'Medical', 
    label: 'Medical & Health', 
    labelAr: 'الطب والرعاية الصحية',
    icon: <FaStethoscope />, 
    desc: 'Digital solutions for clinics & hospitals',
    descAr: 'حلول رقمية متقدمة للعيادات والمستشفيات',
    // ألوان التدرج والظلال
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    shadow: 'group-hover:shadow-rose-500/40',
    iconColor: 'text-rose-400',
    borderColor: 'group-hover:border-rose-500/50'
  },
  { 
    id: 'E-Commerce', 
    label: 'E-Commerce', 
    labelAr: 'التجارة الإلكترونية',
    icon: <FaShoppingCart />, 
    desc: 'High-conversion online stores',
    descAr: 'متاجر إلكترونية عالية التحويل والأداء',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    shadow: 'group-hover:shadow-emerald-500/40',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/50'
  },
  { 
    id: 'Restaurant', 
    label: 'Restaurants', 
    labelAr: 'المطاعم والضيافة',
    icon: <FaUtensils />, 
    desc: 'Menus & management systems',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة',
    gradient: 'from-orange-400 via-amber-500 to-yellow-600',
    shadow: 'group-hover:shadow-orange-500/40',
    iconColor: 'text-orange-400',
    borderColor: 'group-hover:border-orange-500/50'
  },
  { 
    id: 'Corporate', 
    label: 'Corporate', 
    labelAr: 'الشركات والأعمال',
    icon: <FaBriefcase />, 
    desc: 'Professional business portfolios',
    descAr: 'منصات احترافية تعكس هوية الشركة',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
    shadow: 'group-hover:shadow-blue-500/40',
    iconColor: 'text-blue-400',
    borderColor: 'group-hover:border-blue-500/50'
  },
  { 
    id: 'Education', 
    label: 'Education', 
    labelAr: 'التعليم والتدريب',
    icon: <FaGraduationCap />, 
    desc: 'LMS & E-learning platforms',
    descAr: 'منصات تعليمية وتدريبية تفاعلية',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    shadow: 'group-hover:shadow-purple-500/40',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/50'
  },
  { 
    id: 'Real Estate', 
    label: 'Real Estate', 
    labelAr: 'العقارات',
    icon: <FaBuilding />, 
    desc: 'Property listing & booking engines',
    descAr: 'محركات حجز وعرض عقارات غامرة',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadow: 'group-hover:shadow-cyan-500/40',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/50'
  }
]

export default function Projects() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <Navbar />
      
      {/* --- 2. خلفية فنية متحركة (Ambient Background) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* --- 3. العنوان الرئيسي (Header) --- */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
              {isArabic ? 'استكشف قطاعاتنا' : 'OUR EXPERTISE'}
            </span>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight tracking-tight">
              {isArabic ? 'تصفح المشاريع حسب' : 'Browse Projects by'} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                {isArabic ? 'القطاع' : 'Industry'}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نقدم حلولاً رقمية مصممة خصيصاً لتلبية احتياجات كل قطاع، من الرعاية الصحية إلى التجارة الإلكترونية.' 
                : 'Discover our tailored digital solutions across various industries, from healthcare to e-commerce.'}
            </p>
          </motion.div>
        </div>

        {/* --- 4. شبكة البطاقات الأسطورية (The Legendary Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                to={`/projects/sector/${sector.id}`}
                className={`
                  group relative block h-[320px] rounded-[2rem] overflow-hidden 
                  bg-slate-900/40 backdrop-blur-xl border border-white/5
                  transition-all duration-500 ease-out
                  hover:-translate-y-3 hover:scale-[1.02]
                  ${sector.shadow} hover:shadow-2xl
                  ${sector.borderColor}
                `}
              >
                {/* تأثير التوهج الخلفي عند الهوفر */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br ${sector.gradient}`} />
                
                {/* دائرة ضوء خلفية خفيفة */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-white/10" />

                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  
                  {/* الأيقونة وزر السهم */}
                  <div className="flex justify-between items-start">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-3xl 
                      bg-white/5 border border-white/10 shadow-lg backdrop-blur-md
                      transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10
                      ${sector.iconColor}
                    `}>
                      {sector.icon}
                    </div>

                    <div className={`
                      w-12 h-12 rounded-full border border-white/10 flex items-center justify-center 
                      text-white/50 transition-all duration-300 
                      group-hover:bg-white group-hover:text-black group-hover:border-transparent group-hover:rotate-45
                    `}>
                      <span className="text-xl">↗</span>
                    </div>
                  </div>

                  {/* النصوص */}
                  <div>
                    <h3 className={`text-3xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${sector.gradient}`}>
                      {isArabic ? sector.labelAr : sector.label}
                    </h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed group-hover:text-slate-200 transition-colors">
                      {isArabic ? sector.descAr : sector.desc}
                    </p>
                  </div>

                  {/* خط سفلي ملون (Progress Line) */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                    <div className={`h-full w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r ${sector.gradient}`} />
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}