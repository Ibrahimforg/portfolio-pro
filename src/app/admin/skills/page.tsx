'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  Database,
  Globe,
  Code
} from 'lucide-react'
// import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { SmartphoneIcon } from '@/components/ui/PWAManager'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import AdminFilters from '@/components/admin/premium/AdminFilters'
import ConfirmModal from '@/components/admin/premium/ConfirmModal'

interface Skill {
  id: number
  name: string
  category_id: number
  level: 'Expert' | 'Advanced' | 'Intermediate'
  years_experience: number
  icon: string
  description: string
  order_index: number
  created_at: string
  skill_categories?: {
    name: string
    icon: string
  }
}

interface SkillCategory {
  id: number
  name: string
  icon: string
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Frontend': Globe,
  'Backend': Database,
  'DevOps': Shield,
  'Réseaux': Code,
  'Sécurité': Shield,
  'Base de données': Database,
  'Cloud': Globe,
  'Mobile': SmartphoneIcon,
  'Autres': Code,
}

const getLevelPercentage = (level: string) => {
  switch (level) {
    case 'Expert': return 100
    case 'Advanced': return 75
    case 'Intermediate': return 50
    default: return 25
  }
}

export default function SkillsManagement() {
  // const { user } = useAuth()
  const router = useRouter()
  
  // Simulation temporaire
  const user = useMemo(() => ({ email: 'admin@example.com' }), [])
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; skillId: number | null; skillName: string }>({
    isOpen: false,
    skillId: null,
    skillName: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/admin')
      return
    }

    fetchSkills()
    fetchCategories()
  }, [user, router])

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          skill_categories (
            name,
            icon
          )
        `)
        .order('order_index')

      if (error) throw error
      setSkills(data || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('order_index')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const deleteSkill = async (id: number) => {
    const skill = skills.find(s => s.id === id)
    setDeleteModal({
      isOpen: true,
      skillId: id,
      skillName: skill?.name || 'Cette compétence'
    })
  }

  const confirmDelete = async () => {
    if (!deleteModal.skillId) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', deleteModal.skillId)

      if (error) throw error

      setSkills(skills.filter(s => s.id !== deleteModal.skillId))
      setDeleteModal({ isOpen: false, skillId: null, skillName: '' })
    } catch (error) {
      console.error('Error deleting skill:', error)
      // TODO: Replace with themed error modal
      console.error('Erreur lors de la suppression de la compétence')
    }
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || skill.category_id === parseInt(filterCategory)
    const matchesLevel = !filterLevel || skill.level === filterLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

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
    <PageLayout
      header={
        <PageHeader
          title="Gestion des Compétences"
          description="Gérez vos compétences techniques et professionnelles"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Compétences", href: "/admin/skills" }
          ]}
          actions={
            <Link
              href="/admin/skills/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle compétence
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
            placeholder: 'Tous les niveaux',
            value: filterLevel,
            onChange: (value) => setFilterLevel(value),
            options: [
              { value: '', label: 'Tous les niveaux' },
              { value: 'Expert', label: 'Expert' },
              { value: 'Advanced', label: 'Avancé' },
              { value: 'Intermediate', label: 'Intermédiaire' }
            ]
          }
        ]}
        resultsCount={filteredSkills.length}
        resultsLabel="compétence(s)"
      />

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-text-secondary mb-4">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune compétence trouvée</p>
            <p className="text-sm mt-2">
              {searchTerm || filterCategory || filterLevel 
                ? 'Essayez de modifier vos filtres' 
                : 'Commencez par ajouter vos compétences'}
            </p>
          </div>
          {!searchTerm && !filterCategory && !filterLevel && (
            <Link
              href="/admin/skills/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une compétence
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const CategoryIcon = categoryIcons[skill.skill_categories?.name || 'Autres'] || Code
            return (
              <div key={skill.id} className="card group hover:border-primary transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-text-primary">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {skill.skill_categories?.name || 'Autres'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/skills/${skill.id}/edit`}
                      className="p-2 text-text-secondary hover:text-primary transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Skill Level */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Niveau</span>
                    <span className="text-sm font-medium text-text-primary">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getLevelPercentage(skill.level)}%` }}
                    />
                  </div>
                </div>

                {/* Skill Description */}
                {skill.description && (
                  <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                    {skill.description}
                  </p>
                )}

                {/* Date */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-xs text-text-secondary">
                    Ajoutée le {new Date(skill.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, skillId: null, skillName: '' })}
        onConfirm={confirmDelete}
        title="Supprimer la compétence"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.skillName}" ? Cette action est irréversible.`}
        itemName={deleteModal.skillName}
        type="delete"
      />
    </PageLayout>
  )
}
