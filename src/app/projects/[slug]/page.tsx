'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Calendar, 
  ExternalLink, 
  Github, 
  ArrowLeft, 
  ArrowRight,
  Code,
  Network,
  Zap,
  Target,
  Users,
  Share2,
  Heart,
  Eye,
  Clock,
  MapPin,
  Mail
} from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  featured_image?: string
  technologies: string[]
  category_id?: number
  context?: string
  constraints?: string
  architecture?: string
  implementation?: string
  results?: string
  gallery?: string[]
  demo_url?: string
  github_url?: string
  completion_date?: string
  featured: boolean
  published: boolean
  created_at: string
  updated_at: string
  categories?: {
    name: string
    icon: string
    color: string
  }
}

interface RelatedProject {
  id: number
  title: string
  slug: string
  short_description: string
  featured_image?: string
  technologies: string[]
  categories?: {
    name?: string
  }
}

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchRelatedProjects()
  }, [slug])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          categories (
            name,
            icon,
            color,
            order_index
          )
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      setProject(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          slug,
          short_description,
          featured_image,
          technologies,
          categories (
            name
          )
        `)
        .neq('slug', slug)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      setRelatedProjects((data || []) as any)
    } catch (error) {
      console.error('Error fetching related projects:', error)
    }
  }

  const shareProject = (platform: string) => {
    const url = `${window.location.origin}/projects/${slug}`
    const text = `Découvrez ce projet : ${project?.title}`
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      default:
        navigator.clipboard.writeText(url)
        alert('Lien copié dans le presse-papiers !')
        return
    }
    
    window.open(shareUrl, '_blank')
  }

  const nextImage = () => {
    if (project?.gallery && project.gallery.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % (project.gallery?.length || 1))
    }
  }

  const prevImage = () => {
    if (project?.gallery && project.gallery.length > 0) {
      setCurrentImageIndex((prev) => prev === 0 ? (project.gallery?.length || 1) - 1 : prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
          <Link href="/projects" className="btn-primary">
            Retour aux projets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeSwitcher />
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Project Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <Link 
                    href="/projects" 
                    className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: project.categories?.color + '20', color: project.categories?.color }}
                    >
                      {project.categories?.name}
                    </span>
                    {project.featured && (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">
                        Vedette
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                  {project.title}
                </h1>
                
                <p className="text-xl text-text-secondary mb-6 leading-relaxed">
                  {project.short_description}
                </p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{project.completion_date ? new Date(project.completion_date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long'
                    }) : 'Date non disponible'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil((new Date().getTime() - new Date(project.completion_date || '').getTime()) / (1000 * 60 * 60 * 24 * 30))} mois</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Technologies utilisées
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {project.demo_url && project.demo_url !== null && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Voir la démo
                    </a>
                  )}
                  
                  {project.github_url && project.github_url !== null && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Github className="w-5 h-5" />
                      Voir le code
                    </a>
                  )}
                  
                  <div className="relative">
                    <button
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Partager
                    </button>
                    
                    {shareMenuOpen && (
                      <div className="absolute top-full mt-2 right-0 bg-surface border border-gray-800 rounded-lg shadow-xl p-2 z-50 min-w-[200px]">
                        <button
                          onClick={() => shareProject('twitter')}
                          className="w-full text-left px-4 py-2 hover:bg-surface-elevated rounded transition-colors flex items-center gap-3"
                        >
                          <span className="text-blue-400">𝕏</span>
                          Twitter
                        </button>
                        <button
                          onClick={() => shareProject('linkedin')}
                          className="w-full text-left px-4 py-2 hover:bg-surface-elevated rounded transition-colors flex items-center gap-3"
                        >
                          <span className="text-blue-600">in</span>
                          LinkedIn
                        </button>
                        <button
                          onClick={() => shareProject('facebook')}
                          className="w-full text-left px-4 py-2 hover:bg-surface-elevated rounded transition-colors flex items-center gap-3"
                        >
                          <span className="text-blue-500">f</span>
                          Facebook
                        </button>
                        <hr className="my-2 border-gray-800" />
                        <button
                          onClick={() => shareProject('copy')}
                          className="w-full text-left px-4 py-2 hover:bg-surface-elevated rounded transition-colors flex items-center gap-3"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Copier le lien
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Image Gallery */}
              <div className="relative">
                {project.gallery && project.gallery.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-surface rounded-lg overflow-hidden">
                      <Image
                        src={project.gallery[currentImageIndex]}
                        alt={`${project.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      />
                    </div>
                    
                    {/* Gallery Navigation */}
                    {project.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Gallery Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : project.featured_image ? (
                  <div className="aspect-video bg-surface rounded-lg overflow-hidden">
                    <Image
                        src={project.featured_image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      />
                  </div>
                ) : (
                  <div className="aspect-video bg-surface rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Code className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-text-secondary">Aucune image disponible</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Context */}
                {project.context && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      Contexte
                    </h3>
                    <div className="card p-6">
                      <p className="leading-relaxed">{project.context}</p>
                    </div>
                  </div>
                )}

                {/* Architecture */}
                {project.architecture && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Network className="w-5 h-5 text-blue-500" />
                      </div>
                      Architecture
                    </h3>
                    <div className="card p-6">
                      <p className="leading-relaxed">{project.architecture}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Constraints */}
                {project.constraints && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-500" />
                      </div>
                      Contraintes
                    </h3>
                    <div className="card p-6">
                      <p className="leading-relaxed">{project.constraints}</p>
                    </div>
                  </div>
                )}

                {/* Implementation */}
                {project.implementation && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-green-500" />
                      </div>
                      Implémentation
                    </h3>
                    <div className="card p-6">
                      <p className="leading-relaxed">{project.implementation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {project.results && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  Résultats & Apprentissages
                </h3>
                <div className="card p-8 max-w-4xl mx-auto">
                  <p className="leading-relaxed text-center">{project.results}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                Projets similaires
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.slug}`}
                    className="card group hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="aspect-video bg-surface rounded-lg overflow-hidden mb-4">
                      {relatedProject.featured_image ? (
                        <Image
                          src={relatedProject.featured_image}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code className="w-8 h-8 text-primary/30" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                      {relatedProject.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        {relatedProject.categories?.name}
                      </span>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="text-xs">Voir</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
