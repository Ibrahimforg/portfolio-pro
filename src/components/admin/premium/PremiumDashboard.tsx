'use client'

import { useState, useEffect } from 'react'
import { 
  Eye, 
  MousePointer,
  Calendar,
  BarChart3,
  Activity,
  Award,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import RealAnalytics from './RealAnalytics'
import PremiumStats from './PremiumStats'

interface ActivityItem {
  id: string
  type: 'view' | 'click' | 'form_submit' | 'project_created'
  title: string
  description: string
  time: string
  user?: string
}

const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-surface-hover rounded-lg transition-colors">
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center",
      activity.type === 'view' && "bg-blue-500/20 text-blue-400",
      activity.type === 'click' && "bg-green-500/20 text-green-400",
      activity.type === 'form_submit' && "bg-purple-500/20 text-purple-400",
      activity.type === 'project_created' && "bg-yellow-500/20 text-yellow-400"
    )}>
      {activity.type === 'view' && <Eye className="w-5 h-5" />}
      {activity.type === 'click' && <MousePointer className="w-5 h-5" />}
      {activity.type === 'form_submit' && <BarChart3 className="w-5 h-5" />}
      {activity.type === 'project_created' && <Award className="w-5 h-5" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-text-primary">{activity.title}</p>
      <p className="text-xs text-text-muted truncate">{activity.description}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-text-muted">{activity.time}</span>
        {activity.user && (
          <span className="text-xs text-primary">by {activity.user}</span>
        )}
      </div>
    </div>
  </div>
)

export default function PremiumDashboard() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setActivities([
        {
          id: '1',
          type: 'project_created',
          title: 'New Project Created',
          description: 'Portfolio Website Redesign',
          time: '2 minutes ago',
          user: 'Admin'
        },
        {
          id: '2',
          type: 'view',
          title: 'Profile View',
          description: 'Someone viewed your profile',
          time: '15 minutes ago'
        },
        {
          id: '3',
          type: 'form_submit',
          title: 'Contact Form',
          description: 'New message from potential client',
          time: '1 hour ago'
        },
        {
          id: '4',
          type: 'click',
          title: 'Project Link Click',
          description: 'E-commerce Platform clicked',
          time: '2 hours ago'
        }
      ])

      setLoading(false)
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2 w-24"></div>
                <div className="h-8 bg-gray-700 rounded mb-2 w-32"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            Premium Analytics Dashboard
          </h1>
          <p className="text-text-muted">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 7 Days
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Premium Stats Component */}
      <PremiumStats />

      {/* Real Analytics Component */}
      <RealAnalytics />

      {/* Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
              <button className="text-sm text-primary hover:text-primary/80">
                View All
              </button>
            </div>
            <div className="space-y-2">
              {activities.map((activity) => (
                <ActivityItemComponent key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats - Responsive */}
        <div className="xl:col-span-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <div className="card p-4">
              <h3 className="text-md font-semibold text-text-primary mb-3">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Page Load</span>
                  <span className="text-sm font-medium text-green-400">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Bounce Rate</span>
                  <span className="text-sm font-medium text-yellow-400">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Uptime</span>
                  <span className="text-sm font-medium text-green-400">99.9%</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-md font-semibold text-text-primary mb-3">Top Pages</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary truncate">/projects</span>
                  <span className="text-sm font-medium text-text-primary">3,421</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary truncate">/about</span>
                  <span className="text-sm font-medium text-text-primary">2,156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-primary truncate">/skills</span>
                  <span className="text-sm font-medium text-text-primary">1,843</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
