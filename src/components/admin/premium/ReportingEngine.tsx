'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share2,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  Layout,
  Palette,
  Zap,
  Target,
  DollarSign,
  MousePointer,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Star,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'analytics' | 'performance' | 'business' | 'security' | 'custom'
  icon: any
  format: 'pdf' | 'excel' | 'csv' | 'json'
  schedule?: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  isPublic: boolean
  createdAt: string
  lastGenerated?: string
  metrics: {
    totalGenerated: number
    avgGenerationTime: number
    downloads: number
    views: number
  }
  config: ReportConfig
}

interface ReportConfig {
  type: 'analytics' | 'performance' | 'business' | 'custom'
  sections: ReportSection[]
  filters: ReportFilter[]
  styling: ReportStyling
  branding: ReportBranding
}

interface ReportSection {
  id: string
  type: 'chart' | 'table' | 'text' | 'image' | 'metric'
  title: string
  config: Record<string, any>
  dataSource: string
  position: { x: number; y: number; width: number; height: number }
}

interface ReportFilter {
  id: string
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'between'
  value: any
  label: string
}

interface ReportStyling {
  theme: 'light' | 'dark' | 'custom'
  colors: string[]
  fonts: string[]
  layout: 'portrait' | 'landscape'
  margins: { top: number; right: number; bottom: number; left: number }
}

interface ReportBranding {
  logo?: string
  company: string
  footer: string
  watermark?: string
}

interface ScheduledReport {
  id: string
  templateId: string
  name: string
  schedule: string
  recipients: string[]
  isActive: boolean
  lastRun?: string
  nextRun?: string
  format: 'pdf' | 'excel' | 'csv'
}

