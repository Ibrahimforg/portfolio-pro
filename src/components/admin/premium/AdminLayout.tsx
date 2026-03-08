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
  Sparkles
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
    icon: LayoutDashboard
  },
  {
    id: 'profile',
    label: 'Profil',
    href: '/admin/profile',
    icon: User
  },
  {
    id: 'skills',
    label: 'Compétences',
    href: '/admin/skills',
    icon: Code
  },
  {
    id: 'projects',
    label: 'Projets',
    href: '/admin/projects',
    icon: Briefcase
  },
  {
    id: 'services',
    label: 'Services',
    href: '/admin/services',
    icon: Settings
  },
  {
    id: 'experiences',
    label: 'Expériences',
    href: '/admin/experiences',
    icon: Calendar
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    id: 'multimedia',
    label: 'Multimedia',
    href: '/admin/multimedia',
    icon: Image
  },
  {
    id: 'cv',
    label: 'CV',
    href: '/admin/cv',
    icon: FileText
  },
  {
    id: 'contacts',
    label: 'Messages',
    href: '/admin/contacts',
    icon: Mail,
    badge: 3
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
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-surface-elevated border-r border-gray-800 transition-all duration-300 transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Admin Panel</h1>
              <p className="text-xs text-text-muted">Premium Suite</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-text-secondary hover:text-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                "hover:bg-surface-hover",
                isActive(item.href) && "bg-primary/10 text-primary border-r-2 border-primary",
                !isActive(item.href) && "text-text-secondary hover:text-text-primary",
                "font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive(item.href) && "text-primary",
                  !isActive(item.href) && "text-text-muted"
                )} />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-text-muted">Premium Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-surface-elevated rounded-lg px-3 py-2 w-64 lg:w-96 border border-gray-700">
                <Search className="w-4 h-4 text-text-muted mr-3" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                />
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
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated rounded-lg shadow-xl border border-gray-800 py-2">
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-800" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left"
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

        {/* Page Content - STRUCTURE UNIFIÉE */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
