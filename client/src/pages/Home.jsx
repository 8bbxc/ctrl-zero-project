import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Typewriter from '../components/Typewriter'
import Marquee from 'react-fast-marquee'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaReact, FaNodeJs, FaDocker, FaArrowRight, FaCode, FaLaptopCode } from 'react-icons/fa'
import { SiTailwindcss, SiPostgresql, SiNextdotjs, SiTypescript, SiPrisma, SiMongodb, SiGraphql } from 'react-icons/si'

export default function Home() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isRtl = dir === 'rtl'
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Parallax Effect for Hero
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // عبارات الآلة الكاتبة
  const phrases = t('hero.phrases', { returnObjects: true }) || [
    "Building Scalable Systems",
    "Crafting Beautiful UI",
    "Engineering the Future"
  ]

  // صور الماركيز (تكرار لضمان الامتلاء)
  const marqueeImages = [
    '/images/home/1.jpg','/images/home/2.jpg','/images/home/3.jpg','/images/home/4.jpg','/images/home/5.jpg',
    '/images/home/1.jpg','/images/home/2.jpg','/images/home/3.jpg'
  ]

  // التقنيات
  const techStack = [
    { name: 'React', icon: <FaReact />, color: 'text-cyan-400' },
    { name: 'Next.js', icon: <SiNextdotjs />, color: 'text-white' },
    { name: 'Tailwind', icon: <SiTailwindcss />, color: 'text-cyan-300' },
    { name: 'Node.js', icon: <FaNodeJs />, color: 'text-green-500' },
    { name: 'Postgres', icon: <SiPostgresql />, color: 'text-blue-400' },
    { name: 'Docker', icon: <FaDocker />, color: 'text-blue-500' },
    { name: 'TypeScript', icon: <SiTypescript />, color: 'text-blue-600' },
    { name: 'Prisma', icon: <SiPrisma />, color: 'text-white' },
    { name: 'GraphQL', icon: <SiGraphql />, color: 'text-pink-500' },
    { name: 'MongoDB', icon: <SiMongodb />, color: 'text-green-400' },
  ]

  return (
    <div ref={containerRef} className="bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* 1. HERO SECTION - Cinematic & Immersive */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
        </div>

        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="container mx-auto px-4 relative z-10 text-center"
        >
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8 hover:bg-white/10 transition-colors cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                {t('hero.badge') || 'Available for new projects'}
              </span>
            </motion.div>

            {/* Main Title - Massive & Bold */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-5xl mx-auto"
            >
              CTRL <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-400 to-slate-600">ZERO</span>
              <span className="block text-2xl md:text-4xl lg:text-5xl font-light text-slate-400 mt-2 tracking-normal">
                Digital Engineering
              </span>
            </motion.h1>

            {/* Typewriter Effect */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-lg md:text-2xl text-slate-400 font-light mb-10 h-10 flex items-center justify-center gap-2"
            >
               <span>{t('home.weCan') || 'We specialize in'}</span> 
               <span className="text-cyan-400 font-semibold relative">
                 <Typewriter texts={phrases} speed={50} pause={2500} deleteSpeed={30} />
                 <span className={`absolute -bottom-1 ${isRtl ? 'right-0' : 'left-0'} w-full h-[2px] bg-cyan-400/50`}></span>
               </span>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/projects" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {t('hero.viewWork') || 'View Our Work'} <FaArrowRight className={`text-sm transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </span>
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all font-medium text-lg backdrop-blur-md">
                {t('hero.contact') || 'Book a Call'}
              </Link>
            </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-slate-500 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. SKEWED MARQUEE - Dynamic Motion */}
      <section className="py-24 bg-[#030712] relative overflow-hidden z-20">
        <div className="transform -rotate-2 scale-110 origin-center">
          <div className="bg-[#0A0A0A] border-y border-white/5 py-10 shadow-2xl relative">
             {/* Gradient Fades on Sides */}
             <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10" />
             <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10" />
             
             <Marquee gradient={false} speed={50} pauseOnHover={true} direction={isRtl ? 'right' : 'left'}>
              {marqueeImages.map((src, i) => (
                <div key={i} className="px-4 relative group cursor-pointer h-[20rem] md:h-[24rem] aspect-[3/4]">
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all duration-500 rounded-2xl z-10" />
                  <img 
                    src={src} 
                    alt={t('home.projectAlt') || 'Project'} 
                    className="h-full w-full object-cover rounded-2xl shadow-xl border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-[1.03]" 
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID SERVICES - Modern Layout */}
      <section className="py-32 container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Capabilities.</span>
          </motion.h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            {t('home.offerSubtitle') || 'End-to-end digital solutions tailored for growth and performance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: Full Stack (Wide) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] -z-10 group-hover:bg-cyan-600/20 transition-all" />
            
            <div className="mb-8 w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-4xl">
              <FaLaptopCode />
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4">{t('services.fullstack.title') || 'Full-Stack Engineering'}</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg font-light">
              {t('services.fullstack.desc') || 'We build robust, scalable, and high-performance web applications using the latest technologies.'}
            </p>
            
            <Link to="/services/web-dev" className="inline-flex items-center gap-2 text-white font-bold border-b border-cyan-500/50 pb-1 hover:text-cyan-400 hover:border-cyan-400 transition-all">
              {t('services.learnMore') || 'Learn more'} <FaArrowRight />
            </Link>
          </motion.div>

          {/* Card 2: UI/UX (Tall) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:row-span-2 p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -z-10 group-hover:bg-purple-600/20 transition-all" />
             
             <div>
               <div className="mb-8 w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-4xl">
                 <FaCode />
               </div>
               <h3 className="text-3xl font-bold text-white mb-4">{t('services.uiux.title') || 'UI/UX Design'}</h3>
               <p className="text-slate-400 text-lg leading-relaxed font-light">
                 {t('services.uiux.desc') || 'Crafting intuitive and engaging user experiences that convert visitors into loyal customers.'}
               </p>
             </div>
             
             {/* Visual decorative element */}
             <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="flex gap-2 mb-3">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"/>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50"/>
                   <div className="w-3 h-3 rounded-full bg-green-500/50"/>
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-3/4 bg-slate-700/50 rounded"/>
                   <div className="h-2 w-1/2 bg-slate-700/50 rounded"/>
                </div>
             </div>
          </motion.div>

          {/* Card 3: Product (Standard) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 transition-all group relative overflow-hidden"
          >
             <div className="mb-6 w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 text-3xl">
               <FaNodeJs />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">{t('services.product.title') || 'Product Engineering'}</h3>
             <p className="text-slate-400 font-light">
               {t('services.product.desc') || 'From raw idea to market-ready MVP with strategic execution.'}
             </p>
          </motion.div>

           {/* Card 4: DevOps (Standard) */}
           <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
          >
             <div className="mb-6 w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-3xl">
               <FaDocker />
             </div>
             <h3 className="text-2xl font-bold text-white mb-3">{t('services.devops.title') || 'Cloud & DevOps'}</h3>
             <p className="text-slate-400 font-light">
               {t('services.devops.desc') || 'Automated CI/CD pipelines and resilient cloud infrastructure.'}
             </p>
          </motion.div>
        </div>
      </section>

      {/* 4. TECH STACK - Infinite Scroll / Grid */}
      <section className="py-24 border-y border-white/5 bg-[#050505]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-16">
            {t('home.techTitle') || 'POWERED BY MODERN TECH'}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 max-w-5xl mx-auto">
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, scale: 1.1 }}
                className="group flex flex-col items-center gap-4"
              >
                <div className={`text-5xl md:text-6xl ${tech.color} filter drop-shadow-2xl opacity-70 group-hover:opacity-100 transition-all duration-300`}>
                  {tech.icon}
                </div>
                <span className="text-xs font-bold uppercase text-slate-600 tracking-widest opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-2 md:group-hover:translate-y-0 transition-colors duration-300">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BIG CTA - Final Impact */}
      <section className="relative py-40 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight"
          >
            LET'S BUILD <br className="hidden md:block"/> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">IMPOSSIBLE.</span>
          </motion.h2>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light">
            {t('home.ctaDesc') || "Your vision deserves world-class engineering. Let's start the conversation."}
          </p>
          
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full text-xl font-bold hover:bg-cyan-50 transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            <span>{t('services.cta') || 'Start Your Project'}</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}