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
        console.log(' Recherche du CV dans bucket documents...')
        
        const { data, error } = await supabase
          .storage
          .from('documents')
          .list('cv', {
            limit: 1,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) {
          console.error(' Erreur recherche CV:', error)
          console.log(' Fallback vers CV statique')
          setCvUrl('/cv.pdf')
          return
        }

        console.log(' CV trouvés:', data)

        if (data && data.length > 0) {
          const file = data[0]
          const fileName = file?.name || ''
          console.log(' Fichier CV:', fileName)
          
          const { data: { publicUrl } } = await supabase
            .storage
            .from('documents')
            .getPublicUrl(`cv/${fileName}`)

          console.log(' URL CV:', publicUrl)
          setCvUrl(publicUrl)
        } else {
          console.log(' Aucun CV trouvé, fallback vers statique')
          setCvUrl('/cv.pdf')
        }
      } catch (err) {
        console.error(' Erreur lors du chargement du CV:', err)
        console.log(' Fallback vers CV statique')
        setCvUrl('/cv.pdf')
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [])

  return { cvUrl, loading }
}
