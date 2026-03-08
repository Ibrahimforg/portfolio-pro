'use client'

import { Search, Filter } from 'lucide-react'

interface AdminFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    type: 'select' | 'input'
    placeholder?: string
    value: string
    onChange: (value: string) => void
    options?: Array<{ value: string; label: string }>
  }>
  resultsCount?: number
  resultsLabel?: string
}

export default function AdminFilters({
  searchTerm,
  onSearchChange,
  filters = [],
  resultsCount,
  resultsLabel = 'résultats'
}: AdminFiltersProps) {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 pl-10 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary placeholder-text-secondary"
          />
        </div>

        {/* Dynamic Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            {filter.type === 'select' ? (
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 pl-10 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none text-text-primary"
              >
                <option value="">{filter.placeholder || 'Tous'}</option>
                {filter.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 pl-10 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary placeholder-text-secondary"
              />
            )}
          </div>
        ))}

        {/* Results Count */}
        {resultsCount !== undefined && (
          <div className="flex items-center justify-center">
            <span className="text-text-secondary">
              {resultsCount} {resultsLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
