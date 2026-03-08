'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Hook pour récupérer l'URL du CV depuis Supabase
export function useCV() {
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('documents')
          .list('cv', {
            limit: 1,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) throw error

        if (data && data.length > 0) {
          const file = data[0]
          const { data: { publicUrl } } = supabase
            .storage
            .from('documents')
            .getPublicUrl(`cv/${file.name}`)

          setCvUrl(publicUrl)
        }
      } catch (err) {
        console.error('Erreur lors du chargement du CV:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [])

  return { cvUrl, loading }
}
