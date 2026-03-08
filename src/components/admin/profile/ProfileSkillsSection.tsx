// Section Compétences pour l'admin profil
// Gestion dynamique des catégories et compétences

'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Network, Radio, Cloud, Shield } from 'lucide-react'
import { ProfileSection } from './ProfileSection'
import { ExtendedProfileData } from '@/types/profile'

interface ProfileSkillsSectionProps {
  profileData: Partial<ExtendedProfileData>
  onChange: (field: keyof ExtendedProfileData, value: ExtendedProfileData[keyof ExtendedProfileData]) => void
  errors: Record<string, string>
}

const CATEGORY_ICONS = {
  réseau: Network,
  télécom: Radio,
  cloud: Cloud,
  sécurité: Shield
}

const LEVEL_OPTIONS = [
  { value: 'expert', label: 'Expert' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'intermediate', label: 'Intermédiaire' }
]

export const ProfileSkillsSection: React.FC<ProfileSkillsSectionProps> = ({
  profileData,
  onChange,
  errors
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newSkill, setNewSkill] = useState<{ [category: string]: string }>({})
  
  const skillsConfig = profileData.skills_config || {}

  const addSkill = (category: string) => {
    if (!newSkill[category]?.trim()) return

    const updatedConfig = {
      ...skillsConfig,
      [category]: {
        ...skillsConfig[category],
        skills: [...(skillsConfig[category]?.skills || []), newSkill[category].trim()]
      }
    }

    onChange('skills_config', updatedConfig)
    setNewSkill({ ...newSkill, [category]: '' })
  }

  const removeSkill = (category: string, skillIndex: number) => {
    const updatedConfig = {
      ...skillsConfig,
      [category]: {
        ...skillsConfig[category],
        skills: skillsConfig[category]?.skills?.filter((_, index) => index !== skillIndex) || []
      }
    }

    onChange('skills_config', updatedConfig)
  }

  const updateCategoryField = (category: string, field: string, value: string) => {
    const updatedConfig = {
      ...skillsConfig,
      [category]: {
        ...skillsConfig[category],
        [field]: value
      }
    }

    onChange('skills_config', updatedConfig)
  }

  return (
    <ProfileSection
      title="Compétences & Expertises"
      description="Gérez vos compétences par catégorie avec niveaux d'expertise"
      icon={<Network className="w-5 h-5" />}
    >
      {/* Mode d'affichage */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Mode d'affichage
        </label>
        <select
          value={profileData.skills_display_mode || 'grid'}
          onChange={(e) => onChange('skills_display_mode', e.target.value as 'grid' | 'list' | 'cards')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="grid">Grille</option>
          <option value="list">Liste</option>
          <option value="cards">Cartes</option>
        </select>
      </div>

      {/* Catégories de compétences */}
      <div className="space-y-6">
        {Object.entries(skillsConfig).map(([category, config]) => {
          const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Network
          const isEditing = editingCategory === category

          return (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              {/* Header catégorie */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-primary" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => updateCategoryField(category, 'title', e.target.value)}
                      className="text-lg font-semibold bg-transparent border-b border-primary focus:outline-none"
                    />
                  ) : (
                    <h4 className="text-lg font-semibold text-text-primary">{config.title}</h4>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Configuration catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Icône
                  </label>
                  <input
                    type="text"
                    value={config.icon}
                    onChange={(e) => updateCategoryField(category, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="network, cloud, shield..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Niveau
                  </label>
                  <select
                    value={config.level}
                    onChange={(e) => updateCategoryField(category, 'level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {LEVEL_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Liste des compétences */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Compétences
                </label>
                
                {config.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {skill}
                    </span>
                    <button
                      onClick={() => removeSkill(category, index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Ajouter compétence */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill[category] || ''}
                    onChange={(e) => setNewSkill({ ...newSkill, [category]: e.target.value })}
                    placeholder="Ajouter une compétence..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill(category)}
                  />
                  <button
                    onClick={() => addSkill(category)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ProfileSection>
  )
}
