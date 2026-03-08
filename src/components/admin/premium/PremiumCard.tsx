'use client'

import { useState } from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Share2, 
  Download,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PremiumCardProps {
  title: string
  description?: string
  image?: string
  category?: string
  status?: 'published' | 'draft' | 'archived'
  date?: string
  author?: string
  tags?: string[]
  stats?: {
    views?: number
    likes?: number
    shares?: number
  }
  actions?: {
    edit?: string
    view?: string
    delete?: () => void
    duplicate?: () => void
    share?: () => void
  }
  className?: string
  featured?: boolean
  trending?: boolean
}

export default function PremiumCard({
  title,
  description,
  image,
  category,
  status = 'published',
  date,
  author,
  tags = [],
  stats,
  actions,
  className,
  featured = false,
  trending = false
}: PremiumCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const getStatusColor = () => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'archived':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'published': return 'Published'
      case 'draft': return 'Draft'
      case 'archived': return 'Archived'
      default: return 'Unknown'
    }
  }

  return (
    <div className={cn(
      "card group hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
      featured && "ring-2 ring-primary/50 border-primary/20",
      className
    )}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-medium rounded-full shadow-lg">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Trending Badge */}
      {trending && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-full shadow-lg animate-pulse">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        </div>
      )}

      {/* Image Section */}
      {image && (
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Overlay Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
              >
                <Star className={cn("w-4 h-4", isLiked && "fill-yellow-400")} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors"
              >
                <Clock className={cn("w-4 h-4", isBookmarked && "fill-blue-400")} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <span className="px-2 py-1 bg-surface text-xs font-medium text-text-primary rounded">
                  {category}
                </span>
              )}
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full border",
                getStatusColor()
              )}>
                {getStatusText()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-text-muted line-clamp-3 mb-4">
                {description}
              </p>
            )}
          </div>
          
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-elevated rounded-lg shadow-xl border border-gray-800 py-2 z-50">
                {actions?.view && (
                  <Link
                    href={actions.view}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                )}
                {actions?.edit && (
                  <Link
                    href={actions.edit}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                )}
                {actions?.duplicate && (
                  <button
                    onClick={actions.duplicate}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                )}
                {actions?.share && (
                  <button
                    onClick={actions.share}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors w-full text-left"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
                {actions?.delete && (
                  <button
                    onClick={actions.delete}
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

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
          <div className="flex items-center gap-4">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
            )}
            {author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            )}
          </div>
          
          {stats && (
            <div className="flex items-center gap-4">
              {stats.views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{stats.views.toLocaleString()}</span>
                </div>
              )}
              {stats.likes && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{stats.likes.toLocaleString()}</span>
                </div>
              )}
              {stats.shares && (
                <div className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  <span>{stats.shares.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-surface text-xs font-medium text-text-primary rounded-full border border-gray-700 hover:border-primary transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none" />
    </div>
  )
}
