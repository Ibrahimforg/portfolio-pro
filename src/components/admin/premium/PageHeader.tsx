'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  breadcrumbs?: Array<{ label: string; href: string }>
}

export function PageHeader({ title, subtitle, description, icon, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-surface border-b border-gray-800 mb-3">
      <div className="px-6 py-2">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <a href={crumb.href} className="hover:text-text-primary transition-colors">
                  {crumb.label}
                </a>
              </div>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-text-primary">{title}</h1>
              {subtitle && (
                <p className="text-text-muted mt-1">{subtitle}</p>
              )}
              {description && (
                <p className="text-text-muted mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
