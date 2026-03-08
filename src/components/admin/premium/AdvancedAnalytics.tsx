'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  MousePointer,
  BarChart3,
  Activity,
  Zap,
  Target,
  Globe,
  Smartphone,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { cn } from '@/lib/utils'

interface AdvancedMetrics {
  traffic: {
    visitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: number
    uniqueVisitors: number
    returningVisitors: number
  }
  conversions: {
    contactForms: number
    projectViews: number
    downloadClicks: number
    conversionRate: number
    leadQuality: number
    engagementRate: number
  }
  performance: {
    pageSpeed: number
    uptime: number
    errorRate: number
    apiLatency: number
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
    }
  }
  business: {
    leadsGenerated: number
    clientAcquisition: number
    revenueImpact: number
    roi: number
    projectInquiries: number
    collaborationRequests: number
  }
  predictions: {
    nextMonthVisitors: number
    nextMonthConversions: number
    seasonalTrend: 'up' | 'down' | 'stable'
    confidence: number
  }
}

interface RealtimeData {
  activeUsers: number
  currentPageViews: number
  currentSessions: number
  recentActivity: Array<{
    type: 'page_view' | 'form_submit' | 'project_click' | 'download'
    page: string
    timestamp: string
    user: string
  }>
}

export default function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'traffic' | 'conversions' | 'performance' | 'business'>('traffic')

  useEffect(() => {
    // Simulation de données analytics
    const fetchMetrics = async () => {
      setLoading(true)
      
      // API call vers analytics service
      const mockMetrics: AdvancedMetrics = {
        traffic: {
          visitors: 15420,
          pageViews: 48730,
          bounceRate: 32.5,
          avgSessionDuration: 245,
          uniqueVisitors: 12850,
          returningVisitors: 2570
        },
        conversions: {
          contactForms: 127,
          projectViews: 3420,
          downloadClicks: 89,
          conversionRate: 3.2,
          leadQuality: 4.2,
          engagementRate: 68.5
        },
        performance: {
          pageSpeed: 1.8,
          uptime: 99.9,
          errorRate: 0.2,
          apiLatency: 145,
          coreWebVitals: {
            lcp: 1.2,
            fid: 45,
            cls: 0.08
          }
        },
        business: {
          leadsGenerated: 89,
          clientAcquisition: 12,
          revenueImpact: 45000,
          roi: 320,
          projectInquiries: 45,
          collaborationRequests: 8
        },
        predictions: {
          nextMonthVisitors: 16800,
          nextMonthConversions: 145,
          seasonalTrend: 'up',
          confidence: 87
        }
      }

      setMetrics(mockMetrics)
      setLoading(false)
    }

    fetchMetrics()

    // Mise à jour temps réel
    const realtimeInterval = setInterval(() => {
      setRealtimeData({
        activeUsers: Math.floor(Math.random() * 50) + 10,
        currentPageViews: Math.floor(Math.random() * 20) + 5,
        currentSessions: Math.floor(Math.random() * 30) + 8,
        recentActivity: [
          {
            type: 'page_view',
            page: '/projects/website-redesign',
            timestamp: new Date().toISOString(),
            user: 'user_1234'
          },
          {
            type: 'form_submit',
            page: '/contact',
            timestamp: new Date(Date.now() - 30000).toISOString(),
            user: 'user_5678'
          }
        ]
      })
    }, 5000)

    return () => clearInterval(realtimeInterval)
  }, [timeRange])

  const trafficData = [
    { name: 'Lun', visitors: 2400, pageViews: 7200, sessions: 1800 },
    { name: 'Mar', visitors: 2800, pageViews: 8400, sessions: 2100 },
    { name: 'Mer', visitors: 2200, pageViews: 6600, sessions: 1650 },
    { name: 'Jeu', visitors: 3100, pageViews: 9300, sessions: 2325 },
    { name: 'Ven', visitors: 2600, pageViews: 7800, sessions: 1950 },
    { name: 'Sam', visitors: 1800, pageViews: 5400, sessions: 1350 },
    { name: 'Dim', visitors: 1500, pageViews: 4500, sessions: 1125 }
  ]

  const conversionData = [
    { name: 'Contact', value: 127, color: '#3b82f6' },
    { name: 'Projets', value: 3420, color: '#10b981' },
    { name: 'Téléchargements', value: 89, color: '#f59e0b' },
    { name: 'Partages', value: 234, color: '#8b5cf6' }
  ]

  const performanceData = [
    { name: 'LCP', value: 92, fill: '#3b82f6' },
    { name: 'FID', value: 88, fill: '#10b981' },
    { name: 'CLS', value: 95, fill: '#f59e0b' },
    { name: 'Speed', value: 96, fill: '#8b5cf6' }
  ]

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend, 
    description 
  }: {
    title: string
    value: string | number
    change?: number
    icon: any
    trend?: 'up' | 'down'
    description?: string
  }) => (
    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              )}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
          {description && (
            <p className="text-text-tertiary text-xs mt-2">{description}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Analytics Avancé</h1>
          <p className="text-text-secondary mt-1">Vue complète des performances et KPIs</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-text-primary"
          >
            <option value="24h">24 heures</option>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
      </div>

      {/* Métriques temps réel */}
      {realtimeData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Utilisateurs actifs"
            value={realtimeData.activeUsers}
            icon={Users}
            description="En ligne maintenant"
          />
          <MetricCard
            title="Pages vues"
            value={realtimeData.currentPageViews}
            icon={Eye}
            description="Dernière minute"
          />
          <MetricCard
            title="Sessions"
            value={realtimeData.currentSessions}
            icon={Clock}
            description="Actives"
          />
          <MetricCard
            title="Taux d'engagement"
            value="68.5%"
            change={5.2}
            icon={Activity}
            trend="up"
            description="vs semaine dernière"
          />
        </div>
      )}

      {/* Navigation par métrique */}
      <div className="flex items-center gap-2 p-1 bg-surface rounded-lg w-fit">
        {(['traffic', 'conversions', 'performance', 'business'] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              selectedMetric === metric
                ? "bg-primary text-white"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {metric === 'traffic' && '🌐 Trafic'}
            {metric === 'conversions' && '🎯 Conversions'}
            {metric === 'performance' && '⚡ Performance'}
            {metric === 'business' && '💼 Business'}
          </button>
        ))}
      </div>

      {/* Traffic Analytics */}
      {selectedMetric === 'traffic' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Visiteurs uniques"
              value={metrics.traffic.uniqueVisitors.toLocaleString()}
              change={12.5}
              icon={Users}
              trend="up"
            />
            <MetricCard
              title="Pages vues"
              value={metrics.traffic.pageViews.toLocaleString()}
              change={8.3}
              icon={Eye}
              trend="up"
            />
            <MetricCard
              title="Taux de rebond"
              value={`${metrics.traffic.bounceRate}%`}
              change={-2.1}
              icon={TrendingDown}
              trend="down"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Tendance du trafic</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Répartition par appareil</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Desktop', value: 65, fill: '#3b82f6' },
                      { name: 'Mobile', value: 28, fill: '#10b981' },
                      { name: 'Tablette', value: 7, fill: '#f59e0b' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Desktop', value: 65, fill: '#3b82f6' },
                      { name: 'Mobile', value: 28, fill: '#10b981' },
                      { name: 'Tablette', value: 7, fill: '#f59e0b' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Conversions Analytics */}
      {selectedMetric === 'conversions' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Formulaires contact"
              value={metrics.conversions.contactForms}
              change={15.2}
              icon={Target}
              trend="up"
            />
            <MetricCard
              title="Vues projets"
              value={metrics.conversions.projectViews.toLocaleString()}
              change={22.8}
              icon={Eye}
              trend="up"
            />
            <MetricCard
              title="Taux conversion"
              value={`${metrics.conversions.conversionRate}%`}
              change={3.5}
              icon={TrendingUp}
              trend="up"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Entonnoir de conversion</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Analytics */}
      {selectedMetric === 'performance' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Vitesse page"
              value={`${metrics.performance.pageSpeed}s`}
              change={-12.5}
              icon={Zap}
              trend="down"
            />
            <MetricCard
              title="Uptime"
              value={`${metrics.performance.uptime}%`}
              change={0.1}
              icon={CheckCircle}
              trend="up"
            />
            <MetricCard
              title="Latence API"
              value={`${metrics.performance.apiLatency}ms`}
              change={-8.3}
              icon={Activity}
              trend="down"
            />
            <MetricCard
              title="Taux erreur"
              value={`${metrics.performance.errorRate}%`}
              change={-45.2}
              icon={AlertCircle}
              trend="down"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Core Web Vitals</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={performanceData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Business Analytics */}
      {selectedMetric === 'business' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Leads générés"
              value={metrics.business.leadsGenerated}
              change={28.5}
              icon={Target}
              trend="up"
            />
            <MetricCard
              title="Clients acquis"
              value={metrics.business.clientAcquisition}
              change={33.3}
              icon={Users}
              trend="up"
            />
            <MetricCard
              title="Impact revenu"
              value={`€${metrics.business.revenueImpact.toLocaleString()}`}
              change={42.1}
              icon={TrendingUp}
              trend="up"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">ROI et Performance Business</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">ROI Actuel</span>
                  <span className="text-2xl font-bold text-primary">{metrics.business.roi}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(metrics.business.roi, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary">Taux Acquisition</span>
                  <span className="text-2xl font-bold text-green-500">
                    {((metrics.business.clientAcquisition / metrics.business.leadsGenerated) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(metrics.business.clientAcquisition / metrics.business.leadsGenerated) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prédictions IA */}
      {metrics && (
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Prédictions IA</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {metrics.predictions.confidence}% confiance
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-text-secondary text-sm">Visiteurs mois prochain</p>
              <p className="text-xl font-bold text-text-primary">
                {metrics.predictions.nextMonthVisitors.toLocaleString()}
              </p>
              <p className="text-text-tertiary text-xs">
                Tendance: {metrics.predictions.seasonalTrend === 'up' ? '↗️' : metrics.predictions.seasonalTrend === 'down' ? '↘️' : '➡️'}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Conversions mois prochain</p>
              <p className="text-xl font-bold text-text-primary">
                {metrics.predictions.nextMonthConversions}
              </p>
              <p className="text-text-tertiary text-xs">Basé sur tendances actuelles</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Recommandation</p>
              <p className="text-xl font-bold text-primary">Optimiser SEO</p>
              <p className="text-text-tertiary text-xs">Potentiel +15% trafic</p>
            </div>
          </div>
        </div>
      )}

      {/* Activité récente temps réel */}
      {realtimeData && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Activité récente</h3>
          <div className="space-y-3">
            {realtimeData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-surface-elevated rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary">
                    {activity.type === 'page_view' && '📄 Page vue'}
                    {activity.type === 'form_submit' && '📝 Formulaire soumis'}
                    {activity.type === 'project_click' && '🎯 Projet cliqué'}
                    {activity.type === 'download' && '⬇️ Téléchargement'}
                  </p>
                  <p className="text-xs text-text-secondary">{activity.page}</p>
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
