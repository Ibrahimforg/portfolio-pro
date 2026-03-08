'use client'

import { ReactNode } from 'react'

interface PageLayoutProps {
  header?: ReactNode
  tabs?: ReactNode
  children: ReactNode
}

export function PageLayout({ header, tabs, children }: PageLayoutProps) {
  return (
    <div className="flex-1 flex flex-col h-full">
      {header && (
        <div className="flex-shrink-0 mb-3">
          {header}
        </div>
      )}
      
      {tabs && (
        <div className="flex-shrink-0 mb-3">
          {tabs}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
