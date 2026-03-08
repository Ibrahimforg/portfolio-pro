'use client'

import { cn } from '@/lib/utils'

export function SkipLinks() {
  const skipLinks = [
    { href: '#main-content', label: 'Aller au contenu principal' },
    { href: '#navigation', label: 'Aller à la navigation' },
    { href: '#search', label: 'Aller à la recherche' },
  ]

  return (
    <div className="fixed top-0 left-0 z-50">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
            'bg-primary text-primary-foreground px-4 py-2 rounded-md',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'transition-all duration-200'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