export default function ReportingEngine() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'templates' | 'scheduled' | 'analytics' | 'builder'>('templates')

  useEffect(() => {
    // Simulation des données
    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Analytics Mensuel',
        description: 'Rapport complet des analytics du site web',
        category: 'analytics',
        icon: BarChart3,
        format: 'pdf',
        schedule: 'monthly',
        isPublic: false,
        createdAt: '2024-02-01T09:00:00Z',
        lastGenerated: '2024-03-01T10:00:00Z',
        metrics: {
          totalGenerated: 12,
          avgGenerationTime: 45,
          downloads: 89,
          views: 234
        },
        config: {
          type: 'analytics',
          sections: [
            {
              id: 'traffic-overview',
              type: 'chart',
              title: 'Vue d\'ensemble du trafic',
              config: { chartType: 'line', period: '30d' },
              dataSource: 'google-analytics',
              position: { x: 0, y: 0, width: 600, height: 300 }
            },
            {
              id: 'device-breakdown',
              type: 'chart',
              title: 'Répartition par appareil',
              config: { chartType: 'pie', period: '30d' },
              dataSource: 'google-analytics',
              position: { x: 620, y: 0, width: 300, height: 300 }
            }
          ],
          filters: [],
          styling: {
            theme: 'light',
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            fonts: ['Inter', 'Roboto'],
            layout: 'portrait',
            margins: { top: 20, right: 20, bottom: 20, left: 20 }
          },
          branding: {
            company: 'Portfolio Pro',
            footer: 'Rapport généré automatiquement'
          }
        }
      },
      {
        id: '2',
        name: 'Performance Technique',
        description: 'Métriques de performance et disponibilité',
        category: 'performance',
        icon: Zap,
        format: 'excel',
        schedule: 'weekly',
        isPublic: true,
        createdAt: '2024-01-15T14:30:00Z',
        lastGenerated: '2024-03-07T08:00:00Z',
        metrics: {
          totalGenerated: 45,
          avgGenerationTime: 12,
          downloads: 156,
          views: 445
        },
        config: {
          type: 'performance',
          sections: [
            {
              id: 'uptime-metrics',
              type: 'table',
              title: 'Métriques de disponibilité',
              config: { columns: ['date', 'uptime', 'response_time'] },
              dataSource: 'uptime-monitor',
              position: { x: 0, y: 0, width: 800, height: 400 }
            }
          ],
          filters: [],
          styling: {
            theme: 'light',
            colors: ['#10b981', '#f59e0b'],
            fonts: ['Inter'],
            layout: 'landscape',
            margins: { top: 15, right: 15, bottom: 15, left: 15 }
          },
          branding: {
            company: 'Portfolio Pro',
            footer: 'Rapport de performance technique'
          }
        }
      },
      {
        id: '3',
        name: 'Rapport Business',
        description: 'KPIs business et ROI',
        category: 'business',
        icon: DollarSign,
        format: 'pdf',
        schedule: 'monthly',
        isPublic: false,
        createdAt: '2024-01-01T10:00:00Z',
        lastGenerated: '2024-03-01T12:00:00Z',
        metrics: {
          totalGenerated: 15,
          avgGenerationTime: 67,
          downloads: 78,
          views: 189
        },
        config: {
          type: 'business',
          sections: [
            {
              id: 'revenue-metrics',
              type: 'metric',
              title: 'Métriques de revenus',
              config: { metrics: ['total_revenue', 'roi', 'conversion_rate'] },
              dataSource: 'business-analytics',
              position: { x: 0, y: 0, width: 400, height: 200 }
            }
          ],
          filters: [],
          styling: {
            theme: 'dark',
            colors: ['#8b5cf6', '#3b82f6', '#10b981'],
            fonts: ['Inter', 'Open Sans'],
            layout: 'portrait',
            margins: { top: 25, right: 25, bottom: 25, left: 25 }
          },
          branding: {
            company: 'Portfolio Pro',
            footer: 'Rapport business confidentiel'
          }
        }
      }
    ]

    const mockScheduledReports: ScheduledReport[] = [
      {
        id: '1',
        templateId: '1',
        name: 'Analytics Mensuel Auto',
        schedule: '0 9 1 * *',
        recipients: ['admin@portfolio.com', 'team@portfolio.com'],
        isActive: true,
        lastRun: '2024-03-01T09:00:00Z',
        nextRun: '2024-04-01T09:00:00Z',
        format: 'pdf'
      },
      {
        id: '2',
        templateId: '2',
        name: 'Performance Hebdomadaire',
        schedule: '0 8 * * 1',
        recipients: ['tech-team@portfolio.com'],
        isActive: true,
        lastRun: '2024-03-04T08:00:00Z',
        nextRun: '2024-03-11T08:00:00Z',
        format: 'excel'
      }
    ]

    setTemplates(mockTemplates)
    setScheduledReports(mockScheduledReports)
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analytics': return 'bg-blue-500 text-white'
      case 'performance': return 'bg-green-500 text-white'
      case 'business': return 'bg-purple-500 text-white'
      case 'security': return 'bg-red-500 text-white'
      case 'custom': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return FileText
      case 'excel': return BarChart3
      case 'csv': return FileText
      case 'json': return File
      default: return FileText
    }
  }

  const ReportTemplateCard = ({ template }: { template: ReportTemplate }) => {
    const FormatIcon = getFormatIcon(template.format)
    const CategoryIcon = template.icon

    return (
      <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CategoryIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{template.name}</h3>
              <p className="text-sm text-text-secondary">{template.description}</p>
            </div>
          </div>
          <button className="p-1 text-text-secondary hover:text-text-primary">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getCategoryColor(template.category)
          )}>
            {template.category}
          </span>
          <span className="px-2 py-1 bg-surface-elevated text-text-secondary text-xs rounded-full flex items-center gap-1">
            <FormatIcon className="w-3 h-3" />
            {template.format.toUpperCase()}
          </span>
          {template.schedule && (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full">
              {template.schedule === 'daily' && 'Quotidien'}
              {template.schedule === 'weekly' && 'Hebdomadaire'}
              {template.schedule === 'monthly' && 'Mensuel'}
              {template.schedule === 'quarterly' && 'Trimestriel'}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-surface-elevated rounded-lg">
            <div className="text-sm font-semibold text-text-primary">
              {template.metrics.totalGenerated}
            </div>
            <p className="text-xs text-text-tertiary">Générés</p>
          </div>
          <div className="text-center p-2 bg-surface-elevated rounded-lg">
            <div className="text-sm font-semibold text-text-primary">
              {template.metrics.avgGenerationTime}s
            </div>
            <p className="text-xs text-text-tertiary">Temps moy.</p>
          </div>
          <div className="text-center p-2 bg-surface-elevated rounded-lg">
            <div className="text-sm font-semibold text-text-primary">
              {template.metrics.downloads}
            </div>
            <p className="text-xs text-text-tertiary">Téléchargements</p>
          </div>
          <div className="text-center p-2 bg-surface-elevated rounded-lg">
            <div className="text-sm font-semibold text-text-primary">
              {template.metrics.views}
            </div>
            <p className="text-xs text-text-tertiary">Vues</p>
          </div>
        </div>

        {/* Last generation */}
        {template.lastGenerated && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-surface-elevated rounded-lg">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <span className="text-sm text-text-secondary">
              Dernière génération: {new Date(template.lastGenerated).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTemplate(template)}
            className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Aperçu
          </button>
          <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Générer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Moteur de Rapports</h1>
            <p className="text-text-secondary mt-1">Créez, générez et automatisez des rapports professionnels</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                isPreviewMode 
                  ? "bg-orange-500 text-white" 
                  : "bg-surface-elevated text-text-primary hover:bg-surface"
              )}
            >
              <Eye className="w-4 h-4" />
              {isPreviewMode ? 'Mode Édition' : 'Mode Aperçu'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Rapport
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface rounded-lg w-fit mb-6">
          {[
            { id: 'templates', label: 'Templates', icon: Layout },
            { id: 'scheduled', label: 'Planifiés', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'builder', label: 'Builder', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-surface rounded-xl">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
          >
            <option value="all">Toutes les catégories</option>
            <option value="analytics">Analytics</option>
            <option value="performance">Performance</option>
            <option value="business">Business</option>
            <option value="security">Sécurité</option>
            <option value="custom">Personnalisé</option>
          </select>
          <button className="px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres avancés
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <ReportTemplateCard key={template.id} template={template} />
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Layout className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Aucun template trouvé</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Créer un template
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scheduled Reports Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {scheduledReports.map(report => {
              const template = templates.find(t => t.id === report.templateId)
              return (
                <div key={report.id} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary text-lg">{report.name}</h3>
                      <p className="text-sm text-text-secondary">
                        Basé sur: {template?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full font-medium",
                        report.isActive ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                      )}>
                        {report.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <button className="p-1 text-text-secondary hover:text-text-primary">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-text-secondary">Fréquence</p>
                      <p className="font-medium text-text-primary">{report.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Destinataires</p>
                      <p className="font-medium text-text-primary">{report.recipients.length} email(s)</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Format</p>
                      <p className="font-medium text-text-primary uppercase">{report.format}</p>
                    </div>
                  </div>

                  {report.lastRun && (
                    <div className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-text-primary">
                          Dernière exécution: {new Date(report.lastRun).toLocaleString()}
                        </span>
                      </div>
                      {report.nextRun && (
                        <span className="text-sm text-text-secondary">
                          Prochaine: {new Date(report.nextRun).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Envoyer maintenant
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Statistiques Générales</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total rapports générés</span>
                  <span className="text-2xl font-bold text-primary">
                    {templates.reduce((sum, t) => sum + t.metrics.totalGenerated, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Rapports ce mois</span>
                  <span className="text-2xl font-bold text-green-500">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Téléchargements totaux</span>
                  <span className="text-2xl font-bold text-blue-500">
                    {templates.reduce((sum, t) => sum + t.metrics.downloads, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Temps moyen génération</span>
                  <span className="text-2xl font-bold text-purple-500">
                    {(templates.reduce((sum, t) => sum + t.metrics.avgGenerationTime, 0) / templates.length).toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Formats les plus utilisés</h3>
              <div className="space-y-3">
                {['pdf', 'excel', 'csv', 'json'].map(format => {
                  const count = templates.filter(t => t.format === format).length
                  const percentage = (count / templates.length) * 100
                  return (
                    <div key={format} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {format === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                        {format === 'excel' && <BarChart3 className="w-4 h-4 text-green-500" />}
                        {format === 'csv' && <FileText className="w-4 h-4 text-blue-500" />}
                        {format === 'json' && <File className="w-4 h-4 text-purple-500" />}
                        <span className="text-sm font-medium text-text-primary uppercase">{format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{count} templates</span>
                        <span className="text-sm font-medium text-primary">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="bg-surface border border-border rounded-xl p-8">
            <div className="text-center py-12">
              <Layout className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Report Builder</h3>
              <p className="text-text-secondary mb-6">
                Créez des rapports personnalisés avec notre interface drag-and-drop
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Lancer le Report Builder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
