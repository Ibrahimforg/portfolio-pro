'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import AdvancedAnalytics from '@/components/admin/premium/AdvancedAnalytics'
import AdvancedEditor from '@/components/admin/premium/AdvancedEditor'
import UserManagement from '@/components/admin/premium/UserManagement'
import WorkflowAutomation from '@/components/admin/premium/WorkflowAutomation'
import ReportingEngine from '@/components/admin/premium/ReportingEngine'
import ApiManagement from '@/components/admin/premium/ApiManagement'
import { BarChart3, Users, Layers, Activity, Settings, Zap } from 'lucide-react'

const adminPages = [
  {
    id: 'analytics',
    title: 'Dashboard Analytics',
    description: 'Analytics avancés avec KPIs temps réel',
    icon: BarChart3,
    component: AdvancedAnalytics,
    color: 'bg-blue-500'
  },
  {
    id: 'cms',
    title: 'CMS Premium',
    description: 'Éditeur WYSIWYG avec médiathèque',
    icon: Layers,
    component: AdvancedEditor,
    color: 'bg-green-500'
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Gestion multi-rôles et permissions',
    icon: Users,
    component: UserManagement,
    color: 'bg-purple-500'
  },
  {
    id: 'workflows',
    title: 'Automation Workflows',
    description: 'Automatisations intelligentes',
    icon: Zap,
    component: WorkflowAutomation,
    color: 'bg-orange-500'
  },
  {
    id: 'reports',
    title: 'Reporting Engine',
    description: 'Rapports professionnels et exports',
    icon: Activity,
    component: ReportingEngine,
    color: 'bg-red-500'
  },
  {
    id: 'api',
    title: 'API Management',
    description: 'Gestion endpoints et clés API',
    icon: Settings,
    component: ApiManagement,
    color: 'bg-indigo-500'
  }
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activePage, setActivePage] = useState('analytics')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin')
        return
      }
      setUser(session.user)
    }

    checkUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  const ActiveComponent = adminPages.find(page => page.id === activePage)?.component || AdvancedAnalytics

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Panel Admin Premium</h1>
              <p className="text-text-secondary">Système de gestion niveau entreprise</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {adminPages.map((page) => {
              const Icon = page.icon
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-300 text-left",
                    activePage === page.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-surface"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                    page.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{page.title}</h3>
                  <p className="text-xs text-text-secondary line-clamp-2">{page.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  )
}
