'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Plus,
  X,
  Upload,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
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

export default function EditProject() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    context: '',
    category_id: 0,
    technologies: [],
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

    fetchProject()
    fetchCategories()
  }, [user, router, projectId])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', parseInt(projectId))
        .single()

      if (error) throw error
      
      if (data) {
        setFormData({
          ...data,
          completion_date: data.completion_date ? new Date(data.completion_date).toISOString().split('T')[0] : ''
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/admin/projects')
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setSaveStatus('idle')

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...formData,
          category_id: formData.category_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', parseInt(projectId))

      if (error) throw error
      
      setSaveStatus('success')
      setTimeout(() => {
        router.push('/admin/projects')
      }, 1500)
    } catch (error) {
      console.error('Error updating project:', error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    const slug = formData.slug || generateSlug(formData.title)
    window.open(`/projects/${slug}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/projects" className="text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Projets
              </Link>
              <div>
                <h1 className="text-xl font-bold">Modifier le projet</h1>
                <p className="text-sm text-text-secondary">{formData.title}</p>
              </div>
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

      {/* Save Status Banner */}
      {saveStatus === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <span>Projet sauvegardé avec succès ! Redirection...</span>
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>Erreur lors de la sauvegarde. Veuillez réessayer.</span>
        </div>
      )}

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-bold">Informations de base</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  Titre *
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Principal</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="input-field focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Mon projet awesome"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-field font-mono text-sm"
                  placeholder="mon-projet-awesome"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
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

              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  Date de complétion *
                  <Calendar className="w-4 h-4 text-text-secondary" />
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

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium">
                Description courte *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                rows={3}
                placeholder="Résumé en une phrase du projet..."
                required
              />
              <p className="text-xs text-text-secondary">
                {formData.short_description.length}/200 caractères
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium">
                Description complète *
              </label>
              <textarea
                value={formData.full_description}
                onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                rows={6}
                placeholder="Description détaillée du projet..."
                required
              />
            </div>
          </div>

          {/* Technologies */}
          <div className="card group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <h2 className="text-xl font-bold">Technologies</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="input-field flex-1 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Ajouter une technologie et presser Entrée..."
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-4 bg-surface-elevated/50 rounded-lg min-h-[60px]">
                {formData.technologies.length === 0 ? (
                  <p className="text-text-secondary text-sm w-full text-center">
                    Aucune technologie ajoutée. Commencez par ajouter vos technologies principales.
                  </p>
                ) : (
                  formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="hover:text-primary-hover transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="card group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <h2 className="text-xl font-bold">Détails du projet</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Contexte
                </label>
                <textarea
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  rows={4}
                  placeholder="Contexte et problématique du projet..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Contraintes
                </label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) => setFormData(prev => ({ ...prev, constraints: e.target.value }))}
                  className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  rows={4}
                  placeholder="Contraintes techniques et fonctionnelles..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Architecture
                </label>
                <textarea
                  value={formData.architecture}
                  onChange={(e) => setFormData(prev => ({ ...prev, architecture: e.target.value }))}
                  className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  rows={4}
                  placeholder="Architecture technique et choix..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Implémentation
                </label>
                <textarea
                  value={formData.implementation}
                  onChange={(e) => setFormData(prev => ({ ...prev, implementation: e.target.value }))}
                  className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  rows={4}
                  placeholder="Détails d'implémentation..."
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium">
                Résultats
              </label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                className="input-field resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                rows={4}
                placeholder="Résultats et apprentissages..."
              />
            </div>
          </div>

          {/* Links */}
          <div className="card group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <h2 className="text-xl font-bold">Liens et références</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  URL de démo
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Live</span>
                </label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                  className="input-field focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                  URL GitHub
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Code</span>
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  className="input-field focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="card group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">5</span>
              </div>
              <h2 className="text-xl font-bold">Options de publication</h2>
            </div>
            
            <div className="space-y-6">
              <label className="flex items-center gap-4 p-4 bg-surface-elevated/50 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 text-primary bg-surface border-gray-600 rounded focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Mettre en vedette sur l&apos;accueil
                    <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Vedette</span>
                  </span>
                  <p className="text-xs text-text-secondary mt-1">
                    Le projet apparaîtra dans la section "Projets Vedettes" de la page d&apos;accueil
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 bg-surface-elevated/50 rounded-lg cursor-pointer hover:bg-surface-elevated transition-colors">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="w-5 h-5 text-primary bg-surface border-gray-600 rounded focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Publier immédiatement
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Public</span>
                  </span>
                  <p className="text-xs text-text-secondary mt-1">
                    Le projet sera visible par tous les visiteurs du site
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 bg-surface rounded-lg border border-gray-800">
            <Link
              href="/admin/projects"
              className="btn-secondary flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
              Annuler
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className="btn-secondary flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Eye className="w-5 h-5" />
                Aperçu
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform disabled:scale-100"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
