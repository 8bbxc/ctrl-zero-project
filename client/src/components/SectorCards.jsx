import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaHeartbeat,      // Medical
  FaShoppingCart,   // E-Commerce
  FaUtensils,       // Restaurant
  FaBriefcase,      // Corporate
  FaGraduationCap,  // Education
  FaBuilding        // Real Estate
} from 'react-icons/fa'

export default function SectorCards({ selectedSector = 'All', onSectorChange = () => {} }) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  // The 6 premium sectors
  const sectors = [
    {
      id: 'Medical',
      nameEn: 'Medical',
      nameAr: 'الطب والصحة',
      icon: FaHeartbeat,
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30 hover:border-red-500/60',
      glowColor: 'shadow-red-500/20',
      accentColor: 'text-red-400'
    },
    {
      id: 'E-Commerce',
      nameEn: 'E-Commerce',
      nameAr: 'التجارة الإلكترونية',
      icon: FaShoppingCart,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30 hover:border-green-500/60',
      glowColor: 'shadow-green-500/20',
      accentColor: 'text-green-400'
    },
    {
      id: 'Restaurant',
      nameEn: 'Restaurant',
      nameAr: 'المطاعم والضيافة',
      icon: FaUtensils,
      color: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
      glowColor: 'shadow-orange-500/20',
      accentColor: 'text-orange-400'
    },
    {
      id: 'Corporate',
      nameEn: 'Corporate',
      nameAr: 'الشركات والمؤسسات',
      icon: FaBriefcase,
      color: 'from-blue-500/20 to-sky-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
      glowColor: 'shadow-blue-500/20',
      accentColor: 'text-blue-400'
    },
    {
      id: 'Education',
      nameEn: 'Education',
      nameAr: 'التعليم والتدريب',
      icon: FaGraduationCap,
      color: 'from-purple-500/20 to-violet-500/20',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      glowColor: 'shadow-purple-500/20',
      accentColor: 'text-purple-400'
    },
    {
      id: 'Real Estate',
      nameEn: 'Real Estate',
      nameAr: 'العقارات والسياحة',
      icon: FaBuilding,
      color: 'from-indigo-500/20 to-blue-500/20',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500/60',
      glowColor: 'shadow-indigo-500/20',
      accentColor: 'text-indigo-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  }

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-mono text-xs uppercase tracking-[0.2em] mb-3 block">
            {isArabic ? 'اختر القطاع' : 'EXPLORE SECTORS'}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            {isArabic ? 'تصفح مشاريعنا حسب القطاع' : 'Filter by Industry'}
            <span className="text-accent">.</span>
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto">
            {isArabic
              ? 'استكشف مشاريعنا المتخصصة في مختلف القطاعات والصناعات'
              : 'Discover our specialized projects across various industries'}
          </p>
        </motion.div>
      </div>

      {/* Sector Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sectors.map((sector) => {
          const Icon = sector.icon
          const isSelected = selectedSector === sector.id
          const displayName = isArabic ? sector.nameAr : sector.nameEn

          return (
            <Link
              key={sector.id}
              to={`/projects/sector/${sector.id}`}
              className="group relative h-full text-left no-underline"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
              {/* Card Background with Glassmorphism */}
              <div
                className={`
                  relative w-full h-40 rounded-2xl
                  bg-gradient-to-br ${sector.color}
                  backdrop-blur-xl border ${isSelected ? 'border-white/50' : sector.borderColor}
                  p-6 transition-all duration-500 overflow-hidden
                  ${isSelected ? `shadow-2xl ${sector.glowColor}` : 'hover:shadow-xl'}
                  group-hover:shadow-2xl ${sector.glowColor}
                `}
              >
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className={`
                      absolute w-72 h-72 
                      ${sector.color} 
                      rounded-full blur-3xl 
                      -top-20 -right-20 
                      opacity-0 
                      group-hover:opacity-100 
                      transition-opacity duration-700
                    `}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Icon and Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-xl md:text-2xl font-bold text-white mb-1 transition-colors ${isSelected ? sector.accentColor : ''}`}>
                        {displayName}
                      </h3>
                    </div>
                    <div
                      className={`
                        p-3 rounded-xl 
                        bg-white/5 backdrop-blur-md
                        border border-white/10
                        group-hover:bg-white/10 
                        transition-all duration-300
                        ${isSelected ? `${sector.accentColor} bg-white/15` : sector.accentColor}
                      `}
                    >
                      <Icon className={`text-2xl ${isSelected ? sector.accentColor : 'text-white/70'}`} />
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50 font-medium">
                      {isArabic ? 'اضغط للفتر' : 'Click to filter'}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Border Glow on Selection */}
                {isSelected && (
                  <motion.div
                    layoutId="sectorGlow"
                    className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.div>
            </Link>
          )
        })}
      </motion.div>

      {/* "All Projects" Quick Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-8 flex justify-center"
      >
        <Link
          to="/projects"
          onClick={() => onSectorChange('All')}
          className={`
            px-8 py-3 rounded-full font-bold uppercase tracking-wider
            transition-all duration-300 inline-block
            ${selectedSector === 'All'
              ? 'bg-accent text-black shadow-lg shadow-accent/50'
              : 'bg-white/5 text-white border border-white/20 hover:border-accent hover:bg-white/10'
            }
          `}
        >
          {isArabic ? 'عرض الكل' : 'View All'}
        </Link>
      </motion.div>
    </div>
  )
}
