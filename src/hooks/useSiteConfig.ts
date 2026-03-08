// Hook global pour la configuration du site
// Combine les données du profil avec la configuration statique

'use client'

import { useProfileDataSimple } from './useProfileDataSimple'
import { siteConfig } from '@/config/site'

export function useSiteConfig() {
  const { profileData, loading, error } = useProfileDataSimple()

  // Combiner les données du profil avec la config statique
  const mergedConfig = {
    ...siteConfig,
    // Priorité aux données du profil si disponibles
    name: profileData?.display_name || profileData?.full_name || siteConfig.name,
    title: profileData?.hero_title || profileData?.title || siteConfig.title,
    description: profileData?.bio || siteConfig.description,
    email: profileData?.email || siteConfig.email,
    // phone et location ne sont pas encore dans ProfileData - à ajouter plus tard
    phone: siteConfig.phone,
    location: siteConfig.location,
    // Conserver les autres données statiques
    url: siteConfig.url,
    author: siteConfig.author,
    social: siteConfig.social,
    positioning: siteConfig.positioning,
    keyExperiences: siteConfig.keyExperiences,
    specializations: siteConfig.specializations,
    keywords: siteConfig.keywords,
    ogImage: siteConfig.ogImage,
    ogType: siteConfig.ogType,
  }

  return {
    siteConfig: mergedConfig,
    loading,
    error,
    profileData
  }
}
