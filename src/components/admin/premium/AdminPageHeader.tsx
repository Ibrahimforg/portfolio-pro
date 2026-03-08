'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, User, ChevronDown, Menu } from 'lucide-react'
import PremiumNotifications from './PremiumNotifications'
import { cn } from '@/lib/utils'

interface AdminPageHeaderProps {
  title: string
  showSearch?: boolean
  showNotifications?: boolean
  breadcrumbs?: { label: string; href: string }[]
  actions?: React.ReactNode
}

export default function AdminPageHeader({ 
  title, 
  showSearch = false, 
  showNotifications = true,
  breadcrumbs = [],
  actions
}: AdminPageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-b border-gray-800">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary">
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="hidden md:flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span className="text-text-muted">/</span>}
                  <Link 
                    href={crumb.href}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          )}
          
          {/* Page Title */}
          <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          {showSearch && (
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
          )}

          {/* Notifications */}
          {showNotifications && <PremiumNotifications />}

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
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Profil
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-text-primary hover:bg-surface-hover"
                >
                  Paramètres
                </Link>
                <hr className="my-2 border-gray-800" />
                <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-hover">
                  Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Custom Actions */}
          {actions}
        </div>
      </div>
    </header>
  )
}
