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
import { BarChart3, Users, Layers, Activity, Settings, Zap, Sparkles, TrendingUp, Shield } from 'lucide-react'

const adminPages = [
  {
    id: 'analytics',
    title: 'Dashboard Analytics',
    description: 'Analytics avancés avec KPIs temps réel',
    icon: BarChart3,
    component: AdvancedAnalytics,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'cms',
    title: 'CMS Premium',
    description: 'Éditeur WYSIWYG avec médiathèque',
    icon: Layers,
    component: AdvancedEditor,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10'
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Gestion multi-rôles et permissions',
    icon: Users,
    component: UserManagement,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'workflows',
    title: 'Automation Workflows',
    description: 'Automatisations intelligentes',
    icon: Zap,
    component: WorkflowAutomation,
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10'
  },
  {
    id: 'reports',
    title: 'Reporting Engine',
    description: 'Rapports professionnels et exports',
    icon: Activity,
    component: ReportingEngine,
    gradient: 'from-red-500 to-rose-500',
    bgGradient: 'from-red-500/10 to-rose-500/10'
  },
  {
    id: 'api',
    title: 'API Management',
    description: 'Gestion endpoints et clés API',
    icon: Settings,
    component: ApiManagement,
    gradient: 'from-indigo-500 to-violet-500',
    bgGradient: 'from-indigo-500/10 to-violet-500/10'
  }
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <p className="text-slate-400 text-lg">Chargement...</p>
        </div>
      </div>
    )
  }

  const ActiveComponent = adminPages.find(page => page.id === activePage)?.component || AdvancedAnalytics

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-75" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Panel Admin Premium
                </h1>
              </div>
              <p className="text-slate-400 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Système de gestion niveau entreprise
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Sécurisé</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {adminPages.map((page) => {
            const Icon = page.icon
            return (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 transition-all duration-500 text-left overflow-hidden",
                  activePage === page.id
                    ? "border-primary/50 bg-gradient-to-br " + page.bgGradient
                    : "border-slate-700/50 hover:border-primary/30 hover:bg-slate-800/50"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                  page.gradient
                )} />
                <div className="relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300",
                    "bg-gradient-to-br " + page.gradient
                  )}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{page.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{page.description}</p>
                </div>
                {activePage === page.id && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
