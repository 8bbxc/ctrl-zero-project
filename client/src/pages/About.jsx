import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaUserTie, FaLaptopCode, FaPaintBrush, FaQuoteLeft } from 'react-icons/fa'

export default function About() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isRtl = dir === 'rtl'

  // بيانات الأقسام مع إضافة الأيقونات
  const sections = [
    {
      id: 'intro',
      title: t('about.introTitle') || 'Who I Am',
      content: t('about.introBody'),
      image: '/images/about/me.jpeg',
      icon: <FaUserTie />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tech',
      title: t('about.techTitle') || 'Engineering & Tech',
      content: t('about.techBody'),
      image: '/images/about/Web-Development.jpg',
      icon: <FaLaptopCode />,
      color: 'from-emerald-500 to-green-500'
    },
    {
      id: 'design',
      title: t('about.designTitle') || 'Design Philosophy',
      content: t('about.designBody'),
      image: '/images/about/Web-Desgin.jpg', // المسار كما هو في ملفاتك
      icon: <FaPaintBrush />,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 py-24 relative overflow-hidden text-slate-50 font-sans selection:bg-accent selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <span className="text-accent font-mono text-sm uppercase tracking-[0.2em] mb-4 block">
            {t('about.pageTitle') || 'ABOUT ME'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Digital Reality</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full opacity-50" />
        </motion.div>

        {/* Sections Loop */}
        <div className="space-y-32">
          {sections.map((section, index) => {
            const isEven = index % 2 === 0
            
            return (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                
                {/* 1. Image Column */}
                <div className="flex-1 w-full relative group">
                  {/* الخلفية الملونة المتوهجة */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity duration-700`} />
                  
                  {/* إطار الصورة */}
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-sm p-2">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img 
                          src={section.image} 
                          alt={section.title} 
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                  </div>

                  {/* أيقونة عائمة */}
                  <div className={`absolute -bottom-6 ${isRtl ? (isEven ? '-left-6' : '-right-6') : (isEven ? '-right-6' : '-left-6')} w-16 h-16 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center text-2xl text-white shadow-xl z-20 hidden md:flex`}>
                    {section.icon}
                  </div>
                </div>

                {/* 2. Text Column */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className={`h-px w-12 bg-gradient-to-r ${section.color}`}></span>
                    <span className={`text-sm font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${section.color}`}>
                      0{index + 1}. {section.title}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {section.title}
                  </h2>
                  
                  <div className="relative">
                    <FaQuoteLeft className="absolute -top-2 -left-4 text-white/5 text-4xl" />
                    <p className="text-slate-400 text-lg leading-relaxed relative z-10 font-light">
                      {section.content}
                    </p>
                  </div>

                  {/* زخرفة بسيطة */}
                  <div className="pt-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-12 h-2 rounded-full bg-white/10" />
                  </div>
                </div>

              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  )
}