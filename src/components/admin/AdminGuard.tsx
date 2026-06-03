'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const verifyAdmin = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Supabase auth session error:', sessionError)
        }

        if (!session) {
          if (pathname !== '/admin') {
            router.replace('/admin')
            return
          }

          if (mounted) {
            setChecking(false)
          }
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single()

        if (profileError || !profile?.is_admin) {
          console.warn('Unauthorized admin access attempt:', profileError)
          router.replace('/')
          return
        }

        if (pathname === '/admin') {
          router.replace('/admin/dashboard')
          return
        }

        if (mounted) {
          setChecking(false)
        }
      } catch (error) {
        console.error('Admin guard verification failed:', error)
        router.replace('/admin')
      }
    }

    verifyAdmin()

    return () => {
      mounted = false
    }
  }, [pathname, router])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Vérification d'accès administrateur...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
