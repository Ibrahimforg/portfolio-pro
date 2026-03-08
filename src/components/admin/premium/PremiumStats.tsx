'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  Target,
  Activity,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Calendar
} from 'lucide-react'
import { usePremiumTheme } from './PremiumTheme'

interface StatCard {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
  description?: string
  prefix?: string
  suffix?: string
}

interface MiniChart {
  data: number[]
  color: string
  height?: number
}

const StatCardComponent = ({ 
  stat 
}: { 
  stat: StatCard
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getTrendIcon = () => {
    if (stat.trend === 'up') return <ArrowUp className="w-4 h-4" />
    if (stat.trend === 'down') return <ArrowDown className="w-4 h-4" />
    return <div className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (stat.trend === 'up') return 'text-green-400'
    if (stat.trend === 'down') return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div 
      className="card p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        stat.color === 'text-blue-400' && 'from-blue-500/5 to-blue-600/5',
        stat.color === 'text-green-400' && 'from-green-500/5 to-green-600/5',
        stat.color === 'text-purple-400' && 'from-purple-500/5 to-purple-600/5',
        stat.color === 'text-yellow-400' && 'from-yellow-500/5 to-yellow-600/5',
        stat.color === 'text-red-400' && 'from-red-500/5 to-red-600/5'
      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-text-muted mb-1">{stat.title}</p>
            <div className="flex items-baseline gap-2">
              {stat.prefix && <span className="text-lg text-text-muted">{stat.prefix}</span>}
              <h3 className="text-3xl font-bold text-text-primary">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              {stat.suffix && <span className="text-lg text-text-muted">{stat.suffix}</span>}
            </div>
            {stat.description && (
              <p className="text-xs text-text-muted mt-1">{stat.description}</p>
            )}
          </div>
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
            stat.color === 'text-blue-400' && 'from-blue-500/20 to-blue-600/20',
            stat.color === 'text-green-400' && 'from-green-500/20 to-green-600/20',
            stat.color === 'text-purple-400' && 'from-purple-500/20 to-purple-600/20',
            stat.color === 'text-yellow-400' && 'from-yellow-500/20 to-yellow-600/20',
            stat.color === 'text-red-400' && 'from-red-500/20 to-red-600/20'
          } group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              stat.trend === 'up' ? 'bg-green-500/10 text-green-400' :
              stat.trend === 'down' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-500/10 text-gray-400'
            }`}>
              {getTrendIcon()}
              <span className="text-xs font-medium">
                {Math.abs(stat.change)}%
              </span>
            </div>
            <span className="text-xs text-text-muted">vs last period</span>
          </div>
        </div>

      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none`} />
    </div>
  )
}

export default function PremiumStats() {
  const { colors } = usePremiumTheme()
  const [stats, setStats] = useState<StatCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateStats = () => {
      setStats([
        {
          title: 'Total Revenue',
          value: 124563,
          change: 23.4,
          trend: 'up',
          icon: TrendingUp,
          color: 'text-green-400',
          description: 'Last 30 days',
          prefix: '$',
        },
        {
          title: 'Active Users',
          value: 8942,
          change: 12.8,
          trend: 'up',
          icon: Users,
          color: 'text-blue-400',
          description: 'Currently online',
        },
        {
          title: 'Page Views',
          value: 45231,
          change: -5.2,
          trend: 'down',
          icon: Eye,
          color: 'text-purple-400',
          description: 'Last 7 days',
        },
        {
          title: 'Conversion Rate',
          value: 3.2,
          change: 8.7,
          trend: 'up',
          icon: Target,
          color: 'text-yellow-400',
          description: 'Average rate',
          suffix: '%',
        },
        {
          title: 'Avg Session',
          value: '4m 32s',
          change: 15.3,
          trend: 'up',
          icon: Clock,
          color: 'text-red-400',
          description: 'Time on site',
        },
        {
          title: 'Bounce Rate',
          value: 28.4,
          change: -3.1,
          trend: 'down',
          icon: MousePointer,
          color: 'text-blue-400',
          description: 'Exit rate',
          suffix: '%',
        }
      ])
      setLoading(false)
    }

    generateStats()
    const interval = setInterval(generateStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [colors])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-3 w-32"></div>
              <div className="h-8 bg-gray-700 rounded mb-3 w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary" />
            Performance Metrics
          </h2>
          <p className="text-text-muted">Real-time performance indicators</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
            <ArrowDown className="w-4 h-4" />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCardComponent 
            key={index} 
            stat={stat} 
          />
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { name: 'Direct', value: 42, color: colors.primary },
              { name: 'Search', value: 28, color: colors.success },
              { name: 'Social', value: 18, color: colors.info },
              { name: 'Referral', value: 12, color: colors.warning }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-text-primary">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{source.value}%</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${source.value}%`,
                        backgroundColor: source.color 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Device Breakdown</h3>
          <div className="space-y-4">
            {[
              { name: 'Desktop', value: 62, icon: Monitor },
              { name: 'Mobile', value: 33, icon: Smartphone },
              { name: 'Tablet', value: 5, icon: Monitor }
            ].map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <device.icon className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-primary">{device.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{device.value}%</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
