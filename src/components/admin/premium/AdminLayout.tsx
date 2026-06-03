'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  User, 
  Code, 
  Briefcase, 
  Settings, 
  Calendar, 
  BarChart3, 
  Image, 
  FileText, 
  Mail, 
  Menu, 
  X, 
  Search, 
  Bell, 
  LogOut,
  ChevronDown,
  Shield,
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Layers,
  Command
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import PremiumNotifications from './PremiumNotifications'

interface NavigationItem {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavigationItem[]
  category?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    category: 'Main'
  },
  {
    id: 'profile',
    label: 'Profil',
    href: '/admin/profile',
    icon: User,
    category: 'Content'
  },
  {
    id: 'skills',
    label: 'Compétences',
    href: '/admin/skills',
    icon: Code,
    category: 'Content'
  },
  {
    id: 'projects',
    label: 'Projets',
    href: '/admin/projects',
    icon: Briefcase,
    category: 'Content'
  },
  {
    id: 'services',
    label: 'Services',
    href: '/admin/services',
    icon: Settings,
    category: 'Content'
  },
  {
    id: 'experiences',
    label: 'Expériences',
    href: '/admin/experiences',
    icon: Calendar,
    category: 'Content'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    category: 'Analytics'
  },
  {
    id: 'multimedia',
    label: 'Multimedia',
    href: '/admin/multimedia',
    icon: Image,
    category: 'Media'
  },
  {
    id: 'cv',
    label: 'CV',
    href: '/admin/cv',
    icon: FileText,
    category: 'Media'
  },
  {
    id: 'contacts',
    label: 'Messages',
    href: '/admin/contacts',
    icon: Mail,
    badge: 3,
    category: 'Communication'
  }
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    checkUser()
  }, [])

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 transition-all duration-500 transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/50 bg-gradient-to-r from-slate-900/50 to-transparent">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                Premium Suite
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
          {['Main', 'Content', 'Analytics', 'Media', 'Communication'].map((category) => {
            const categoryItems = navigationItems.filter(item => item.category === category)
            if (categoryItems.length === 0) return null

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">
                  {category}
                </h3>
                {categoryItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href || '#'}
                    className={cn(
                      "group flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 relative overflow-hidden",
                      "hover:bg-slate-800/50",
                      isActive(item.href || '#') && "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30",
                      !isActive(item.href || '#') && "text-slate-400 hover:text-white",
                      "font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        isActive(item.href || '#') && "bg-primary/20",
                        !isActive(item.href || '#') && "bg-slate-800/50 group-hover:bg-slate-700/50"
                      )}>
                        <item.icon className={cn(
                          "w-4 h-4 transition-colors",
                          isActive(item.href || '#') && "text-primary",
                          !isActive(item.href || '#') && "text-slate-400 group-hover:text-white"
                        )} />
                      </div>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-primary to-secondary text-white rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {isActive(item.href || '#') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800/50 bg-gradient-to-t from-slate-900/50 to-transparent">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                Premium Account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="flex items-center justify-between h-20 px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-slate-800/50 rounded-2xl px-4 py-3 w-64 lg:w-96 border border-slate-700/50 hover:border-primary/30 transition-all duration-300 group">
                <Search className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors mr-3" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
                />
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-medium text-slate-400 bg-slate-700/50 rounded-lg border border-slate-600/50">
                  <Command className="w-3 h-3 mr-1" />
                  K
                </kbd>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Premium Notifications */}
              <PremiumNotifications />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-sm font-semibold text-white">
                        {user?.email || 'Admin User'}
                      </p>
                      <p className="text-xs text-slate-400">Premium Account</p>
                    </div>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-slate-700/50" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pt-20">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
