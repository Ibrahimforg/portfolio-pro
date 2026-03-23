// Hook simple pour récupérer les données du profil depuis la base de données
// Version minimaliste et robuste

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface SkillsConfig {
  [category: string]: {
    title: string
    skills: string[]
    icon: string
    level: 'expert' | 'advanced' | 'intermediate'
  }
}

interface ProfileData {
  id?: string
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  email?: string
  display_name?: string
  hero_title?: string
  hero_subtitle?: string
  skills_config?: SkillsConfig
}

export function useProfileDataSimple() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfileData()
  }, []) // Ajouter un rechargement toutes les 30 secondes pour le debug

  // Ajout d'un rechargement manuel
  const refetch = useCallback(() => {
    console.log('🔄 Rechargement manuel du profil')
    fetchProfileData()
  }, [])

  // Exposer la fonction de rechargement
  useEffect(() => {
    ;(window as Window & { refetchProfile?: () => void }).refetchProfile = refetch
    return () => {
      delete (window as Window & { refetchProfile?: () => void }).refetchProfile
    }
  }, [refetch])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Test brut sans filtre pour diagnostic
      console.log("🔍 Test brut - Variables d'environnement:")
      console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Présente" : "Manquante")
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')

      console.log("DATA BRUT:", data)
      console.log("ERROR BRUT:", error)
      
      if (error) {
        console.error('❌ Erreur même sans filtre:', error)
        setError('Erreur fondamentale Supabase')
        return
      }
      
      if (!data || data.length === 0) {
        console.log('ℹ️ Table vide - Création profil...')
        // Créer profil par défaut
        const defaultProfile = {
          full_name: 'Ibrahim FORGO',
          title: 'Ingénieur Réseaux & Système',
          bio: 'Ingénieur spécialisé en réseaux, télécommunications et développement full-stack.',
          profile_image_url: '/images/profile.jpg',
          email: 'ibrahimforgo59@gmail.com',
          display_name: 'Ibrahim FORGO',
          hero_title: 'Ingénieur Réseaux & Système',
          hero_subtitle: 'Conception, Automatisation, Infrastructure'
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single()

        if (insertError) {
          console.error('❌ Erreur création profil:', insertError)
          setError('Erreur lors de la création du profil')
          return
        }

        console.log('✅ Profil par défaut créé')
        setProfileData(defaultProfile)
      } else {
        console.log('✅ Données trouvées:', data.length, 'enregistrements')
        
        // Utiliser le premier profil disponible au lieu de chercher par email
        if (data && data.length > 0) {
          const profile = data[0] as ProfileData
          
          // Forcer la mise à jour de l'URL de l'image si elle est null ou incorrecte
          if (!profile.profile_image_url || profile.profile_image_url === '') {
            console.log('🔄 Mise à jour URL image de profil...')
            if (profile.id) {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_image_url: '/images/profile.jpg' })
                .eq('id', profile.id)
                
              if (!updateError) {
                profile.profile_image_url = '/images/profile.jpg'
                console.log('✅ URL image mise à jour')
              }
            } else {
              // Fallback si pas d'ID
              profile.profile_image_url = '/images/profile.jpg'
              console.log('✅ URL image définie en fallback')
            }
          }
          
          console.log('✅ Utilisation du profil:', profile)
          setProfileData(profile)
        } else {
          console.log('❌ Aucun profil trouvé dans la table')
          setError('Aucun profil disponible')
          return
        }
      }

    } catch (err) {
      console.error('Erreur fetch profil:', err)
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  return {
    profileData,
    loading,
    error,
    refetch
  }
}
