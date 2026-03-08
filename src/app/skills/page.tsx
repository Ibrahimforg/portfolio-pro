'use client'

import { useState, useEffect } from 'react'
import { 
  Code, 
  Database, 
  Globe
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { SmartphoneIcon } from '@/components/ui/PWAManager'
import { Skill, SkillCategory, SkillWithCategory } from '@/types'

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillWithCategory[]>([])
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('skill_categories')
          .select('*')
          .order('order_index')

        if (categoriesError) {
          console.warn('Erreur catégories:', categoriesError.message)
        }

        // Récupérer les compétences avec jointure
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select(`
            *,
            skill_categories (
              name,
              icon
            )
          `)
          .order('order_index')

        if (skillsError) {
          console.error('Erreur compétences:', skillsError)
          setSkills([])
        } else {
          setSkills(skillsData || [])
        }

        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Erreur critique lors du chargement:', error)
        setSkills([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.skill_categories?.name === activeCategory)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500'
      case 'Advanced': return 'bg-blue-500'
      case 'Intermediate': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'Expert': return 'w-full'
      case 'Advanced': return 'w-4/5'
      case 'Intermediate': return 'w-3/5'
      default: return 'w-2/5'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des compétences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeSwitcher />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Compétences Techniques
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Ensemble des technologies et compétences que j'ai acquises au cours de mon expérience 
            en développement full-stack.
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
                  : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Skills Categories */}
        <div className="grid gap-12">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="card">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{skill.skill_categories?.name}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{skill.name}</h3>
                      <p className="text-sm text-text-secondary">
                        {skill.years_experience} {skill.years_experience === 1 ? 'an' : 'ans'} d'expérience
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>
                  
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-primary transition-all duration-500 ${getLevelWidth(skill.level)}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune compétence */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              Aucune compétence trouvée dans cette catégorie.
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Apprentissage Continu</h3>
            <p className="text-text-secondary mb-6">
              Je reste constamment à jour avec les dernières technologies et meilleures pratiques 
              du développement web. Chaque projet est une opportunité d'apprendre et d'innover.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Code className="w-4 h-4" />
                <span>Code Clean</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Database className="w-4 h-4" />
                <span>Bases de Données</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <SmartphoneIcon className="w-4 h-4" />
                <span>Responsive Design</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
