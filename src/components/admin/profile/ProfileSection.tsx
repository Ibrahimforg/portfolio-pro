// Composant de section réutilisable pour l'admin profil
// Design moderne et professionnel avec accordéon

'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { SectionProps } from '@/types/profile'

export const ProfileSection: React.FC<SectionProps> = ({ 
  title, 
  description, 
  icon, 
  children, 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="card overflow-hidden">
      {/* Header de section */}
      <div
        className="flex items-center justify-between p-6 bg-surface-elevated cursor-pointer hover:bg-surface-hover transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-text-secondary transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-5 h-5 text-text-secondary transition-transform duration-200" />
          )}
        </div>
      </div>

      {/* Contenu de section */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
