'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Hook pour récupérer l'URL de l'image de profil depuis Supabase Storage
export function useProfileImage() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        console.log('🔍 Recherche image profil dans bucket profiles...')
        
        const { data, error } = await supabase
          .storage
          .from('profiles')
          .list('', {
            limit: 1,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) {
          console.error('❌ Erreur recherche image profil:', error)
          console.log('🔄 Fallback vers image statique')
          setProfileImageUrl('/images/profile.jpg')
          return
        }

        console.log('📁 Images profil trouvées:', data)

        if (data && data.length > 0) {
          const file = data[0]
          const fileName = file?.name || ''
          console.log('📸 Fichier image profil:', fileName)
          
          const { data: { publicUrl } } = await supabase
            .storage
            .from('profiles')
            .getPublicUrl(fileName)

          console.log('🔗 URL image profil:', publicUrl)
          setProfileImageUrl(publicUrl)
        } else {
          console.log('📷 Aucune image trouvée, fallback vers statique')
          setProfileImageUrl('/images/profile.jpg')
        }
      } catch (err) {
        console.error('❌ Erreur lors du chargement de l\'image profil:', err)
        console.log('🔄 Fallback vers image statique')
        setProfileImageUrl('/images/profile.jpg')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileImage()
  }, [])

  return { profileImageUrl, loading }
}
