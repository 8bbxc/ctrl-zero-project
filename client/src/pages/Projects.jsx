import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaStethoscope, FaShoppingCart, FaUtensils, FaBriefcase, 
  FaGraduationCap, FaBuilding, FaArrowRight 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'

// --- 1. تعريف القطاعات (نفس البيانات تماماً) ---
const sectors = [
  { 
    id: 'Medical', 
    label: 'Medical & Health', 
    labelAr: 'الطب والرعاية الصحية',
    icon: <FaStethoscope />, 
    desc: 'Digital solutions for clinics & hospitals',
    descAr: 'حلول رقمية متقدمة للعيادات والمستشفيات',
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    shadow: 'shadow-rose-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'group-hover:border-rose-500/50',
    glowColor: 'bg-rose-500'
  },
  { 
    id: 'E-Commerce', 
    label: 'E-Commerce', 
    labelAr: 'التجارة الإلكترونية',
    icon: <FaShoppingCart />, 
    desc: 'High-conversion online stores',
    descAr: 'متاجر إلكترونية عالية التحويل والأداء',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    shadow: 'shadow-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'group-hover:border-emerald-500/50',
    glowColor: 'bg-emerald-500'
  },
  { 
    id: 'Restaurant', 
    label: 'Restaurants', 
    labelAr: 'المطاعم والضيافة',
    icon: <FaUtensils />, 
    desc: 'Menus & management systems',
    descAr: 'قوائم رقمية وأنظمة إدارة متكاملة',
    gradient: 'from-orange-400 via-amber-500 to-yellow-600',
    shadow: 'shadow-orange-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'group-hover:border-orange-500/50',
    glowColor: 'bg-orange-500'
  },
  { 
    id: 'Corporate', 
    label: 'Corporate', 
    labelAr: 'الشركات والأعمال',
    icon: <FaBriefcase />, 
    desc: 'Professional business portfolios',
    descAr: 'منصات احترافية تعكس هوية الشركة',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
    shadow: 'shadow-blue-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'group-hover:border-blue-500/50',
    glowColor: 'bg-blue-500'
  },
  { 
    id: 'Education', 
    label: 'Education', 
    labelAr: 'التعليم والتدريب',
    icon: <FaGraduationCap />, 
    desc: 'LMS & E-learning platforms',
    descAr: 'منصات تعليمية وتدريبية تفاعلية',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    shadow: 'shadow-purple-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'group-hover:border-purple-500/50',
    glowColor: 'bg-purple-500'
  },
  { 
    id: 'Real Estate', 
    label: 'Real Estate', 
    labelAr: 'العقارات',
    icon: <FaBuilding />, 
    desc: 'Property listing & booking engines',
    descAr: 'محركات حجز وعرض عقارات غامرة',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    shadow: 'shadow-cyan-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'group-hover:border-cyan-500/50',
    glowColor: 'bg-cyan-500'
  }
]

export default function Projects() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden pb-24">
      <Navbar />
      
      {/* --- 2. خلفية فنية هادئة (Refined Background) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradients are darker and more subtle now */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative z-10">
        
        {/* --- 3. العنوان الرئيسي (Header) --- */}
        <div className="text-center mb-16 sm:mb-24 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {isArabic ? 'استكشف قطاعاتنا' : 'OUR EXPERTISE'}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
              {isArabic ? 'مشاريعنا حسب' : 'Crafting Digital'} <br/> 
              <span className="relative inline-block">
                <span className="absolute -inset-1 blur-2xl opacity-30 bg-gradient-to-r from-cyan-400 to-purple-600"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
                  {isArabic ? 'القطاع' : 'Industries'}
                </span>
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نحول الرؤى إلى واقع رقمي عبر قطاعات متعددة. اختر المجال لاستكشاف دراسات الحالة.' 
                : 'Transforming visions into digital reality across tailored sectors. Select an industry to explore our case studies.'}
            </p>
          </motion.div>
        </div>

        {/* --- 4. الشبكة الاحترافية (The Pro Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                to={`/projects/sector/${sector.id}`}
                className={`
                  group relative block h-[280px] rounded-2xl overflow-hidden 
                  bg-[#0A0A0A] border border-white/5
                  transition-all duration-500 ease-out
                  hover:-translate-y-2
                  ${sector.borderColor}
                `}
              >
                {/* تأثير الإضاءة الخلفية عند الهوفر - Spotlight Effect */}
                <div className={`
                    absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[80px] opacity-0 
                    group-hover:opacity-20 transition-opacity duration-700
                    ${sector.glowColor} -mr-20 -mt-20 pointer-events-none
                `} />

                <div className="relative h-full p-8 flex flex-col justify-between z-10">
                  
                  {/* الرأس: الأيقونة والسهم */}
                  <div className="flex justify-between items-start">
                    {/* وعاء الأيقونة المتطور */}
                    <div className={`
                      relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                      bg-white/5 border border-white/5 shadow-inner backdrop-blur-sm
                      transition-all duration-500 ease-out
                      ${sector.iconColor}
                      group-hover:scale-110 group-hover:bg-gradient-to-br ${sector.gradient} group-hover:text-white group-hover:border-transparent group-hover:shadow-lg
                    `}>
                      <span className="relative z-10">{sector.icon}</span>
                    </div>

                    {/* زر السهم الدائري */}
                    <div className={`
                      w-10 h-10 rounded-full border border-white/5 flex items-center justify-center
                      text-slate-500 bg-transparent
                      transition-all duration-300
                      group-hover:border-white/20 group-hover:text-white group-hover:rotate-[-45deg]
                      ${isArabic ? 'group-hover:rotate-[45deg]' : 'group-hover:rotate-[-45deg]'}
                    `}>
                      <FaArrowRight className={`text-sm transform ${isArabic ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* النصوص */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors duration-300">
                      {isArabic ? sector.labelAr : sector.label}
                    </h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed group-hover:text-slate-300 transition-colors duration-300 border-l-2 border-transparent pl-0 group-hover:pl-3 group-hover:border-white/20">
                      {isArabic ? sector.descAr : sector.desc}
                    </p>
                  </div>

                  {/* خط سفلي نحيف جداً يتوهج */}
                  <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${sector.gradient} transition-all duration-500 group-hover:w-full`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}