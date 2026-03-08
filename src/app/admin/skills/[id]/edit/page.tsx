'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Edit from '@/components/Edit'

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

export default function EditSkillPage() {
  const [skill, setSkill] = useState<Skill | null>(null)
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const id = params.id as string

  useEffect(() => {
    if (!user) {
      router.push('/admin')
      return
    }

    fetchSkill()
    fetchCategories()
  }, [user, id])

  const fetchSkill = async () => {
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
        .eq('id', id)
        .single()

      if (error) throw error
      setSkill(data)
    } catch (error) {
      console.error('Error fetching skill:', error)
      setError('Erreur lors du chargement de la compétence')
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

  const handleSave = async () => {
    if (!skill) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { error } = await supabase
        .from('skills')
        .update({
          name: skill.name,
          category_id: skill.category_id,
          level: skill.level,
          years_experience: skill.years_experience,
          icon: skill.icon,
          description: skill.description,
          order_index: skill.order_index,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      setSuccess('Compétence mise à jour avec succès!')
      setTimeout(() => {
        router.push('/admin/skills')
      }, 1500)
    } catch (err) {
      console.error('Error updating skill:', err)
      setError('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!skill || !confirm('Êtes-vous sûr de vouloir supprimer cette compétence?')) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id)

      if (error) throw error

      setSuccess('Compétence supprimée avec succès!')
      setTimeout(() => {
        router.push('/admin/skills')
      }, 1500)
    } catch (err) {
      console.error('Error deleting skill:', err)
      setError('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !skill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-gray-800 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center">
            <Link href="/admin/skills" className="flex items-center text-text-secondary hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="ml-2">Retour aux compétences</span>
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Modifier la compétence</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3">
            <div className="text-sm">{success}</div>
          </div>
        )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3">
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Form */}
      <div className="p-6">
        {skill && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Nom de la compétence
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => setSkill({...skill, name: e.target.value})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Catégorie
                </label>
                <select
                  value={skill.category_id}
                  onChange={(e) => setSkill({...skill, category_id: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niveau */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Niveau
                </label>
                <select
                  value={skill.level}
                  onChange={(e) => setSkill({...skill, level: e.target.value as 'Expert' | 'Advanced' | 'Intermediate'})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                >
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </div>

              {/* Années d'expérience */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Années d'expérience
                </label>
                <input
                  type="number"
                  value={skill.years_experience}
                  onChange={(e) => setSkill({...skill, years_experience: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                  min="0"
                />
              </div>

              {/* Icône */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Icône (nom Lucide)
                </label>
                <input
                  type="text"
                  value={skill.icon}
                  onChange={(e) => setSkill({...skill, icon: e.target.value})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                  placeholder="ex: Database, Code, etc."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary">
                  Description
                </label>
                <textarea
                  value={skill.description}
                  onChange={(e) => setSkill({...skill, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                />
              </div>

              {/* Ordre d'affichage */}
              <div>
                <label className="block text-sm font-medium text-text-primary">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={skill.order_index}
                  onChange={(e) => setSkill({...skill, order_index: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary"
                  min="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/admin/skills')}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        )}
      </div>
      </main>
    </div>
  )
}
