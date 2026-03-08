'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Project, Category, ProjectWithCategory } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('order_index')

        if (categoriesError) {
          console.warn('Erreur catégories:', categoriesError.message)
        }

        // Récupérer les projets publiés
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            categories (
              name,
              color,
              icon
            )
          `)
          .eq('published', true)
          .order('order_index')

        if (projectsError) {
          console.error('Erreur projets:', projectsError)
          setProjects([])
        } else {
          // Transformer les données pour correspondre à ProjectWithCategory
          const transformedProjects = projectsData.map((project: any) => ({
            ...project,
            categories: project.categories || { name: 'Non catégorisé', color: null, icon: null, order: 0, description: null, created_at: '', updated_at: '' }
          }))
          setProjects(transformedProjects)
        }

        // Mettre à jour les catégories
        if (categoriesData) {
          const allCategories = [
            { id: 0, name: 'Tous', slug: 'all', color: null, description: null, icon: null, order: 0, created_at: '', updated_at: '' },
            ...categoriesData
          ]
          setCategories(allCategories)
        } else {
          setCategories([{ id: 0, name: 'Tous', slug: 'all', color: null, description: null, icon: null, order: 0, created_at: '', updated_at: '' }])
        }
      } catch (error) {
        console.error('Erreur critique lors du chargement:', error)
        setCategories([{ id: 0, name: 'Tous', slug: 'all', color: null, description: null, icon: null, order: 0, created_at: '', updated_at: '' }])
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.categories.name === activeCategory)

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-2 pt-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Mes Projets
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Découvrez mes réalisations et les technologies que j'utilise
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.slug
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-surface text-text-secondary hover:bg-surface-elevated'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              Aucun projet trouvé dans cette catégorie.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}