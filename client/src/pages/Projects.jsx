import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaStethoscope, FaShoppingCart, FaUtensils, FaBriefcase, 
  FaGraduationCap, FaBuilding 
} from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar' // Ensure you have this component or remove if not needed
import Footer from '../components/Footer' // Ensure you have this component or remove if not needed

// Definition of sectors with colors, icons, and descriptions
const sectors = [
  { 
    id: 'Medical', 
    label: 'Medical & Health', 
    labelAr: 'الطب والرعاية الصحية',
    icon: <FaStethoscope />, 
    desc: 'Digital solutions for clinics & hospitals',
    descAr: 'حلول رقمية متقدمة لعيادات ومستشفيات',
    color: 'from-red-500/20 to-pink-600/20', 
    border: 'group-hover:border-red-500/50', 
    text: 'group-hover:text-red-400' 
  },
  { 
    id: 'E-Commerce', 
    label: 'E-Commerce', 
    labelAr: 'التجارة الإلكترونية',
    icon: <FaShoppingCart />, 
    desc: 'High-conversion online stores',
    descAr: 'متاجر إلكترونية عالية التحويل',
    color: 'from-emerald-500/20 to-green-600/20', 
    border: 'group-hover:border-emerald-500/50', 
    text: 'group-hover:text-emerald-400' 
  },
  { 
    id: 'Restaurant', 
    label: 'Restaurants', 
    labelAr: 'المطاعم والضيافة',
    icon: <FaUtensils />, 
    desc: 'Menus & management systems',
    descAr: 'قوائم رقمية وأنظمة إدارة متقدمة',
    color: 'from-orange-500/20 to-yellow-600/20', 
    border: 'group-hover:border-orange-500/50', 
    text: 'group-hover:text-orange-400' 
  },
  { 
    id: 'Corporate', 
    label: 'Corporate', 
    labelAr: 'الشركات والأعمال',
    icon: <FaBriefcase />, 
    desc: 'Professional business portfolios',
    descAr: 'منصات احترافية لهيبة العلامة التجارية',
    color: 'from-blue-500/20 to-indigo-600/20', 
    border: 'group-hover:border-blue-500/50', 
    text: 'group-hover:text-blue-400' 
  },
  { 
    id: 'Education', 
    label: 'Education', 
    labelAr: 'التعليم والتدريب',
    icon: <FaGraduationCap />, 
    desc: 'LMS & E-learning platforms',
    descAr: 'منصات تعليمية تفاعلية متطورة',
    color: 'from-purple-500/20 to-violet-600/20', 
    border: 'group-hover:border-purple-500/50', 
    text: 'group-hover:text-purple-400' 
  },
  { 
    id: 'Real Estate', 
    label: 'Real Estate', 
    labelAr: 'العقارات',
    icon: <FaBuilding />, 
    desc: 'Property listing & booking engines',
    descAr: 'معارض عقارية غامرة ومحركات حجز',
    color: 'from-cyan-500/20 to-sky-600/20', 
    border: 'group-hover:border-cyan-500/50', 
    text: 'group-hover:text-cyan-400' 
  }
]

export default function Projects() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-black text-slate-50 font-sans selection:bg-cyan-500/30">
      {/* If you are not using separate Navbar/Footer components in this file structure, 
          you can remove these lines or replace them with your layout wrapper */}
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] mb-4 block glow-text">
              {isArabic ? 'استكشف القطاعات' : 'EXPLORE SECTORS'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
              {isArabic ? 'تصفح أعمالنا حسب' : 'Filter by'} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {isArabic ? 'الصناعة' : 'Industry'}
              </span>
            </h1>
            <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
              {isArabic 
                ? 'اكتشف مشاريعنا المتخصصة عبر مختلف الصناعات والمجالات.' 
                : 'Discover our specialized projects across various industries.'}
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, index) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/projects/${sector.id}`} // Clicking here navigates to the sector specific page
                className={`
                  group relative flex flex-col justify-between p-8 h-64 rounded-3xl border border-white/5 
                  bg-gradient-to-br ${sector.color} backdrop-blur-xl transition-all duration-500
                  hover:-translate-y-2 hover:shadow-2xl hover:border-opacity-50
                  ${sector.border}
                `}
              >
                {/* Icon & Arrow */}
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl bg-black/20 text-3xl transition-colors ${sector.text}`}>
                    {sector.icon}
                  </div>
                  <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all`}>
                    <span className="text-xl">↗</span>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white/90">
                    {isArabic ? sector.labelAr : sector.label}
                  </h3>
                  <p className="text-slate-400 text-sm font-light group-hover:text-slate-300">
                    {isArabic ? sector.descAr : sector.desc}
                  </p>
                </div>

                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r ${sector.color}`} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  )
}