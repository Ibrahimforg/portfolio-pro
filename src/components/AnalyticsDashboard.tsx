'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Activity, 
  Clock, 
  Smartphone, 
  Monitor 
} from 'lucide-react'

// Composants UI temporaires pour éviter les erreurs
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

const CardDescription = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
)

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
)

const Tabs = ({ children, defaultValue, className = "" }: { children: React.ReactNode; defaultValue?: string; className?: string }) => (
  <div className={className}>{children}</div>
)

const TabsList = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex space-x-2 mb-4 ${className}`}>{children}</div>
)

const TabsTrigger = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-md text-sm font-medium ${className}`}>{children}</button>
)

const TabsContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
)

const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${value}%` }}></div>
  </div>
)

const Button = ({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button onClick={onClick} className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}>{children}</button>
)

interface AnalyticsData {
  pageViews: number
  sessions: number
  avgSessionDuration: number
  bounceRate: number
  topPages: Array<{ path: string; count: number }>
  deviceBreakdown: Record<string, number>
  performance: any
  timeframe: string
  lastUpdated: string
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 1000}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 border-t-blue-500"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Aucune donnée analytique disponible
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytics</h1>
        <p className="text-gray-600">
          Métriques en temps réel de votre portfolio
        </p>
      </div>

      {/* Time Frame Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Période d'analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              className={timeframe === '1d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}
              onClick={() => setTimeframe('1d')}
            >
              24h
            </Button>
            <Button
              className={timeframe === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}
              onClick={() => setTimeframe('7d')}
            >
              7j
            </Button>
            <Button
              className={timeframe === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}
              onClick={() => setTimeframe('30d')}
            >
              30j
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Pages Vues</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.pageViews)}</div>
            <p className="text-sm text-gray-600">Total des {timeframe}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.sessions)}</div>
            <p className="text-sm text-gray-600">Utilisateurs uniques</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(data.avgSessionDuration)}</div>
            <p className="text-sm text-gray-600">Par session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Taux de Rebond</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bounceRate}%</div>
            <p className="text-sm text-gray-600">
              {data.bounceRate < 30 ? 'Excellent' : data.bounceRate < 50 ? 'Bon' : 'À améliorer'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des Pages Vues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Graphique des pages vues</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition par Appareils</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Graphique de répartition par appareils</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Pages les Plus Visitées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{page.path}</div>
                  <div className="text-sm text-gray-600">{page.count} vues</div>
                </div>
                <Progress value={(page.count / data.pageViews) * 100} className="w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {data.performance && (
        <Card>
          <CardHeader>
            <CardTitle>Métriques de Performance</CardTitle>
            <Monitor className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-900">Performance Score</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.performance?.score || 'N/A'}
                </div>
                <Progress value={data.performance?.score || 0} className="w-full" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">LCP (ms)</div>
                <div className="text-2xl font-bold">{data.performance?.lcp || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">FID (ms)</div>
                <div className="text-2xl font-bold">{data.performance?.fid || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">CLS</div>
                <div className="text-2xl font-bold">{data.performance?.cls || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Dernière mise à jour: {new Date(data.lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  )
}
