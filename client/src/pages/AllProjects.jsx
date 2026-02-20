import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaArrowRight } from 'react-icons/fa'
import api from '../services/api'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import ProjectCard from '../components/ProjectCard'

// Sector colors mapping
const SECTOR_COLORS = {
  Medical: '#f43f5e',
  'E-Commerce': '#10b981',
  Restaurant: '#f97316',
  Corporate: '#3b82f6',
  Education: '#8b5cf6',
  'Real Estate': '#06b6d4'
}

const SECTOR_LABELS = {
  Medical: { en: 'Medical', ar: 'الطب' },
  'E-Commerce': { en: 'E-Commerce', ar: 'التجارة الإلكترونية' },
  Restaurant: { en: 'Restaurants', ar: 'المطاعم' },
  Corporate: { en: 'Corporate', ar: 'الشركات' },
  Education: { en: 'Education', ar: 'التعليم' },
  'Real Estate': { en: 'Real Estate', ar: 'العقارات' }
}

export default function AllProjects() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/api/projects')
        const data = Array.isArray(res.data) ? res.data : (res.data?.items || [])
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects based on search and sector
  useEffect(() => {
    let filtered = projects

    // Filter by sector
    if (selectedSector !== 'all') {
      filtered = filtered.filter(p => p.category === selectedSector)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.titleAr && p.titleAr.includes(searchTerm))
      )
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedSector, projects])

  const sectors = Object.keys(SECTOR_COLORS)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-[#030305] text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="relative overflow-hidden pt-20 md:pt-28 pb-12 md:pb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="text-white">
                {t('allProjects.titlePrefix')}
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                {t('allProjects.titleMain')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              {t('allProjects.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & FILTER SECTION */}
      <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('allProjects.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm sm:text-base"
            />
          </div>

          {/* Filter Buttons (Sectors) */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <motion.button
              onClick={() => setSelectedSector('all')}
              className={`px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all whitespace-nowrap min-h-[42px] ${
                selectedSector === 'all'
                  ? 'bg-white text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('allProjects.allFilter')}
            </motion.button>

            {sectors.map(sector => (
              <motion.button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all whitespace-nowrap border-2 min-h-[42px] ${
                  selectedSector === sector
                    ? 'border-white/30 text-white'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
                style={{
                  backgroundColor: selectedSector === sector ? `${SECTOR_COLORS[sector]}20` : 'transparent',
                  borderColor: selectedSector === sector ? SECTOR_COLORS[sector] : 'transparent',
                  color: selectedSector === sector ? SECTOR_COLORS[sector] : undefined
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isArabic ? SECTOR_LABELS[sector].ar : SECTOR_LABELS[sector].en}
              </motion.button>
            ))}
          </div>

          {/* Results Count */}
          {searchTerm || selectedSector !== 'all' ? (
            <p className="text-sm text-slate-400">
              {`${filteredProjects.length} ${t(filteredProjects.length === 1 ? 'allProjects.resultSingle' : 'allProjects.resultPlural')}`}
            </p>
          ) : null}
        </motion.div>
      </section>

      {/* PROJECTS GRID */}
      <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">
              {t('allProjects.noResultsTitle')}
            </h3>
            <p className="text-slate-400">
              {t('allProjects.noResultsDesc')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredProjects.map((project, idx) => (
              <motion.div key={project.id || idx} variants={itemVariants}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* EMPTY STATE SUGGESTION */}
      {!loading && projects.length === 0 && (
        <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h3 className="text-2xl font-bold text-slate-400 mb-4">
            {t('allProjects.emptyTitle')}
          </h3>
          <p className="text-slate-500">
            {t('allProjects.emptyDesc')}
          </p>
        </section>
      )}
    </div>
  )
}
