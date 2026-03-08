'use client'

import { useState } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Calendar,
  User,
  Check,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

interface RowData {
  [key: string]: any
}

interface PremiumTableProps {
  columns: Column[]
  data: RowData[]
  loading?: boolean
  searchable?: boolean
  filterable?: boolean
  selectable?: boolean
  actions?: {
    view?: (row: RowData) => void
    edit?: (row: RowData) => void
    delete?: (row: RowData) => void
    duplicate?: (row: RowData) => void
    share?: (row: RowData) => void
    download?: (row: RowData) => void
  }
  className?: string
  emptyState?: {
    title: string
    description: string
    icon?: React.ComponentType<{ className?: string }>
  }
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export default function PremiumTable({
  columns,
  data,
  loading = false,
  searchable = true,
  filterable = true,
  selectable = false,
  actions,
  className,
  emptyState,
  pagination
}: PremiumTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [rowMenuOpen, setRowMenuOpen] = useState<string | number | null>(null)

  const handleSort = (key: string) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      })
    } else {
      setSortConfig({ key, direction: 'asc' })
    }
  }

  const toggleRowSelection = (id: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleAllSelection = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map(row => row.id)))
    }
  }

  const getSortedData = () => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const getFilteredData = () => {
    let filteredData = getSortedData()

    if (searchQuery) {
      filteredData = filteredData.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    return filteredData
  }

  const filteredData = getFilteredData()

  const renderCell = (column: Column, row: RowData) => {
    const value = row[column.key]
    
    if (column.render) {
      return column.render(value, row)
    }

    // Default rendering based on type
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center justify-center">
          {value ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <X className="w-4 h-4 text-red-400" />
          )}
        </div>
      )
    }

    if (typeof value === 'string' && value.includes('http')) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline"
        >
          {value}
        </a>
      )
    }

    return <span className="text-text-primary">{String(value)}</span>
  }

  const renderEmptyState = () => {
    if (emptyState) {
      return (
        <div className="text-center py-12">
          {emptyState.icon && (
            <emptyState.icon className="w-12 h-12 text-text-muted mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {emptyState.title}
          </h3>
          <p className="text-sm text-text-muted">
            {emptyState.description}
          </p>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Search className="w-6 h-6 text-text-muted" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No data found
        </h3>
        <p className="text-sm text-text-muted">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectable && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={toggleAllSelection}
                className="w-4 h-4 text-primary border-gray-700 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-sm text-text-muted">
                {selectedRows.size > 0 && `${selectedRows.size} selected`}
              </span>
            </div>
          )}
          
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
          
          {filterable && (
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={cn(
                "px-4 py-2 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2",
                filterOpen && "bg-primary/10 border-primary text-primary"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {filterOpen && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date Range</label>
              <select className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <select className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
              <select className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>All Categories</option>
                <option>Web</option>
                <option>Mobile</option>
                <option>Desktop</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {selectable && (
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === data.length && data.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 text-primary border-gray-700 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-medium text-text-primary border-b border-gray-800",
                      column.sortable && "cursor-pointer hover:bg-surface-hover"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "w-3 h-3",
                              sortConfig?.key === column.key && sortConfig.direction === 'desc' && "text-primary"
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 -mt-1",
                              sortConfig?.key === column.key && sortConfig.direction === 'asc' && "text-primary"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="w-12 px-4 py-3 text-right text-sm font-medium text-text-primary border-b border-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    {selectable && (
                      <td className="w-12 px-4 py-3">
                        <div className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                    <td className="w-12 px-4 py-3">
                      <div className="h-4 bg-gray-700 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + 1} className="px-4 py-8">
                    {renderEmptyState()}
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-gray-800 hover:bg-surface-hover transition-colors",
                      selectedRows.has(row.id) && "bg-primary/5"
                    )}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.id)}
                          onChange={() => toggleRowSelection(row.id)}
                          className="w-4 h-4 text-primary border-gray-700 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        {renderCell(column, row)}
                      </td>
                    ))}
                    <td className="w-12 px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <div className="relative">
                          <button
                            onClick={() => setRowMenuOpen(row.id)}
                            className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {rowMenuOpen === row.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-surface-elevated rounded-lg shadow-xl border border-gray-800 py-2 z-50">
                              {actions?.view && (
                                <button
                                  onClick={() => {
                                    actions.view(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              )}
                              {actions?.edit && (
                                <button
                                  onClick={() => {
                                    actions.edit(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                              )}
                              {actions?.duplicate && (
                                <button
                                  onClick={() => {
                                    actions.duplicate(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate
                                </button>
                              )}
                              {actions?.share && (
                                <button
                                  onClick={() => {
                                    actions.share(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                                >
                                  <Share2 className="w-4 h-4" />
                                  Share
                                </button>
                              )}
                              {actions?.download && (
                                <button
                                  onClick={() => {
                                    actions.download(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                              )}
                              <hr className="border-gray-800" />
                              {actions?.delete && (
                                <button
                                  onClick={() => {
                                    actions.delete(row)
                                    setRowMenuOpen(null)
                                  }}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
          <div className="text-sm text-text-muted">
            Showing {filteredData.length} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-surface border border-gray-700 rounded-lg text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
