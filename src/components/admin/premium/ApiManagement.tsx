'use client'

import { useState, useEffect } from 'react'
import {
  Globe,
  Key,
  Shield,
  Activity,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  Lock,
  Unlock,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Code,
  Database,
  Mail,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  MoreVertical,
  ExternalLink,
  GitBranch,
  Package,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  Info,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApiEndpoint {
  id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description: string
  category: 'public' | 'private' | 'admin' | 'internal'
  status: 'active' | 'deprecated' | 'maintenance'
  rateLimit: {
    requests: number
    window: number // en secondes
    perUser?: boolean
    perIp?: boolean
  }
  authentication: {
    required: boolean
    type: 'none' | 'api_key' | 'bearer' | 'oauth2'
    scopes?: string[]
  }
  documentation: {
    summary: string
    parameters: ApiParameter[]
    responses: ApiResponse[]
    examples: ApiExample[]
  }
  metrics: {
    totalRequests: number
    successRate: number
    avgResponseTime: number
    errorRate: number
    lastAccess?: string
    topUsers: Array<{ userId: string; requests: number }>
  }
  version: string
  createdAt: string
  updatedAt: string
}

interface ApiParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  example?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
    enum?: string[]
  }
}

interface ApiResponse {
  code: number
  description: string
  schema?: any
  example?: any
}

interface ApiExample {
  title: string
  description: string
  request: any
  response: any
}

interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  permissions: string[]
  endpoints: string[]
  rateLimit: {
    requests: number
    window: number
  }
  status: 'active' | 'inactive' | 'expired'
  expiresAt?: string
  lastUsed?: string
  createdBy: string
  createdAt: string
  usage: {
    totalRequests: number
    thisMonth: number
    lastRequest?: string
  }
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  status: 'active' | 'inactive' | 'failed'
  retries: number
  lastDelivery?: string
  deliveryStats: {
    total: number
    successful: number
    failed: number
  }
  createdAt: string
  updatedAt: string
}

