import React from 'react'
import { Link } from 'react-router-dom'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function ProjectCard({ project }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const title = isRtl ? (project.titleAr || project.title) : project.title
  const desc = isRtl ? (project.descriptionAr || project.description) : project.description
  const gradient = project.gradient || project.sectorGradient || 'from-slate-700 to-slate-800'

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 transition-all hover:-translate-y-2 hover:shadow-2xl">
      <div className={`h-36 w-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl font-bold`}> 
        {project.icon ? project.icon : (project.title ? project.title[0] : 'P')}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-3">{desc}</p>

        {project.features && project.features.length > 0 && (
          <ul className="text-sm text-slate-300 space-y-2 mb-4">
            {project.features.slice(0,3).map((f,i) => <li key={i} className="flex items-start gap-3"><span className="text-xs text-white/80">●</span><span>{isRtl ? (project.featuresAr ? project.featuresAr[i] : f) : f}</span></li>)}
          </ul>
        )}

        <div className="flex items-center justify-between">
          <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 text-white rounded-md hover:bg-white/10 transition">{t('projects.details') || 'Details'} <FaExternalLinkAlt className="text-xs opacity-70"/></Link>
          <div className="text-xs text-slate-500">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}</div>
        </div>
      </div>
    </div>
  )
} 
