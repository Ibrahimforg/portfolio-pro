// Section Identité Visuelle pour l'admin profil
// Contrôle du nom, titre principal et sous-titre

'use client'

import React from 'react'
import { User, Briefcase, FileText } from 'lucide-react'
import { ProfileSection } from './ProfileSection'
import { FormField } from './FormField'
import { ExtendedProfileData } from '@/types/profile'

interface ProfileIdentitySectionProps {
  profileData: Partial<ExtendedProfileData>
  onChange: (field: keyof ExtendedProfileData, value: ExtendedProfileData[keyof ExtendedProfileData]) => void
  errors: Record<string, string>
}

export const ProfileIdentitySection: React.FC<ProfileIdentitySectionProps> = ({
  profileData,
  onChange,
  errors
}) => {
  return (
    <ProfileSection
      title="Identité Visuelle"
      description="Contrôlez l'affichage principal de votre profil sur le site"
      icon={<User className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nom d'affichage (Header) - DIFFÉRENT du nom complet */}
        <FormField
          label="Nom d'affichage public (Header)"
          value={profileData.display_name || ''}
          onChange={(value) => onChange('display_name', value)}
          placeholder="Ex: Ibrahim FORGO - Expert IT"
          icon={<User className="w-4 h-4" />}
          helper="Nom court affiché dans le header du site (peut être différent du nom complet)"
          error={errors['display_name']}
          required
        />

        {/* Titre accrocheur (Hero) - DIFFÉRENT du titre professionnel */}
        <FormField
          label="Titre accrocheur (Hero)"
          value={profileData.hero_title || ''}
          onChange={(value) => onChange('hero_title', value)}
          placeholder="Ex: Architecte des Systèmes Modernes"
          icon={<Briefcase className="w-4 h-4" />}
          helper="Titre percutant pour la section hero (différent du titre professionnel)"
          error={errors['hero_title']}
          required
        />

        {/* Sous-titre descriptif */}
        <FormField
          label="Sous-titre descriptif"
          value={profileData.hero_subtitle || ''}
          onChange={(value) => onChange('hero_subtitle', value)}
          placeholder="Ex: Innovation • Performance • Excellence"
          icon={<FileText className="w-4 h-4" />}
          helper="Sous-titre qui complète le titre accrocheur"
          error={errors['hero_subtitle']}
          required
        />
      </div>

      {/* Description complète - DIFFÉRENTE de la biographie de base */}
      <div className="mt-6">
        <FormField
          label="Biographie détaillée (À propos)"
          value={profileData.bio || ''}
          onChange={(value) => onChange('bio', value)}
          placeholder="Décrivez votre parcours, vos compétences et vos ambitions de manière détaillée..."
          type="textarea"
          helper="Biographie complète utilisée dans la section À propos du site (différente de la biographie de base)"
          error={errors['bio']}
          required
        />
      </div>
    </ProfileSection>
  )
}