export default function ApiManagement() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'endpoints' | 'keys' | 'webhooks' | 'analytics'>('endpoints')
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Simulation des données API
    const mockEndpoints: ApiEndpoint[] = [
      {
        id: '1',
        path: '/api/projects',
        method: 'GET',
        description: 'Récupère tous les projets',
        category: 'public',
        status: 'active',
        rateLimit: {
          requests: 100,
          window: 3600,
          perIp: true
        },
        authentication: {
          required: false,
          type: 'none'
        },
        documentation: {
          summary: 'Endpoint pour récupérer la liste des projets',
          parameters: [
            {
              name: 'limit',
              type: 'number',
              required: false,
              description: 'Nombre maximum de résultats',
              example: 10,
              validation: { min: 1, max: 100 }
            },
            {
              name: 'category',
              type: 'string',
              required: false,
              description: 'Filtrer par catégorie',
              example: 'web',
              validation: { enum: ['web', 'mobile', 'design'] }
            }
          ],
          responses: [
            {
              code: 200,
              description: 'Liste des projets récupérée avec succès',
              example: {
                projects: [
                  { id: 1, title: 'Project 1', category: 'web' },
                  { id: 2, title: 'Project 2', category: 'mobile' }
                ]
              }
            },
            {
              code: 400,
              description: 'Paramètres invalides',
              example: { error: 'Invalid parameters' }
            }
          ],
          examples: [
            {
              title: 'Exemple basique',
              description: 'Récupérer les 10 premiers projets',
              request: { url: '/api/projects?limit=10' },
              response: { projects: [] }
            }
          ]
        },
        metrics: {
          totalRequests: 15420,
          successRate: 98.5,
          avgResponseTime: 145,
          errorRate: 1.5,
          lastAccess: '2024-03-08T10:30:00Z',
          topUsers: [
            { userId: 'user_1', requests: 3420 },
            { userId: 'user_2', requests: 2150 }
          ]
        },
        version: 'v1.0.0',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z'
      },
      {
        id: '2',
        path: '/api/contact',
        method: 'POST',
        description: 'Soumet un formulaire de contact',
        category: 'public',
        status: 'active',
        rateLimit: {
          requests: 10,
          window: 3600,
          perIp: true
        },
        authentication: {
          required: false,
          type: 'none'
        },
        documentation: {
          summary: 'Endpoint pour soumettre un formulaire de contact',
          parameters: [
            {
              name: 'name',
              type: 'string',
              required: true,
              description: 'Nom de l\'expéditeur',
              example: 'John Doe'
            },
            {
              name: 'email',
              type: 'string',
              required: true,
              description: 'Email de l\'expéditeur',
              example: 'john@example.com'
            },
            {
              name: 'message',
              type: 'string',
              required: true,
              description: 'Message du contact',
              example: 'Bonjour, je suis intéressé par vos services...'
            }
          ],
          responses: [
            {
              code: 200,
              description: 'Message envoyé avec succès',
              example: { success: true, message: 'Message sent successfully' }
            },
            {
              code: 429,
              description: 'Trop de requêtes',
              example: { error: 'Rate limit exceeded' }
            }
          ],
          examples: []
        },
        metrics: {
          totalRequests: 892,
          successRate: 97.2,
          avgResponseTime: 280,
          errorRate: 2.8,
          lastAccess: '2024-03-08T09:45:00Z',
          topUsers: []
        },
        version: 'v1.0.0',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-02-15T16:20:00Z'
      }
    ]

    const mockApiKeys: ApiKey[] = [
      {
        id: '1',
        name: 'Production API Key',
        key: 'pk_live_1234567890abcdefghijklmnopqrstuvwxyz',
        prefix: 'pk_live_',
        permissions: ['projects:read', 'contact:write'],
        endpoints: ['/api/projects', '/api/contact'],
        rateLimit: {
          requests: 1000,
          window: 3600
        },
        status: 'active',
        expiresAt: '2025-03-08T00:00:00Z',
        lastUsed: '2024-03-08T10:15:00Z',
        createdBy: 'John Doe',
        createdAt: '2024-01-01T09:00:00Z',
        usage: {
          totalRequests: 15420,
          thisMonth: 3420,
          lastRequest: '2024-03-08T10:15:00Z'
        }
      },
      {
        id: '2',
        name: 'Development API Key',
        key: 'pk_test_0987654321zyxwvutsrqponmlkjihgfedcba',
        prefix: 'pk_test_',
        permissions: ['*'],
        endpoints: ['*'],
        rateLimit: {
          requests: 10000,
          window: 3600
        },
        status: 'active',
        createdBy: 'Jane Smith',
        createdAt: '2024-02-15T14:30:00Z',
        usage: {
          totalRequests: 5670,
          thisMonth: 1230
        }
      }
    ]

    const mockWebhooks: Webhook[] = [
      {
        id: '1',
        name: 'New Contact Webhook',
        url: 'https://external-app.com/webhooks/contact',
        events: ['contact.created', 'contact.updated'],
        secret: 'whsec_1234567890abcdef',
        status: 'active',
        retries: 3,
        lastDelivery: '2024-03-08T09:30:00Z',
        deliveryStats: {
          total: 127,
          successful: 124,
          failed: 3
        },
        createdAt: '2024-01-10T11:00:00Z',
        updatedAt: '2024-03-01T10:15:00Z'
      }
    ]

    setEndpoints(mockEndpoints)
    setApiKeys(mockApiKeys)
    setWebhooks(mockWebhooks)
  }, [])

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || endpoint.category === filterCategory
    const matchesStatus = filterStatus === 'all' || endpoint.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500 text-white'
      case 'POST': return 'bg-blue-500 text-white'
      case 'PUT': return 'bg-orange-500 text-white'
      case 'DELETE': return 'bg-red-500 text-white'
      case 'PATCH': return 'bg-purple-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10'
      case 'inactive': return 'text-gray-500 bg-gray-500/10'
      case 'expired': return 'text-red-500 bg-red-500/10'
      case 'deprecated': return 'text-orange-500 bg-orange-500/10'
      case 'maintenance': return 'text-yellow-500 bg-yellow-500/10'
      case 'failed': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const EndpointCard = ({ endpoint }: { endpoint: ApiEndpoint }) => (
    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2 py-1 text-xs rounded font-medium",
              getMethodColor(endpoint.method)
            )}>
              {endpoint.method}
            </span>
            <h3 className="font-mono text-text-primary">{endpoint.path}</h3>
            <span className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              getStatusColor(endpoint.status)
            )}>
              {endpoint.status === 'active' && 'Actif'}
              {endpoint.status === 'deprecated' && 'Déprécié'}
              {endpoint.status === 'maintenance' && 'Maintenance'}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{endpoint.description}</p>
        </div>
        <button className="p-1 text-text-secondary hover:text-text-primary">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Rate Limiting */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-surface-elevated rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Rate Limit</span>
          </div>
          <p className="text-xs text-text-secondary">
            {endpoint.rateLimit.requests} requêtes / {endpoint.rateLimit.window / 60}min
          </p>
          <p className="text-xs text-text-tertiary">
            {endpoint.rateLimit.perIp && 'Par IP'} {endpoint.rateLimit.perUser && 'Par utilisateur'}
          </p>
        </div>
        <div className="p-3 bg-surface-elevated rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Authentification</span>
          </div>
          <p className="text-xs text-text-secondary">
            {endpoint.authentication.required ? endpoint.authentication.type : 'Aucune'}
          </p>
          {endpoint.authentication.scopes && (
            <p className="text-xs text-text-tertiary">
              Scopes: {endpoint.authentication.scopes.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-surface-elevated rounded-lg">
          <div className="text-sm font-semibold text-text-primary">
            {endpoint.metrics.totalRequests.toLocaleString()}
          </div>
          <p className="text-xs text-text-tertiary">Requêtes</p>
        </div>
        <div className="text-center p-2 bg-surface-elevated rounded-lg">
          <div className="text-sm font-semibold text-green-500">
            {endpoint.metrics.successRate}%
          </div>
          <p className="text-xs text-text-tertiary">Succès</p>
        </div>
        <div className="text-center p-2 bg-surface-elevated rounded-lg">
          <div className="text-sm font-semibold text-blue-500">
            {endpoint.metrics.avgResponseTime}ms
          </div>
          <p className="text-xs text-text-tertiary">Temps moy.</p>
        </div>
        <div className="text-center p-2 bg-surface-elevated rounded-lg">
          <div className="text-sm font-semibold text-red-500">
            {endpoint.metrics.errorRate}%
          </div>
          <p className="text-xs text-text-tertiary">Erreurs</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedEndpoint(endpoint)}
          className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Documentation
        </button>
        <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm flex items-center justify-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
      </div>
    </div>
  )

  const ApiKeyCard = ({ apiKey }: { apiKey: ApiKey }) => (
    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-text-primary">{apiKey.name}</h3>
          <p className="text-sm text-text-secondary">Créée par {apiKey.createdBy}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getStatusColor(apiKey.status)
          )}>
            {apiKey.status === 'active' && 'Active'}
            {apiKey.status === 'inactive' && 'Inactive'}
            {apiKey.status === 'expired' && 'Expirée'}
          </span>
          <button className="p-1 text-text-secondary hover:text-text-primary">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="mb-4">
        <div className="flex items-center gap-2 p-3 bg-surface-elevated rounded-lg">
          <code className="flex-1 text-sm font-mono text-text-primary">
            {showSecrets[apiKey.id] ? apiKey.key : `${apiKey.prefix}${'*'.repeat(20)}`}
          </code>
          <button
            onClick={() => setShowSecrets(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
            className="p-1 text-text-secondary hover:text-text-primary"
          >
            {showSecrets[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button className="p-1 text-text-secondary hover:text-text-primary">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-text-secondary">Total requêtes</p>
          <p className="font-semibold text-text-primary">
            {apiKey.usage.totalRequests.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Ce mois</p>
          <p className="font-semibold text-primary">
            {apiKey.usage.thisMonth.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Rate Limit */}
      <div className="p-3 bg-surface-elevated rounded-lg mb-4">
        <p className="text-sm text-text-secondary mb-1">Rate Limit</p>
        <p className="font-medium text-text-primary">
          {apiKey.rateLimit.requests} requêtes / {apiKey.rateLimit.window / 60} minutes
        </p>
      </div>

      {/* Expiration */}
      {apiKey.expiresAt && (
        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg mb-4">
          <p className="text-sm text-orange-500">
            Expiration: {new Date(apiKey.expiresAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm">
          <Edit className="w-4 h-4 inline mr-1" />
          Modifier
        </button>
        <button className="flex-1 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm">
          <Trash2 className="w-4 h-4 inline mr-1" />
          Supprimer
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">API Management</h1>
            <p className="text-text-secondary mt-1">Gestion complète des APIs et intégrations</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="px-4 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Nouvelle Clé API
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel Endpoint
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface rounded-lg w-fit mb-6">
          {[
            { id: 'endpoints', label: 'Endpoints', icon: Globe },
            { id: 'keys', label: 'Clés API', icon: Key },
            { id: 'webhooks', label: 'Webhooks', icon: GitBranch },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
              placeholder="Rechercher un endpoint..."
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
            <option value="public">Public</option>
            <option value="private">Privé</option>
            <option value="admin">Admin</option>
            <option value="internal">Interne</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="deprecated">Dépréciés</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Endpoints Tab */}
        {activeTab === 'endpoints' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEndpoints.map(endpoint => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} />
            ))}
            
            {filteredEndpoints.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Globe className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Aucun endpoint trouvé</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Créer un endpoint
                </button>
              </div>
            )}
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apiKeys.map(apiKey => (
              <ApiKeyCard key={apiKey.id} apiKey={apiKey} />
            ))}
            
            {apiKeys.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Key className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Aucune clé API</p>
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Générer une clé API
                </button>
              </div>
            )}
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            {webhooks.map(webhook => (
              <div key={webhook.id} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">{webhook.name}</h3>
                    <p className="text-sm text-text-secondary font-mono">{webhook.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium",
                      getStatusColor(webhook.status)
                    )}>
                      {webhook.status === 'active' && 'Actif'}
                      {webhook.status === 'inactive' && 'Inactif'}
                      {webhook.status === 'failed' && 'Échoué'}
                    </span>
                    <button className="p-1 text-text-secondary hover:text-text-primary">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-text-secondary">Événements</p>
                    <p className="font-medium text-text-primary">{webhook.events.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Tentatives</p>
                    <p className="font-medium text-text-primary">{webhook.deliveryStats.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Succès</p>
                    <p className="font-medium text-green-500">
                      {((webhook.deliveryStats.successful / webhook.deliveryStats.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Modifier
                  </button>
                  <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Tester
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Statistiques Globales</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total endpoints</span>
                  <span className="text-2xl font-bold text-primary">{endpoints.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Requêtes totales</span>
                  <span className="text-2xl font-bold text-green-500">
                    {endpoints.reduce((sum, e) => sum + e.metrics.totalRequests, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Taux de succès moyen</span>
                  <span className="text-2xl font-bold text-blue-500">
                    {(endpoints.reduce((sum, e) => sum + e.metrics.successRate, 0) / endpoints.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Temps de réponse moyen</span>
                  <span className="text-2xl font-bold text-purple-500">
                    {(endpoints.reduce((sum, e) => sum + e.metrics.avgResponseTime, 0) / endpoints.length).toFixed(0)}ms
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Top Endpoints</h3>
              <div className="space-y-3">
                {endpoints
                  .sort((a, b) => b.metrics.totalRequests - a.metrics.totalRequests)
                  .slice(0, 5)
                  .map(endpoint => (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">{endpoint.method} {endpoint.path}</p>
                        <p className="text-sm text-text-secondary">{endpoint.metrics.totalRequests} requêtes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-500">{endpoint.metrics.successRate}%</p>
                        <p className="text-sm text-text-secondary">succès</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
