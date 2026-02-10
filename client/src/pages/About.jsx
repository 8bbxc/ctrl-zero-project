import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaUserAstronaut, FaCode, FaLayerGroup, FaArrowRight, FaAward, FaProjectDiagram, FaCoffee } from 'react-icons/fa'

// --- مكون البطاقة الإحصائية ---
const StatCard = ({ icon, value, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="text-3xl text-cyan-400 mb-2 group-hover:scale-110 transition-transform relative z-10">{icon}</div>
    <h3 className="text-4xl font-black text-white mb-1 relative z-10">{value}</h3>
    <p className="text-sm text-slate-400 font-mono uppercase tracking-widest relative z-10">{label}</p>
  </motion.div>
)

export default function About() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // تأثير الحركة للصور (Parallax)
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  // بيانات الأقسام (مع صورك الخاصة)
  const sections = [
    {
      id: 'intro',
      title: t('about.introTitle') || 'The Visionary',
      subtitle: 'Who I Am',
      content: t('about.introBody') || 'I am not just a developer; I am a digital architect bridging the gap between imagination and reality.',
      image: '/images/about/me.jpeg', // صورتك الشخصية
      icon: <FaUserAstronaut />,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'tech',
      title: t('about.techTitle') || 'The Engineer',
      subtitle: 'Code is my Craft',
      content: t('about.techBody') || 'Writing clean, scalable, and efficient code is not just a job, it is a craft I have perfected over years of dedication.',
      image: '/images/about/Web-Development.jpg', // صورة التطوير
      icon: <FaCode />,
      gradient: 'from-emerald-400 to-green-600',
    },
    {
      id: 'design',
      title: t('about.designTitle') || 'The Artist',
      subtitle: 'Design Philosophy',
      content: t('about.designBody') || 'Functionality without beauty is boring. I blend aesthetics with usability to create immersive experiences.',
      image: '/images/about/Web-Desgin.jpg', // صورة التصميم (تأكد من الاسم Desgin أو Design في ملفاتك)
      icon: <FaLayerGroup />,
      gradient: 'from-purple-500 to-pink-600',
    }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] relative overflow-hidden text-slate-50 font-sans selection:bg-cyan-500/30">
      
      {/* --- 1. Ambient Background (متحرك) --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- 2. Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
              {t('about.pageTitle') || 'ABOUT ME'}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 animate-gradient-x">
                DIGITAL REALITY
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {t('about.introBody') ? t('about.introBody').substring(0, 100) + '...' : "Combining engineering precision with artistic vision to craft web experiences that leave a mark."}
          </motion.p>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-sm flex flex-col items-center gap-2"
        >
          <span className="uppercase tracking-widest text-[10px]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* --- 3. Statistics Strip --- */}
      <section className="container mx-auto px-6 mb-32 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FaAward />} value="4+" label="Years Exp." delay={0.1} />
          <StatCard icon={<FaProjectDiagram />} value="25+" label="Projects" delay={0.2} />
          <StatCard icon={<FaUserAstronaut />} value="10+" label="Happy Clients" delay={0.3} />
          <StatCard icon={<FaCoffee />} value="∞" label="Coffee Cups" delay={0.4} />
        </div>
      </section>

      {/* --- 4. Main Story Sections --- */}
      <div className="container mx-auto px-6 md:px-12 pb-32 space-y-32 relative z-10">
        {sections.map((section, index) => {
          const isEven = index % 2 === 0
          
          return (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              
              {/* Image Area */}
              <motion.div 
                style={{ y: isEven ? y : 0 }} // Parallax effect
                className="flex-1 w-full relative group perspective-1000"
              >
                {/* Glow Behind */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-20 blur-[80px] group-hover:opacity-40 transition-opacity duration-700`} />
                
                {/* Image Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A] p-2 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[4/3] relative">
                    {/* Dark Overlay that clears on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10" />
                    
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
                    />

                    {/* Floating Icon Badge */}
                    <div className={`absolute bottom-6 ${isRtl ? 'left-6' : 'right-6'} w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-3xl text-white shadow-lg z-20`}>
                      {section.icon}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Area */}
              <div className={`flex-1 ${isRtl ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={`flex items-center gap-4 mb-4 justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    <span className={`h-[2px] w-12 bg-gradient-to-r ${section.gradient}`}></span>
                    <span className={`text-sm font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r ${section.gradient}`}>
                      {section.subtitle}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                    {section.title}
                  </h2>
                  
                  <div className="relative">
                     {/* Decorative Quote Mark */}
                     <span className={`absolute -top-4 ${isRtl ? '-right-6' : '-left-6'} text-6xl text-white/5 font-serif`}>“</span>
                     <p className="text-lg text-slate-400 leading-relaxed font-light mb-8">
                       {section.content}
                     </p>
                  </div>

                  {/* Decorative Dots */}
                  <div className={`flex gap-3 justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'}`}>
                     {[...Array(3)].map((_, i) => (
                       <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/20'}`} />
                     ))}
                  </div>
                </motion.div>
              </div>

            </motion.div>
          )
        })}
      </div>

      {/* --- 5. Call to Action --- */}
      <section className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
           <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
             {t('contact.title') || 'Ready to Create Magic?'}
           </h2>
           <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg font-light">
             {t('contact.subtitle') || "Let's turn your vision into a digital masterpiece. I am available for freelance projects."}
           </p>
           
           <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="inline-block"
           >
             <a 
               href="/contact" 
               className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:bg-cyan-50 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
             >
               <span>{t('contact.btn') || 'Let\'s Talk'}</span>
               {isRtl ? <FaArrowRight className="rotate-180" /> : <FaArrowRight />}
             </a>
           </motion.div>
        </div>
      </section>

    </div>
  )
}