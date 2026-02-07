import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Typewriter from '../components/Typewriter'
import Marquee from 'react-fast-marquee'
import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaDocker, FaHtml5, FaCss3Alt, FaGitAlt } from 'react-icons/fa'
import { SiTailwindcss, SiPostgresql, SiNextdotjs, SiTypescript, SiPrisma, SiMongodb } from 'react-icons/si'
import { HiArrowRight } from 'react-icons/hi'

export default function Home() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()

  // عبارات الآلة الكاتبة (تأكد أن ملف i18n يحتوي عليها)
  const phrases = t('hero.phrases', { returnObjects: true }) || [
    "Building Scalable Systems",
    "Crafting Beautiful UI",
    "Engineering the Future"
  ]

  // صور الماركيز
  const marqueeImages = [
    '/images/home/1.jpg','/images/home/2.jpg','/images/home/3.jpg','/images/home/4.jpg','/images/home/5.jpg',
    '/images/home/1.jpg','/images/home/2.jpg'
  ]

  // التقنيات مع الأيقونات
  const techStack = [
    { name: 'React', icon: <FaReact />, color: 'text-cyan-400' },
    { name: 'Next.js', icon: <SiNextdotjs />, color: 'text-white' },
    { name: 'Tailwind', icon: <SiTailwindcss />, color: 'text-cyan-300' },
    { name: 'Node.js', icon: <FaNodeJs />, color: 'text-green-500' },
    { name: 'Postgres', icon: <SiPostgresql />, color: 'text-blue-400' },
    { name: 'Docker', icon: <FaDocker />, color: 'text-blue-500' },
    { name: 'TypeScript', icon: <SiTypescript />, color: 'text-blue-600' },
    { name: 'Prisma', icon: <SiPrisma />, color: 'text-white' },
  ]

  // إعدادات الحركة
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION - Cinematic & Bold */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                {t('hero.badge') || 'Available for new projects'}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
              {t('hero.title') || 'CTRL ZERO'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Software Agency.
              </span>
            </h1>

            {/* Typewriter (FIXED: Now uses translation key 'hero.intro') */}
            <div className="text-xl md:text-3xl text-slate-400 font-light mb-8 h-10 flex items-center justify-center gap-2">
               <span>{t('home.weCan') || 'We Can'}</span> 
               <span className="text-accent font-semibold border-b-2 border-accent/50 pb-1">
                 <Typewriter texts={phrases} speed={50} pause={2500} deleteSpeed={30} />
               </span>
            </div>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle') || "We don't just write code; we architect digital experiences."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/projects" className="btn-primary px-8 py-4 text-lg w-full sm:w-auto">
                {t('hero.viewWork') || 'View Our Work'}
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-full border border-slate-700 text-white hover:bg-white/5 transition w-full sm:w-auto font-medium">
                {t('hero.contact') || 'Book a Call'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SKEWED MARQUEE - The "Wow" Factor */}
      <section className="py-20 bg-slate-950 relative overflow-hidden">
        <div className="transform -rotate-2 scale-105 origin-center overflow-x-hidden">
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-8 border-y border-white/5 backdrop-blur-sm overflow-x-hidden">
            <Marquee 
              gradient={false} 
              speed={40} 
              pauseOnHover={false}
              direction={dir === 'rtl' ? 'right' : 'left'}
            >
              {marqueeImages.map((src, i) => (
                <div key={i} className="px-3 md:px-4 relative group cursor-pointer flex-shrink-0 h-64 md:h-80">
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300 rounded-xl z-10" />
                  <img 
                    src={src} 
                    alt="Portfolio project" 
                    loading="lazy"
                    decoding="async"
                    className="h-full w-[350px] md:w-[400px] object-cover rounded-xl shadow-2xl border border-slate-800 transform group-hover:scale-[1.02] transition-transform duration-500" 
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 3. SERVICES - Bento Grid Layout */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('home.offerTitle') || 'Our Expertise'}</h2>
          <p className="text-slate-400">{t('home.offerSubtitle') || 'Comprehensive solutions for the modern web.'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: Full Stack (Large) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-blue-600/20 transition-all" />
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-3xl mb-6">
              <FaReact />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('services.fullstack.title')}</h3>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              {t('services.fullstack.desc')}
            </p>
            <Link to="/services" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:gap-3 transition-all">
              {t('services.learnMore')} <HiArrowRight />
            </Link>
          </motion.div>

          {/* Card 2: UI/UX (Tall) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:row-span-2 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -z-10 group-hover:bg-purple-600/20 transition-all" />
             <div>
               <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-3xl mb-6">
                 <FaHtml5 />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">{t('services.uiux.title')}</h3>
               <p className="text-slate-400 leading-relaxed">
                 {t('services.uiux.desc')}
               </p>
             </div>
             <div className="mt-8">
               <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50" />
                 <div className="flex gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-yellow-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
                 <div className="w-full h-full bg-slate-900 rounded-lg opacity-50" />
               </div>
             </div>
          </motion.div>

          {/* Card 3: Product (Standard) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-green-500/50 transition-all group relative overflow-hidden"
          >
             <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 text-3xl mb-6">
               <FaNodeJs />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">{t('services.product.title')}</h3>
             <p className="text-slate-400 leading-relaxed">
               {t('services.product.desc')}
             </p>
          </motion.div>

           {/* Card 4: DevOps/Cloud (Standard) */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/50 transition-all group relative overflow-hidden"
          >
             <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 text-3xl mb-6">
               <FaDocker />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">{t('services.devops.title') || 'DevOps & Cloud'}</h3>
             <p className="text-slate-400 leading-relaxed">
               {t('services.devops.desc') || 'CI/CD pipelines, Docker containerization, and cloud deployment.'}
             </p>
          </motion.div>
        </div>
      </section>

      {/* 4. TECH STACK - Floating Orbs/Icons */}
      <section className="py-20 border-y border-white/5 bg-slate-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-slate-300 mb-12">{t('home.techTitle') || 'Powered by Modern Tech'}</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-3 group cursor-default"
              >
                <div className={`text-5xl md:text-6xl ${tech.color} drop-shadow-2xl transition-all duration-300 filter group-hover:brightness-125`}>
                  {tech.icon}
                </div>
                <span className="text-sm font-medium text-slate-500 group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA - Big Impact */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            {t('home.readyTitle') || 'Ready to'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{t('home.scaleUp') || 'Scale Up?'}</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            {t('home.ctaDesc') || "Stop waiting. Let's build the software your business deserves."}
          </p>
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <Link 
              to="/contact" 
              className="block px-12 py-5 bg-slate-950 rounded-full text-white text-xl font-bold hover:bg-slate-900 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]"
            >
              {t('services.cta') || 'Start Your Project'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}