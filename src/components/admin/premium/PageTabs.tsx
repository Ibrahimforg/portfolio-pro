'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
  badge?: number
}

interface PageTabsProps {
  tabs: TabItem[]
  defaultTab?: string
  className?: string
}

export function PageTabs({ tabs, defaultTab, className }: PageTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={cn("bg-surface border-b border-gray-800 mb-3", className)}>
      {/* Sticky Tabs Container */}
      <div className="sticky top-0 z-30 bg-surface">
        <div className="px-6">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap",
                  "hover:text-text-primary",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary"
                )}
              >
                {tab.icon && (
                  <span className="w-4 h-4">{tab.icon}</span>
                )}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-4">
        {activeTabData?.content}
      </div>
    </div>
  )
}
