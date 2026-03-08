'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  Mail, 
  MessageSquare, 
  User, 
  Calendar,
  Star,
  Heart,
  Zap,
  TrendingUp,
  Download,
  Upload,
  Settings,
  Shield,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePremiumTheme } from './PremiumTheme'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'message' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    user?: string
    page?: string
    action?: string
  }
}

const notificationIcons = {
  success: Check,
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
  message: MessageSquare,
  system: Settings
}

const notificationColors = {
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  message: 'text-purple-400',
  system: 'text-gray-400'
}

export default function PremiumNotifications() {
  const { colors } = usePremiumTheme()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Project Published',
          message: 'Your project "E-commerce Platform" has been successfully published.',
          time: 'Il y a 2 min',
          read: false,
          icon: Check,
          action: {
            label: 'View Project',
            onClick: () => console.log('View project')
          },
          metadata: {
            page: '/projects/e-commerce'
          }
        },
        {
          id: '2',
          type: 'message',
          title: 'New Message',
          message: 'Marie L. sent you a message through the contact form.',
          time: 'Il y a 15 min',
          read: false,
          icon: MessageSquare,
          action: {
            label: 'Read Message',
            onClick: () => console.log('Read message')
          },
          metadata: {
            user: 'Marie L.',
            action: 'Contact form submission'
          }
        },
        {
          id: '3',
          type: 'system',
          title: 'Backup Completed',
          message: 'Your database backup has been completed successfully.',
          time: 'Il y a 1 heure',
          read: true,
          icon: Shield,
          metadata: {
            action: 'Automated backup'
          }
        },
        {
          id: '4',
          type: 'warning',
          title: 'Storage Alert',
          message: 'You are using 85% of your available storage space.',
          time: 'Il y a 2 heures',
          read: true,
          icon: AlertTriangle,
          action: {
            label: 'Manage Storage',
            onClick: () => console.log('Manage storage')
          }
        },
        {
          id: '5',
          type: 'info',
          title: 'Update Available',
          message: 'A new version of the admin panel is available.',
          time: 'Il y a 3 heures',
          read: true,
          icon: Info,
          action: {
            label: 'Update Now',
            onClick: () => console.log('Update now')
          }
        },
        {
          id: '6',
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile information has been updated successfully.',
          time: 'Il y a 4 heures',
          read: true,
          icon: Check
        },
        {
          id: '7',
          type: 'message',
          title: 'New Comment',
          message: 'Jean D. commented on your project.',
          time: 'Il y a 5 heures',
          read: true,
          icon: MessageSquare,
          metadata: {
            user: 'Jean D.',
            page: '/projects/portfolio'
          }
        },
        {
          id: '8',
          type: 'system',
          title: 'Security Scan',
          message: 'Weekly security scan completed - no threats detected.',
          time: 'Il y a 6 heures',
          read: true,
          icon: Shield
        }
      ]
      setNotifications(newNotifications)
    }

    generateNotifications()
    
    // Simulate new notification
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'success' as const,
          title: 'Task Completed',
          message: 'Your scheduled task has been completed.',
          time: 'À l\'instant',
          read: false,
          icon: Check
        },
        {
          id: Date.now().toString(),
          type: 'info' as const,
          title: 'System Update',
          message: 'System performance has been optimized.',
          time: 'À l\'instant',
          read: false,
          icon: Zap
        },
        {
          id: Date.now().toString(),
          type: 'message' as const,
          title: 'New Visitor',
          message: 'Someone is viewing your portfolio.',
          time: 'À l\'instant',
          read: false,
          icon: Eye
        }
      ]
      
      if (Math.random() > 0.7) {
        setNotifications(prev => [randomNotifications[Math.floor(Math.random() * randomNotifications.length)], ...prev.slice(0, 9)])
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const NotificationItem = ({ notification, showActions = true }: { notification: Notification; showActions?: boolean }) => {
    const Icon = notification.icon || notificationIcons[notification.type]
    const color = notificationColors[notification.type]

    return (
      <div 
        className={cn(
          "flex items-start gap-4 p-4 hover:bg-surface-hover rounded-lg transition-all duration-200 cursor-pointer",
          !notification.read && "bg-primary/5 border-l-4 border-primary"
        )}
        onClick={() => !notification.read && markAsRead(notification.id)}
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          notification.type === 'success' && "bg-green-500/20 text-green-400",
          notification.type === 'warning' && "bg-yellow-500/20 text-yellow-400",
          notification.type === 'error' && "bg-red-500/20 text-red-400",
          notification.type === 'info' && "bg-blue-500/20 text-blue-400",
          notification.type === 'message' && "bg-purple-500/20 text-purple-400",
          notification.type === 'system' && "bg-gray-500/20 text-gray-400"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "text-sm font-medium text-text-primary mb-1",
                !notification.read && "text-primary"
              )}>
                {notification.title}
              </h4>
              <p className="text-xs text-text-muted line-clamp-2">
                {notification.message}
              </p>
              {notification.metadata && (
                <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                  {notification.metadata.user && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {notification.metadata.user}
                    </span>
                  )}
                  {notification.metadata.page && (
                    <span>• {notification.metadata.page}</span>
                  )}
                  {notification.metadata.action && (
                    <span>• {notification.metadata.action}</span>
                  )}
                </div>
              )}
            </div>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-muted">{notification.time}</span>
            {showActions && (
              <div className="flex items-center gap-2">
                {notification.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      notification.action.onClick()
                    }}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                  className="text-xs p-1 text-text-muted hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-text-secondary hover:text-primary transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-surface-elevated rounded-lg shadow-xl border border-gray-800 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs px-2 py-1 bg-surface text-text-muted rounded hover:bg-surface-hover transition-colors"
              >
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-sm text-text-muted">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {(showAll ? notifications : notifications.slice(0, 5)).map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification}
                    showActions={showAll}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && !showAll && (
            <div className="border-t border-gray-800 p-4">
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View all {notifications.length} notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
