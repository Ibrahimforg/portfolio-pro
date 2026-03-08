'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Network
} from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { SmartphoneIcon } from '@/components/ui/PWAManager'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import AdminFilters from '@/components/admin/premium/AdminFilters'

interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  category_id: number
  technologies: string[]
  completion_date: string
  featured: boolean
  published: boolean
  created_at: string
  categories?: {
    name: string
    icon: string
  }
}

interface Category {
  id: number
  name: string
  icon: string
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Web': Network,
  'Mobile': SmartphoneIcon,
  'Réseaux': Network,
}

export default function ProjectsManagement() {
  // const { user } = useAuth()
  const router = useRouter()
  
  // Simulation temporaire
  const user = useMemo(() => ({ email: 'admin@example.com' }), [])
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/admin')
      return
    }

    fetchProjects()
    fetchCategories()
  }, [user, router])

  const fetchProjects = async () => {
    try {
      const query = supabase
        .from('projects')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
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

  const deleteProject = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Erreur lors de la suppression du projet')
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || project.category_id === parseInt(filterCategory)
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'published' && project.published) ||
                         (filterStatus === 'draft' && !project.published) ||
                         (filterStatus === 'featured' && project.featured)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (project: Project) => {
    if (!project.published) {
      return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">Brouillon</span>
    }
    if (project.featured) {
      return <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">Vedette</span>
    }
    return <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium">Publié</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gestion des Projets"
          description="Gérez vos projets professionnels et personnels"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Projets", href: "/admin/projects" }
          ]}
          actions={
            <Link
              href="/admin/projects/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau projet
            </Link>
          }
        />
      }
    >
      {/* Filters */}
      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            type: 'select',
            placeholder: 'Toutes les catégories',
            value: filterCategory,
            onChange: (value) => setFilterCategory(value),
            options: categories.map(cat => ({
              value: cat.id.toString(),
              label: cat.name
            }))
          },
          {
            type: 'select',
            placeholder: 'Tous les statuts',
            value: filterStatus,
            onChange: (value) => setFilterStatus(value),
            options: [
              { value: '', label: 'Tous les statuts' },
              { value: 'published', label: 'Publié' },
              { value: 'draft', label: 'Brouillon' }
            ]
          }
        ]}
        resultsCount={filteredProjects.length}
        resultsLabel="projet(s)"
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-text-secondary mb-4">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun projet trouvé</p>
            <p className="text-sm mt-2">
              {searchTerm || filterCategory || filterStatus 
                ? 'Essayez de modifier vos filtres' 
                : 'Commencez par ajouter vos projets'}
            </p>
          </div>
          {!searchTerm && !filterCategory && !filterStatus && (
            <Link
              href="/admin/projects/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un projet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const CategoryIcon = categoryIcons[project.categories?.name || 'Autres'] || Network
            return (
              <div key={project.id} className="card group hover:border-primary transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-text-primary">
                        {project.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {project.categories?.name || 'Autres'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="p-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Project Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Statut</span>
                    <span className={`text-sm font-medium ${
                      project.published ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {project.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        project.published ? 'bg-green-400' : 'bg-yellow-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Project Description */}
                {project.short_description && (
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                    {project.short_description}
                  </p>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs text-text-secondary">
                    Ajouté le {new Date(project.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                      <Star className="w-3 h-3 inline mr-1" />
                      En vedette
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
