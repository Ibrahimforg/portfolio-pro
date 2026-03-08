'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { AccessibleButton } from './ui/AccessibleButton'
import { useFocusManagement } from '@/hooks/useFocusManagement'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function AccessibleModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children 
}: AccessibleModalProps) {
  const modalRef = useFocusManagement(isOpen)
  const titleId = `modal-title-${React.useId()}`
  const descriptionId = `modal-description-${React.useId()}`

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.setAttribute('aria-hidden', 'true')
      
      // Annonce pour screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = `Modal ouvert: ${title}`
      document.body.appendChild(announcement)
      
      cleanup = () => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
        document.body.style.overflow = ''
        document.body.removeAttribute('aria-hidden')
      }
    }

    return cleanup
  }, [isOpen, title])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg mx-4 bg-background border rounded-lg shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <AccessibleButton
            variant="outline"
            size="sm"
            onClick={onClose}
            aria-label="Fermer la modal"
          >
            <X className="h-4 w-4" />
          </AccessibleButton>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
