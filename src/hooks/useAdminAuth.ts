'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface UseAdminAuthReturn {
  user: { email: string } | null
  loading: boolean
}

export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter()
  
  // Simulation temporaire - À remplacer avec vraie auth
  const user = useMemo(() => ({ email: 'admin@example.com' }), [])
  const loading = false

  useEffect(() => {
    if (!user) {
      router.push('/admin')
    }
  }, [user, router])

  return { user, loading }
}
