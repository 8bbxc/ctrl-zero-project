import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const Hourglass = () => (
  <motion.div
    animate={{ rotate: [0, 0, 180, 180, 360] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative w-24 h-32"
  >
    {/* Top bulb */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/50" />
    
    {/* Connecting neck */}
    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-500" />
    
    {/* Bottom bulb */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50">
      {/* Falling sand animation */}
      <motion.div
        animate={{ x: [0, 4, -2, 0], y: [0, 3, 2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full blur-sm"
      />
    </div>
  </motion.div>
)

export default function ComingSoon() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isArabic = i18n.language === 'ar'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030305] via-[#050505] to-slate-900 text-slate-100 font-sans selection:bg-cyan-500/20 overflow-hidden pt-20 pb-24">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030305]/80" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-slate-800/50 hover:bg-slate-700/80 border border-slate-600/30 hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-md group"
      >
        <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline text-sm font-medium">{t('back')}</span>
      </button>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full min-h-[calc(100vh-150px)] flex flex-col items-center justify-center">
        
        {/* Hourglass Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 md:mb-16"
        >
          <Hourglass />
        </motion.div>

        {/* Main Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter">
            <span className="text-slate-100">
              {t('comingSoon.comingVerySoon')}
            </span>
            <br />
            <span className="relative inline-block">
              <span className="absolute -inset-2 blur-3xl opacity-30 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
                {t('comingSoon.soon')}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-300 font-light mb-12 leading-relaxed">
            {t('comingSoon.subtitle')}
          </p>
        </motion.div>

        {/* Announcement Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-2xl mb-12"
        >
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
            
            {/* Card content */}
            <div className="relative px-8 py-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-xl backdrop-blur-xl border border-slate-700/50">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                  {t('comingSoon.exclusive')}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                {t('comingSoon.featureTitle')}
              </h2>

              <p className="text-slate-300 leading-relaxed mb-6">
                {t('comingSoon.featureDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="flex-1 px-6 py-3.5 min-h-[44px] bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                >
                  {t('contact.title')}
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className="flex-1 px-6 py-3.5 min-h-[44px] bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-500/50 text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  {t('projectDetails.back')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <div className="text-center">
            <div className="inline-block w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">
              {t('sectors.features.fastLabel')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('sectors.features.fastSubtext')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="inline-block w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🎨</span>
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">
              {t('sectors.features.designLabel')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('sectors.features.designSubtext')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="inline-block w-12 h-12 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🚀</span>
            </div>
            <h3 className="font-semibold text-slate-200 mb-2">
              {t('comingSoon.comingInDays')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('comingSoon.verySoon')}
            </p>
          </div>
        </motion.div>

        {/* Decorative stars */}
        <motion.div className="absolute top-20 left-10 w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-400 rounded-full shadow-lg shadow-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
        <motion.div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-pink-400 rounded-full shadow-lg shadow-pink-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} />
      </div>
    </div>
  )
}
