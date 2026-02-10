import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Typewriter from '../components/Typewriter'
import Marquee from 'react-fast-marquee'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  FaReact, FaNodeJs, FaDocker, FaArrowRight, FaLaptopCode, FaCode, 
  FaSearch, FaPencilRuler, FaCogs, FaRocket, FaQuoteLeft 
} from 'react-icons/fa'
import { SiTailwindcss, SiPostgresql, SiNextdotjs, SiTypescript, SiPrisma, SiMongodb, SiGraphql } from 'react-icons/si'

export default function Home() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isRtl = dir === 'rtl'
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // --- البيانات ---
  const phrases = t('hero.phrases', { returnObjects: true }) || [
    "Building Scalable Systems", "Crafting Beautiful UI", "Engineering the Future"
  ]

  const marqueeImages = [
    '/images/home/1.jpg','/images/home/2.jpg','/images/home/3.jpg','/images/home/4.jpg','/images/home/5.jpg',
    '/images/home/1.jpg','/images/home/2.jpg'
  ]

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

  // قسم جديد: خطوات العمل
  const processSteps = [
    { icon: <FaSearch />, title: "Discovery", desc: "We analyze your goals and market needs." },
    { icon: <FaPencilRuler />, title: "Design", desc: "Crafting intuitive and stunning interfaces." },
    { icon: <FaCogs />, title: "Development", desc: "Writing clean, scalable, and secure code." },
    { icon: <FaRocket />, title: "Launch", desc: "Deploying your product to the world." },
  ]

  // قسم جديد: آراء العملاء (بيانات وهمية للتجربة)
  const testimonials = [
    { name: "Sarah J.", role: "CEO, TechFlow", text: "CTRL ZERO transformed our vision into a reality. The attention to detail is unmatched." },
    { name: "Michael B.", role: "Founder, StartUp X", text: "The best engineering team we've worked with. Delivered on time and beyond expectations." },
    { name: "Ali K.", role: "CTO, MegaCorp", text: "Highly professional code quality and stunning design. Highly recommended." },
  ]

  return (
    <div ref={containerRef} className="bg-[#050505] text-slate-100 font-sans selection:bg-cyan-500/20 overflow-hidden">
      
      {/* 1. HERO SECTION (More Vibrant) */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
        {/* خلفية ملونة أكثر */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        </div>

        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="container mx-auto px-4 relative z-10 text-center"
        >
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-600/40 bg-cyan-950/30 backdrop-blur-xl mb-8 hover:bg-cyan-950/50 transition-colors cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
              </span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                {t('hero.badge') || 'Available for new projects'}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-50 leading-[0.9] tracking-tighter mb-8"
            >
              {t('hero.title') || 'CTRL'} <motion.span 
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500"
              >
                {t('hero.zero') || 'ZERO'}
              </motion.span>
              <span className="block text-2xl md:text-4xl lg:text-5xl font-light text-slate-400 mt-2 tracking-normal">
                Software Agency
              </span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-lg md:text-2xl text-slate-400 font-light mb-10 h-10 flex items-center justify-center gap-2"
            >
               <span>{t('home.weCan') || 'We specialize in'}</span> 
               <span className="text-cyan-500 font-semibold relative">
                 <Typewriter texts={phrases} speed={50} pause={2500} deleteSpeed={30} />
               </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/projects" className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 shadow-lg shadow-cyan-600/20">
                <span className="relative flex items-center gap-2">
                  {t('hero.viewWork') || 'View Our Work'} <FaArrowRight className={`text-sm transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </span>
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all font-medium text-lg backdrop-blur-md">
                {t('hero.contact') || 'Book a Call'}
              </Link>
            </motion.div>
        </motion.div>
      </section>

      {/* 2. SKEWED MARQUEE (Full Color) */}
      <section className="py-24 bg-[#050505] relative overflow-hidden z-20">
        <div className="transform -rotate-2 scale-110 origin-center">
          <div className="bg-[#0a0a0a]/80 border-y border-white/3 py-10 shadow-2xl relative backdrop-blur-sm">
             <Marquee gradient={false} speed={40} pauseOnHover={true} direction={isRtl ? 'right' : 'left'}>
              {marqueeImages.map((src, i) => (
                <div key={i} className="px-4 relative group cursor-pointer h-[16rem] md:h-[20rem] aspect-video">
                  {/* إزالة الفلاتر (Grayscale) وإضافة حدود ملونة */}
                  <img 
                    src={src} 
                    alt={`Project ${i}`} 
                    className="h-full w-full object-cover rounded-xl shadow-xl border border-white/10 group-hover:border-cyan-500/50 transition-all duration-500 transform group-hover:scale-[1.02]" 
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: HOW WE WORK (Process) */}
      <section className="py-24 container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">How We Work</h2>
           <p className="text-slate-500">A streamlined process to deliver excellence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {processSteps.map((step, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-cyan-600/40 transition-all hover:-translate-y-2 group"
             >
                <div className="w-14 h-14 rounded-full bg-slate-950/50 flex items-center justify-center text-2xl text-cyan-500 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-900/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* 4. BENTO GRID SERVICES */}
      <section className="py-16 container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Card 1: Full Stack */}
          <motion.div whileHover={{ y: -5 }} className="md:col-span-2 p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] -z-10 group-hover:bg-blue-600/10 transition-all" />
            <div className="mb-6 w-14 h-14 rounded-xl bg-blue-700/20 flex items-center justify-center text-blue-500 text-3xl"><FaLaptopCode /></div>
            <h3 className="text-2xl font-bold text-slate-100 mb-3">{t('services.fullstack.title') || 'Full-Stack Engineering'}</h3>
            <p className="text-slate-400 mb-6">{t('services.fullstack.desc') || 'Robust web applications tailored for scale.'}</p>
            <Link to="/services/web-dev" className="text-blue-500 font-bold hover:text-blue-400 flex items-center gap-2">Learn more <FaArrowRight /></Link>
          </motion.div>

          {/* Card 2: UI/UX */}
          <motion.div whileHover={{ y: -5 }} className="md:row-span-2 p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
             <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-600/5 rounded-full blur-[80px] -z-10 group-hover:bg-purple-600/10 transition-all" />
             <div className="mb-6 w-14 h-14 rounded-xl bg-purple-700/20 flex items-center justify-center text-purple-500 text-3xl"><FaCode /></div>
             <h3 className="text-2xl font-bold text-slate-100 mb-3">{t('services.uiux.title') || 'UI/UX Design'}</h3>
             <p className="text-slate-400">{t('services.uiux.desc') || 'Interfaces that users love to use.'}</p>
          </motion.div>

          {/* Card 3: Product */}
          <motion.div whileHover={{ y: -5 }} className="p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
             <div className="mb-6 w-12 h-12 rounded-xl bg-orange-700/20 flex items-center justify-center text-orange-500 text-2xl"><FaNodeJs /></div>
             <h3 className="text-xl font-bold text-slate-100 mb-2">{t('services.product.title') || 'Product Eng.'}</h3>
             <p className="text-slate-500 text-sm">{t('services.product.desc')}</p>
          </motion.div>

           {/* Card 4: DevOps */}
           <motion.div whileHover={{ y: -5 }} className="p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
             <div className="mb-6 w-12 h-12 rounded-xl bg-emerald-700/20 flex items-center justify-center text-emerald-500 text-2xl"><FaDocker /></div>
             <h3 className="text-xl font-bold text-slate-100 mb-2">{t('services.devops.title') || 'Cloud & DevOps'}</h3>
             <p className="text-slate-500 text-sm">{t('services.devops.desc')}</p>
          </motion.div>
        </div>
      </section>

      {/* 5. NEW SECTION: TESTIMONIALS (Social Proof) */}
      <section className="py-24 bg-[#0a0a0a] relative border-y border-white/3">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-100 mb-12">Trusted by Visionaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testi, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800/50 relative"
              >
                <FaQuoteLeft className="text-cyan-600/10 text-4xl absolute top-6 left-6" />
                <p className="text-slate-400 leading-relaxed mb-6 relative z-10">"{testi.text}"</p>
                <div>
                  <h4 className="text-slate-100 font-bold">{testi.name}</h4>
                  <p className="text-cyan-500 text-sm">{testi.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TECH STACK */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-mono uppercase tracking-[0.3em] text-slate-500 mb-16"
          >
            {t('home.techTitle') || 'POWERED BY MODERN TECH'}
            <motion.span 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block w-2 h-2 bg-cyan-600 rounded-full ml-3 mb-1"
            />
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 max-w-5xl mx-auto">
            {techStack.map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -10, scale: 1.1 }}
                className="group flex flex-col items-center gap-4 cursor-default"
              >
                <div className={`text-5xl md:text-6xl ${tech.color} drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-xl`}>
                  {tech.icon}
                </div>
                <span className="text-xs font-bold uppercase text-slate-600 group-hover:text-cyan-500 transition-colors tracking-widest">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BIG CTA */}
      <section className="relative py-40 overflow-hidden text-center bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-100 mb-8 tracking-tight">
            LET'S BUILD <br className="hidden md:block"/> THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">EXTRAORDINARY.</span>
          </h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-3 px-12 py-6 bg-slate-100 text-slate-950 rounded-full text-xl font-bold hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(226,232,240,0.1)]"
          >
            <span>{t('services.cta') || 'Start Your Project'}</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

    </div>
  )
}