'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Briefcase, 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Calendar,
  Check
} from 'lucide-react'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import AdminFilters from '@/components/admin/premium/AdminFilters'

interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  current: boolean
  description: string
  accomplishments: string[]
  technologies: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateExperience = async (experienceData: Partial<Experience>) => {
    try {
      console.log('📝 Creating experience with data:', experienceData)
      
      // 🔍 DIAGNOSTIC: Vérifier la structure de la table
      console.log('🔍 DIAGNOSTIC: Checking table structure...')
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('experiences')
          .select('*')
          .limit(1)
        
        console.log('📋 Table structure test:', { tableInfo, tableError })
        
        if (tableError) {
          console.error('❌ Table access error:', tableError)
        }
      } catch (diagError) {
        console.error('❌ Diagnostic error:', diagError)
      }
      
      // 🔍 DIAGNOSTIC: Tester les permissions
      console.log('🔐 DIAGNOSTIC: Testing permissions...')
      try {
        const { data: permData, error: permError } = await supabase
          .from('experiences')
          .select('count')
          .single()
        
        console.log('🔐 Permissions test:', { permData, permError })
      } catch (permDiagError) {
        console.error('❌ Permissions diagnostic error:', permDiagError)
      }
      
      // Validation des données requises
      const requiredFields = ['title', 'company', 'location', 'start_date', 'description']
      const missingFields = requiredFields.filter(field => !experienceData[field as keyof Experience])
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields)
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }
      
      // 🧪 TEST: Essayer avec données minimales d'abord
      console.log('🧪 TESTING: Trying minimal data insert...')
      const minimalData = {
        title: experienceData.title!,
        company: experienceData.company!,
        location: experienceData.location!,
        start_date: experienceData.start_date!,
        description: experienceData.description!
      }
      
      try {
        const { data: minimalResult, error: minimalError } = await supabase
          .from('experiences')
          .insert(minimalData)
          .select()
        
        console.log('🧪 Minimal insert result:', { minimalResult, minimalError })
        
        if (minimalError) {
          console.error('❌ Minimal insert failed:', minimalError)
          throw minimalError
        }
        
        console.log('✅ Minimal insert successful!')
        await fetchExperiences()
        setShowCreateModal(false)
        return
        
      } catch (minimalError) {
        console.error('❌ Minimal insert failed, trying full data...')
        
        // Préparation des données complètes pour Supabase
        const supabaseData = {
          title: experienceData.title!,
          company: experienceData.company!,
          location: experienceData.location!,
          start_date: experienceData.start_date!,
          end_date: experienceData.end_date || null,
          current: experienceData.current || false,
          description: experienceData.description!,
          accomplishments: experienceData.accomplishments || [],
          technologies: experienceData.technologies || [],
          order_index: experiences.length
        }
        
        console.log('📤 Prepared full data for Supabase:', supabaseData)
        
        const { data, error } = await supabase
          .from('experiences')
          .insert(supabaseData)
          .select()

        console.log('📊 Full Supabase response:', { data, error })

        if (error) {
          console.error('❌ Full Supabase error details:', {
            message: error.message || 'No message',
            details: error.details || 'No details',
            hint: error.hint || 'No hint',
            code: error.code || 'No code',
            fullError: error
          })
          throw error
        }

        console.log('✅ Full Experience created successfully:', data)
        await fetchExperiences()
        setShowCreateModal(false)
      }
      
    } catch (error) {
      console.error('💥 FINAL ERROR creating experience:', error)
      console.error('💥 Error type:', typeof error)
      console.error('💥 Error keys:', Object.keys(error || {}))
      console.error('💥 Error message:', error?.message)
      console.error('💥 Error details:', error?.details)
    }
  }

  const handleUpdateExperience = async (id: number, updates: Partial<Experience>) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      await fetchExperiences()
      setEditingExperience(null)
    } catch (error) {
      console.error('Error updating experience:', error)
    }
  }

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchExperiences()
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }

  const filteredExperiences = experiences.filter(experience =>
    experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const calculateDuration = (startDate: string, endDate: string | null, current: boolean) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    
    const months = Math.floor((end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (remainingMonths === 0) {
      return `${years} an${years > 1 ? 's' : ''}`
    } else {
      return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des expériences...</p>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gestion des Expériences"
          description="Gérez votre parcours professionnel et vos réalisations"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Expériences", href: "/admin/experiences" }
          ]}
          actions={
            <Link
              href="/admin/experiences/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une expérience
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
            placeholder: 'Toutes les entreprises',
            value: '',
            onChange: (value) => {},
            options: [
              { value: '', label: 'Toutes les entreprises' }
            ]
          },
          {
            type: 'select',
            placeholder: 'Toutes les périodes',
            value: '',
            onChange: (value) => {},
            options: [
              { value: '', label: 'Toutes les périodes' },
              { value: 'current', label: 'En cours' },
              { value: 'past', label: 'Terminées' }
            ]
          }
        ]}
        resultsCount={filteredExperiences.length}
        resultsLabel="expérience(s)"
      />

      {/* Timeline */}
      <div className="space-y-6">
        {filteredExperiences.map((experience) => (
          <div key={experience.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-text-primary">{experience.title}</h3>
                    {experience.current && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        En cours
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {experience.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {experience.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {calculateDuration(experience.start_date, experience.end_date, experience.current)}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {experience.description}
                  </p>
                  {experience.accomplishments && experience.accomplishments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-text-primary mb-2">Réalisations</h4>
                      <ul className="space-y-1">
                        {experience.accomplishments.slice(0, 3).map((accomplishment, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            {accomplishment}
                          </li>
                        ))}
                        {experience.accomplishments.length > 3 && (
                          <li className="text-sm text-text-muted">
                            +{experience.accomplishments.length - 3} autres réalisations
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/experiences/${experience.id}/edit`}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteExperience(experience.id)}
                  className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Aucune expérience</h3>
          <p className="text-text-secondary mb-4">
            Commencez par ajouter vos expériences professionnelles
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ajouter une expérience
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingExperience) && (
        <ExperienceModal
          experience={editingExperience}
          onSave={editingExperience ? 
            (data) => handleUpdateExperience(editingExperience.id, data) : 
            handleCreateExperience
          }
          onClose={() => {
            setShowCreateModal(false)
            setEditingExperience(null)
          }}
        />
      )}
    </PageLayout>
  )
}

// Experience Modal Component
interface ExperienceModalProps {
  experience: Experience | null
  onSave: (experience: Partial<Experience>) => void
  onClose: () => void
}

function ExperienceModal({ experience, onSave, onClose }: ExperienceModalProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    current: false,
    end_date: '',
    id: undefined,
    title: '',
    company: '',
    location: '',
    start_date: '',
    description: '',
    accomplishments: [],
    technologies: [],
    order_index: 0,
    created_at: '',
    updated_at: ''
  })
  const experienceRef = useRef(experience)

  useEffect(() => {
    if (experience && experience !== experienceRef.current) {
      experienceRef.current = experience
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFormData({
        ...formData,
        ...experience,
        accomplishments: experience.accomplishments || [],
        technologies: experience.technologies || []
      })
    }
  }, [experience, formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addAccomplishment = () => {
    setFormData({
      ...formData,
      accomplishments: [...(formData.accomplishments || []), '']
    })
  }

  const removeAccomplishment = (index: number) => {
    setFormData({
      ...formData,
      accomplishments: formData.accomplishments?.filter((_, i) => i !== index) || []
    })
  }

  const addTechnology = () => {
    setFormData({
      ...formData,
      technologies: [...(formData.technologies || []), '']
    })
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || []
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {experience ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Titre du poste
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Entreprise
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Localisation
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date de début
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="current"
                checked={formData.current || false}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  current: e.target.checked,
                  end_date: e.target.checked ? '' : formData.end_date
                })}
                className="w-4 h-4 text-primary"
              />
              <label htmlFor="current" className="ml-2 text-sm font-medium text-text-primary">
                Poste actuel
              </label>
            </div>

            {!formData.current && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Accomplishments */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Réalisations principales
            </label>
            <div className="space-y-2">
              {formData.accomplishments?.map((accomplishment, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={accomplishment}
                    onChange={(e) => {
                      const newAccomplishments = [...(formData.accomplishments || [])]
                      newAccomplishments[index] = e.target.value
                      setFormData({ ...formData, accomplishments: newAccomplishments })
                    }}
                    className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: Augmentation des ventes de 40%"
                  />
                  <button
                    type="button"
                    onClick={() => removeAccomplishment(index)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAccomplishment}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
              >
                + Ajouter une réalisation
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Technologies utilisées
            </label>
            <div className="space-y-2">
              {formData.technologies?.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => {
                      const newTechnologies = [...(formData.technologies || [])]
                      newTechnologies[index] = e.target.value
                      setFormData({ ...formData, technologies: newTechnologies })
                    }}
                    className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ex: React, Node.js, TypeScript"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTechnology}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
              >
                + Ajouter une technologie
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {experience ? 'Mettre à jour' : 'Créer'} l'expérience
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
