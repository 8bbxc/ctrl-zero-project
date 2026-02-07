import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <div className="card hover:shadow-2xl transition transform hover:-translate-y-1">
      <div className="h-44 w-full overflow-hidden">
        {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <p className="text-sm text-text/70 mt-2">{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((t,i)=> <span key={i} className="text-xs px-2 py-1 bg-primary/30 rounded text-text/80">{t}</span>)}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/projects/${project.slug}`} className="text-sm bg-accent text-white px-3 py-1 rounded hover:opacity-95 transition">Details</Link>
          <div className="text-xs text-text/50">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}</div>
        </div>
      </div>
    </div>
  )
}
