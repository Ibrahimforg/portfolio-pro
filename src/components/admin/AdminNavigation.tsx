// Composant de navigation admin haut de gamme
// Design professionnel avec breadcrumbs et menu latéral

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  User, 
  Briefcase, 
  Settings, 
  BarChart3, 
  FileText, 
  Mail, 
  Image as ImageIcon, 
  ChevronRight,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Home
  },
  {
    label: 'Projets',
    href: '/admin/projects',
    icon: Briefcase
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: Settings
  },
  {
    label: 'Compétences',
    href: '/admin/skills',
    icon: User
  },
  {
    label: 'Expériences',
    href: '/admin/experiences',
    icon: Briefcase
  },
  {
    label: 'Multimedia',
    href: '/admin/multimedia',
    icon: ImageIcon
  },
  {
    label: 'Messages',
    href: '/admin/contacts',
    icon: Mail,
    badge: '2'
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    label: 'Profil',
    href: '/admin/profile',
    icon: User
  },
  {
    label: 'CV',
    href: '/admin/cv',
    icon: FileText
  }
]

interface AdminNavigationProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  title,
  subtitle,
  actions
}) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Générer les breadcrumbs
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { label: 'Dashboard', href: '/admin' }
    ]

    if (segments.length > 1) {
      const currentPath = segments.join('/')
      const currentItem = navigationItems.find(item => item.href === currentPath)
      
      if (currentItem) {
        breadcrumbs.push({
          label: currentItem.label,
          href: currentItem.href
        })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="bg-surface border-b border-gray-800 sticky top-0 z-50">
      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navigation mobile */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Breadcrumbs - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-text-secondary mx-2" />
                )}
                <Link
                  href={crumb.href}
                  className={`text-sm font-medium transition-colors ${
                    index === breadcrumbs.length - 1
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {actions && (
              <div className="hidden lg:block">
                {actions}
              </div>
            )}
            
            {/* Bouton retour desktop */}
            {pathname !== '/admin' && (
              <Link
                href="/admin"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-primary hover:bg-surface-elevated rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 bg-surface border-r border-gray-800">
            {/* Header sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-text-primary">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation items */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-text-secondary hover:text-primary hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Header avec titre et sous-titre */}
      {(title || subtitle) && (
        <div className="border-t border-gray-800 bg-surface-elevated">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {title && (
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            )}
            {subtitle && (
              <p className="text-text-secondary mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
