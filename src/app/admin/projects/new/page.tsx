'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Plus,
  X,
  Upload,
  Calendar
} from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

interface ProjectForm {
  title: string
  slug: string
  short_description: string
  full_description: string
  category_id: number
  technologies: string[]
  context: string
  constraints: string
  architecture: string
  implementation: string
  results: string
  featured_image: string
  gallery: string[]
  demo_url: string
  github_url: string
  completion_date: string
  featured: boolean
  published: boolean
}

export default function NewProject() {
  // const { user } = useAuth()
  const router = useRouter()
  
  // Simulation temporaire
  const user = useMemo(() => ({ email: 'admin@example.com' }), [])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [techInput, setTechInput] = useState('')
  
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    category_id: 0,
    technologies: [],
    context: '',
    constraints: '',
    architecture: '',
    implementation: '',
    results: '',
    featured_image: '',
    gallery: [],
    demo_url: '',
    github_url: '',
    completion_date: '',
    featured: false,
    published: true
  })

  useEffect(() => {
    if (!user) {
      router.push('/admin')
      return
    }

    fetchCategories()
  }, [user, router])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          ...formData,
          category_id: formData.category_id || null
        })

      if (error) throw error
      
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Erreur lors de la création du projet')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    const slug = formData.slug || generateSlug(formData.title)
    window.open(`/projects/${slug}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/projects" className="text-text-secondary hover:text-primary">
                ← Projets
              </Link>
              <h1 className="text-xl font-bold">Nouveau Projet</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                className="btn-secondary flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Aperçu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Informations de base</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field"
                  placeholder="Mon projet awesome"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-field"
                  placeholder="mon-projet-awesome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
                  className="input-field"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date de complétion *
                </label>
                <input
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Description courte *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                className="input-field"
                rows={3}
                placeholder="Résumé en une phrase du projet..."
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Description complète *
              </label>
              <textarea
                value={formData.full_description}
                onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                className="input-field"
                rows={6}
                placeholder="Description détaillée du projet..."
                required
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Technologies</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="input-field flex-1"
                  placeholder="Ajouter une technologie..."
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-primary-hover"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Détails du projet</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contexte
                </label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Contexte et problématique du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contraintes
                </label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) => setFormData(prev => ({ ...prev, constraints: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Contraintes techniques et fonctionnelles..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Architecture
                </label>
                <textarea
                  value={formData.architecture}
                  onChange={(e) => setFormData(prev => ({ ...prev, architecture: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Architecture technique et choix..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Implémentation
                </label>
                <textarea
                  value={formData.implementation}
                  onChange={(e) => setFormData(prev => ({ ...prev, implementation: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Détails d'implémentation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Résultats
                </label>
                <textarea
                  value={formData.results}
                  onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Résultats et apprentissages..."
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Liens</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL de démo
                </label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                  className="input-field"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL GitHub
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  className="input-field"
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Options</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium">
                  Mettre en vedette sur l&apos;accueil
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium">
                  Publier immédiatement
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/admin/projects"
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Annuler
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Créer le projet
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
