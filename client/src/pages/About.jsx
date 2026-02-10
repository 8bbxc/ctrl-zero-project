import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  FaUserAstronaut, FaCode, FaLayerGroup, FaArrowRight, 
  FaAward, FaProjectDiagram, FaCoffee, FaLightbulb, FaHandshake, FaStopwatch 
} from 'react-icons/fa'

// --- مكون البطاقة الإحصائية (Updated Style) ---
const StatCard = ({ icon, value, label, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex flex-col items-center justify-center p-6 bg-slate-900/30 border border-slate-800/40 rounded-2xl backdrop-blur-md hover:bg-slate-900/50 hover:border-cyan-600/40 transition-all group relative overflow-hidden"
  >
    {/* Glow Effect */}
    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl -z-10 group-hover:bg-cyan-500/15 transition-all" />
    
    <div className="text-3xl text-cyan-500 mb-3 group-hover:scale-110 transition-transform relative z-10 drop-shadow-lg">{icon}</div>
    <h3 className="text-4xl font-black text-slate-100 mb-1 relative z-10">{value}</h3>
    <p className="text-sm text-slate-500 font-mono uppercase tracking-widest relative z-10">{label}</p>
  </motion.div>
)

// --- مكون كارت القيم (New Component) ---
const ValueCard = ({ icon, title, desc, delay, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="p-8 rounded-3xl bg-slate-900/35 border border-slate-800/40 hover:border-slate-700/60 transition-all relative group overflow-hidden"
  >
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
    <div className="mb-6 w-14 h-14 rounded-2xl bg-slate-950/50 flex items-center justify-center text-3xl text-slate-100 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-100 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
)

export default function About() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  // بيانات الأقسام
  const sections = [
    {
      id: 'intro',
      title: t('about.introTitle') || 'The Visionary',
      subtitle: 'Who I Am',
      content: t('about.introBody') || 'I am not just a developer; I am a digital architect bridging the gap between imagination and reality.',
      image: '/images/about/me.jpeg',
      icon: <FaUserAstronaut />,
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'tech',
      title: t('about.techTitle') || 'The Engineer',
      subtitle: 'Code is my Craft',
      content: t('about.techBody') || 'Writing clean, scalable, and efficient code is not just a job, it is a craft I have perfected over years of dedication.',
      image: '/images/about/Web-Development.jpg',
      icon: <FaCode />,
      gradient: 'from-emerald-400 to-green-600',
    },
    {
      id: 'design',
      title: t('about.designTitle') || 'The Artist',
      subtitle: 'Design Philosophy',
      content: t('about.designBody') || 'Functionality without beauty is boring. I blend aesthetics with usability to create immersive experiences.',
      image: '/images/about/Web-Desgin.jpg',
      icon: <FaLayerGroup />,
      gradient: 'from-purple-500 to-pink-600',
    }
  ]

  // بيانات القيم الجديدة
  const coreValues = [
    { icon: <FaLightbulb />, title: "Innovation First", desc: "Always looking for creative solutions to complex problems.", color: "from-yellow-400 to-orange-500" },
    { icon: <FaStopwatch />, title: "Precision & Speed", desc: "Delivering high-quality code without missing deadlines.", color: "from-cyan-400 to-blue-500" },
    { icon: <FaHandshake />, title: "Client Partnership", desc: "I don't just work for you; I work with you to succeed.", color: "from-purple-400 to-pink-500" }
  ]

  const testimonials = [
    { quote: t('about.testimonials.items.0.quote') || 'CTRL ZERO helped us launch a performant platform that scaled to millions of users.', author: 'Ahmed Al-Hadid', role: t('about.testimonials.items.0.role') || 'CEO, TechCorp' },
    { quote: t('about.testimonials.items.1.quote') || 'Professional, timely, and deeply thoughtful engineering work.', author: 'Sara Khalil', role: t('about.testimonials.items.1.role') || 'Product Lead, RetailX' },
    { quote: t('about.testimonials.items.2.quote') || 'Exceeded expectations in design and delivery.', author: 'Omar N.', role: t('about.testimonials.items.2.role') || 'Founder, Startly' }
  ]

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] pt-24 pb-32 relative overflow-hidden text-slate-100 font-sans selection:bg-cyan-500/20 overflow-x-hidden">
      
      {/* --- 1. Ambient Background (Subtle / Site-consistent) --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-blue-900/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-purple-900/8 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay -z-10"></div>
      </div>

      {/* --- 2. Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-950/40 border border-cyan-600/40 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 backdrop-blur-md shadow-lg shadow-cyan-600/10">
              {t('about.pageTitle') || 'ABOUT ME'}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-slate-50 mb-6 tracking-tighter leading-[0.9]">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500">
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

      {/* --- 4. Main Story Sections (Full Color Images) --- */}
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
                style={{ y: isEven ? y : 0 }} 
                className="flex-1 w-full relative group perspective-1000"
              >
                {/* Glow Behind */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity duration-700`} />
                
                {/* Image Container */}
                <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-800/50 bg-slate-950 p-2 shadow-2xl transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[4/3] relative">
                    
                    {/* الصورة بالألوان (بدون Grayscale) */}
                    <img 
                      src={section.image} 
                      alt={section.title} 
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
                    />

                    {/* Floating Icon Badge */}
                    <div className={`absolute bottom-6 ${isRtl ? 'left-6' : 'right-6'} w-16 h-16 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-700/50 flex items-center justify-center text-3xl text-slate-100 shadow-lg z-20`}>
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
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
                    {section.title}
                  </h2>
                  
                  <div className="relative">
                     {/* Quote Mark */}
                     <span className={`absolute -top-4 ${isRtl ? '-right-6' : '-left-6'} text-6xl text-white/3 font-serif`}>"</span>
                     <p className="text-lg text-slate-400 leading-relaxed font-light mb-8">
                       {section.content}
                     </p>
                  </div>

                  {/* Dots */}
                  <div className={`flex gap-3 justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'}`}>
                     {[...Array(3)].map((_, i) => (
                       <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-cyan-500' : 'bg-white/20'}`} />
                     ))}
                  </div>
                </motion.div>
              </div>

            </motion.div>
          )
        })}
      </div>

      {/* --- 5. NEW SECTION: Core Values (Why me?) --- */}
      <section className="container mx-auto px-6 mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">Why Work With Me?</h2>
          <p className="text-slate-500">Values that drive every line of code I write.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => (
            <ValueCard key={idx} {...val} delay={idx * 0.1} />
          ))}
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="container mx-auto px-6 mb-20 relative z-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-100">{t('about.testimonials.title') || 'What Clients Say'}</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">{t('about.testimonials.subtitle') || 'Selected testimonials from clients and partners.'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((tst, i) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/40">
              <p className="text-slate-400 italic mb-4">"{tst.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-950/50 flex items-center justify-center text-slate-100 font-bold">{tst.author[0]}</div>
                <div>
                  <div className="text-slate-100 font-bold">{tst.author}</div>
                  <div className="text-slate-500 text-sm">{tst.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 6. Call to Action --- */}
      <section className="relative py-32 text-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
           <h2 className="text-4xl md:text-6xl font-black text-slate-100 mb-4">
             {t('contact.title') || 'Ready to Create Magic?'}
           </h2>
           <div className="flex items-center justify-center gap-2 mb-8">
             <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500" />
             <motion.div
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-2 h-2 rounded-full bg-cyan-500"
             />
             <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500" />
           </div>
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
               className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-slate-100 text-slate-950 font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(226,232,240,0.1)] hover:shadow-[0_0_40px_rgba(226,232,240,0.2)]"
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