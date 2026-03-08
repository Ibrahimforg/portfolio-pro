'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { ProjectCardSkeleton } from '@/components/ui/LoadingStates'
import { useAnalyticsUltraLight } from '@/hooks/useAnalyticsUltraLight'

interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  featured_image: string | null
  technologies: string[]
  categories?: {
    name: string
    icon: string
    color: string
  }
  completion_date?: string
  demo_url: string | null
  github_url: string | null
}

interface ProjectCardProps {
  project: Project
  loading?: boolean
}

export function ProjectCard({ project, loading = false }: ProjectCardProps) {
  const { trackClick } = useAnalyticsUltraLight()
  
  if (loading) {
    return <ProjectCardSkeleton />
  }

  return (
    <div className="card hover-lift group animate-fadeInUp">
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        {project.featured_image && project.featured_image.trim() !== '' ? (
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-primary/60 text-4xl font-bold">
              {project.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-white hover:text-primary-light text-sm transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Demo</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-primary hover:text-primary-hover text-sm transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gradient">{project.title}</h3>
        <p className="text-secondary line-clamp-2">{project.short_description}</p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/10 text-secondary">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="btn-primary flex-1 text-center"
            onClick={() => trackClick(`project_${project.title}`)}
          >
            Voir le projet
          </Link>
        </div>
      </div>
    </div>
  )
}
