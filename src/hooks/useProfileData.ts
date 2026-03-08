// Hook pour récupérer et gérer les données du profil depuis la base de données
// Remplace les données statiques par des données dynamiques

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ExtendedProfileData } from '@/types/profile'

export function useProfileData() {
  const [profileData, setProfileData] = useState<ExtendedProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'ibrahimforgo59@gmail.com')
        .single()

      if (error) {
        console.error('Erreur fetch profil:', error)
        setError('Erreur lors du chargement du profil')
        return
      }

      if (data) {
        setProfileData(data as ExtendedProfileData)
      }
    } catch (err) {
      console.error('Erreur fetch profil:', err)
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const updateProfileData = async (updates: Partial<ExtendedProfileData>) => {
    try {
      setError(null)

      const { error } = await supabase
        .from('profiles')
        .upsert({
          ...updates,
          email: 'ibrahimforgo59@gmail.com',
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Erreur update profil:', error)
        setError('Erreur lors de la mise à jour')
        return
      }

      // Mettre à jour les données locales
      if (profileData) {
        setProfileData({ ...profileData, ...updates })
      }
    } catch (err) {
      console.error('Erreur update profil:', err)
      setError('Erreur lors de la mise à jour')
    }
  }

  return {
    profileData,
    loading,
    error,
    updateProfileData,
    refetch: fetchProfileData
  }
}
