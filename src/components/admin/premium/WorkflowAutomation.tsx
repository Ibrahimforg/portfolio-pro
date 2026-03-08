'use client'

import { useState, useEffect } from 'react'
import {
  Zap,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Copy,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Mail,
  Bell,
  Webhook,
  FileText,
  Users,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  Save,
  Eye,
  GitBranch,
  Code,
  Database,
  Globe,
  Smartphone,
  MessageSquare,
  ShoppingCart,
  User,
  Star,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Layers,
  Package,
  Lock,
  Unlock,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkflowTrigger {
  id: string
  type: 'form_submit' | 'new_project' | 'user_register' | 'schedule' | 'api_call' | 'file_upload' | 'email_received'
  name: string
  description: string
  icon: any
  config: Record<string, any>
}

interface WorkflowAction {
  id: string
  type: 'email' | 'notification' | 'webhook' | 'data_process' | 'file_operation' | 'api_call' | 'delay' | 'conditional'
  name: string
  description: string
  icon: any
  config: Record<string, any>
  delay?: number
}

interface WorkflowCondition {
  id: string
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: any
  logic?: 'and' | 'or'
}

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error'
  triggers: WorkflowTrigger[]
  conditions: WorkflowCondition[]
  actions: WorkflowAction[]
  schedule?: {
    type: 'cron' | 'interval' | 'once'
    value: string
    timezone?: string
  }
  metrics: {
    totalRuns: number
    successRate: number
    lastRun?: string
    avgExecutionTime: number
  }
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startTime: string
  endTime?: string
  duration?: number
  trigger: string
  steps: Array<{
    id: string
    action: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    startTime?: string
    endTime?: string
    output?: any
    error?: string
  }>
  input: Record<string, any>
  output?: Record<string, any>
}

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'workflows' | 'executions' | 'templates' | 'analytics'>('workflows')

  useEffect(() => {
    // Simulation des données workflows
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Notification Nouveau Contact',
        description: 'Envoie un email et une notification quand un formulaire de contact est soumis',
        status: 'active',
        triggers: [
          {
            id: 't1',
            type: 'form_submit',
            name: 'Formulaire Contact',
            description: 'Déclenché quand un utilisateur soumet le formulaire de contact',
            icon: MessageSquare,
            config: { formId: 'contact-form' }
          }
        ],
        conditions: [
          {
            id: 'c1',
            field: 'email',
            operator: 'exists',
            value: true
          }
        ],
        actions: [
          {
            id: 'a1',
            type: 'email',
            name: 'Email Admin',
            description: 'Envoie un email à l\'administrateur',
            icon: Mail,
            config: {
              to: 'admin@portfolio.com',
              subject: 'Nouveau message de contact',
              template: 'contact-notification'
            }
          },
          {
            id: 'a2',
            type: 'notification',
            name: 'Notification Interne',
            description: 'Crée une notification dans le panel',
            icon: Bell,
            config: {
              title: 'Nouveau contact',
              message: 'Un nouveau message a été reçu',
              type: 'info'
            }
          }
        ],
        metrics: {
          totalRuns: 127,
          successRate: 98.4,
          lastRun: '2024-03-08T10:30:00Z',
          avgExecutionTime: 2.3
        },
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-03-07T15:30:00Z',
        createdBy: 'John Doe'
      },
      {
        id: '2',
        name: 'Backup Journalier',
        description: 'Effectue une sauvegarde automatique des données tous les jours',
        status: 'active',
        triggers: [
          {
            id: 't2',
            type: 'schedule',
            name: 'Planning Quotidien',
            description: 'Déclenché tous les jours à 2h du matin',
            icon: Calendar,
            config: {}
          }
        ],
        conditions: [],
        actions: [
          {
            id: 'a3',
            type: 'data_process',
            name: 'Backup Database',
            description: 'Crée une sauvegarde de la base de données',
            icon: Database,
            config: {
              operation: 'backup',
              destination: 's3://backups/daily'
            }
          },
          {
            id: 'a4',
            type: 'email',
            name: 'Confirmation Backup',
            description: 'Envoie une confirmation de backup',
            icon: Mail,
            config: {
              to: 'admin@portfolio.com',
              subject: 'Backup quotidien terminé',
              template: 'backup-confirmation'
            }
          }
        ],
        schedule: {
          type: 'cron',
          value: '0 2 * * *',
          timezone: 'Europe/Paris'
        },
        metrics: {
          totalRuns: 67,
          successRate: 100,
          lastRun: '2024-03-08T02:00:00Z',
          avgExecutionTime: 45.7
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-28T16:20:00Z',
        createdBy: 'Jane Smith'
      }
    ]

    const mockExecutions: WorkflowExecution[] = [
      {
        id: 'e1',
        workflowId: '1',
        status: 'completed',
        startTime: '2024-03-08T10:30:00Z',
        endTime: '2024-03-08T10:32:15Z',
        duration: 135,
        trigger: 'form_submit',
        input: {
          email: 'client@example.com',
          name: 'John Client',
          message: 'Bonjour, je suis intéressé par vos services...'
        },
        steps: [
          {
            id: 's1',
            action: 'Email Admin',
            status: 'completed',
            startTime: '2024-03-08T10:30:00Z',
            endTime: '2024-03-08T10:31:00Z',
            output: { messageId: 'msg_12345' }
          },
          {
            id: 's2',
            action: 'Notification Interne',
            status: 'completed',
            startTime: '2024-03-08T10:31:00Z',
            endTime: '2024-03-08T10:32:15Z',
            output: { notificationId: 'notif_67890' }
          }
        ]
      }
    ]

    setWorkflows(mockWorkflows)
    setExecutions(mockExecutions)
  }, [])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || workflow.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10'
      case 'inactive': return 'text-gray-500 bg-gray-500/10'
      case 'error': return 'text-red-500 bg-red-500/10'
      case 'running': return 'text-blue-500 bg-blue-500/10'
      case 'completed': return 'text-green-500 bg-green-500/10'
      case 'failed': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'form_submit': return MessageSquare
      case 'new_project': return Package
      case 'user_register': return Users
      case 'schedule': return Calendar
      case 'api_call': return Code
      case 'file_upload': return Upload
      case 'email_received': return Mail
      default: return Zap
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'notification': return Bell
      case 'webhook': return Webhook
      case 'data_process': return Database
      case 'file_operation': return FileText
      case 'api_call': return Code
      case 'delay': return Clock
      case 'conditional': return GitBranch
      default: return Zap
    }
  }

  const WorkflowCard = ({ workflow }: { workflow: Workflow }) => (
    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary text-lg">{workflow.name}</h3>
          <p className="text-text-secondary text-sm mt-1">{workflow.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 text-xs rounded-full font-medium",
            getStatusColor(workflow.status)
          )}>
            {workflow.status === 'active' && 'Actif'}
            {workflow.status === 'inactive' && 'Inactif'}
            {workflow.status === 'error' && 'Erreur'}
          </span>
          <button className="p-1 text-text-secondary hover:text-text-primary">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workflow Visualization */}
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {workflow.triggers.map((trigger, index) => {
            const TriggerIcon = trigger.icon
            return (
              <div key={trigger.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TriggerIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-text-secondary mt-1 text-center">
                    {trigger.name}
                  </span>
                </div>
                {index < workflow.triggers.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                )}
              </div>
            )
          })}
          
          {workflow.conditions.length > 0 && (
            <>
              <div className="w-px h-8 bg-border"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-xs text-text-secondary mt-1">Conditions</span>
              </div>
              <div className="w-px h-8 bg-border"></div>
            </>
          )}

          {workflow.actions.map((action, index) => {
            const ActionIcon = action.icon
            return (
              <div key={action.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <ActionIcon className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-xs text-text-secondary mt-1 text-center">
                    {action.name}
                  </span>
                </div>
                {index < workflow.actions.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-elevated rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {workflow.metrics.totalRuns}
          </div>
          <p className="text-xs text-text-secondary">Exécutions</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-500">
            {workflow.metrics.successRate}%
          </div>
          <p className="text-xs text-text-secondary">Succès</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-500">
            {workflow.metrics.avgExecutionTime}s
          </div>
          <p className="text-xs text-text-secondary">Temps moyen</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {workflow.metrics.lastRun ? 
                new Date(workflow.metrics.lastRun).toLocaleDateString() : 
                'Jamais'
              }
          </div>
          <p className="text-xs text-text-secondary">Dernière exécution</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <button
          onClick={() => setSelectedWorkflow(workflow)}
          className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Détails
        </button>
        <button className="flex-1 px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm flex items-center justify-center gap-2">
          <Edit className="w-4 h-4" />
          Modifier
        </button>
        <button className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm flex items-center justify-center gap-2">
          {workflow.status === 'active' ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Démarrer
            </>
          )}
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
            <h1 className="text-3xl font-bold text-text-primary">Automatisation Workflows</h1>
            <p className="text-text-secondary mt-1">Créez et gérez des automatisations intelligentes</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTestMode(!isTestMode)}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                isTestMode 
                  ? "bg-orange-500 text-white" 
                  : "bg-surface-elevated text-text-primary hover:bg-surface"
              )}
            >
              <Zap className="w-4 h-4" />
              {isTestMode ? 'Mode Test' : 'Mode Production'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Workflow
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface rounded-lg w-fit mb-6">
          {[
            { id: 'workflows', label: 'Workflows', icon: Layers },
            { id: 'executions', label: 'Exécutions', icon: Activity },
            { id: 'templates', label: 'Templates', icon: Package },
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
              placeholder="Rechercher un workflow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="error">En erreur</option>
          </select>
          <button className="px-3 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map(workflow => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
            
            {filteredWorkflows.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Layers className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Aucun workflow trouvé</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Créer un workflow
                </button>
              </div>
            )}
          </div>
        )}

        {/* Executions Tab */}
        {activeTab === 'executions' && (
          <div className="space-y-4">
            {executions.map(execution => (
              <div key={execution.id} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Exécution #{execution.id}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Workflow: {workflows.find(w => w.id === execution.workflowId)?.name}
                    </p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    getStatusColor(execution.status)
                  )}>
                    {execution.status === 'running' && 'En cours'}
                    {execution.status === 'completed' && 'Terminé'}
                    {execution.status === 'failed' && 'Échoué'}
                    {execution.status === 'cancelled' && 'Annulé'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-text-secondary">Début</p>
                    <p className="font-medium text-text-primary">
                      {new Date(execution.startTime).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Durée</p>
                    <p className="font-medium text-text-primary">
                      {execution.duration ? `${execution.duration}s` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Déclencheur</p>
                    <p className="font-medium text-text-primary">{execution.trigger}</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-primary">Étapes:</p>
                  {execution.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-surface-elevated rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">{index + 1}.</span>
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          step.status === 'completed' && 'bg-green-500',
                          step.status === 'running' && 'bg-blue-500',
                          step.status === 'failed' && 'bg-red-500',
                          step.status === 'pending' && 'bg-gray-500'
                        )}></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{step.action}</p>
                        {step.error && (
                          <p className="text-xs text-red-500">{step.error}</p>
                        )}
                      </div>
                      <span className="text-xs text-text-secondary">
                        {step.endTime ? 
                          `Terminé à ${new Date(step.endTime).toLocaleTimeString()}` :
                          step.startTime ? 
                          `Démarré à ${new Date(step.startTime).toLocaleTimeString()}` :
                          'En attente'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Welcome Email',
                description: 'Envoie un email de bienvenue aux nouveaux utilisateurs',
                icon: Mail,
                category: 'Communication',
                triggers: ['user_register'],
                actions: ['email']
              },
              {
                name: 'Content Backup',
                description: 'Sauvegarde automatique du contenu',
                icon: Database,
                category: 'Maintenance',
                triggers: ['schedule'],
                actions: ['data_process', 'email']
              },
              {
                name: 'Lead Notification',
                description: 'Notifie l\'équipe quand un nouveau lead est généré',
                icon: Target,
                category: 'Sales',
                triggers: ['form_submit'],
                actions: ['notification', 'email']
              }
            ].map((template, index) => (
              <div key={index} className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <template.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{template.name}</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-4">{template.description}</p>
                <button className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  Utiliser ce template
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Globale</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Workflows actifs</span>
                  <span className="text-2xl font-bold text-primary">
                    {workflows.filter(w => w.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Exécutions aujourd'hui</span>
                  <span className="text-2xl font-bold text-green-500">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Taux de succès</span>
                  <span className="text-2xl font-bold text-blue-500">96.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Temps moyen d'exécution</span>
                  <span className="text-2xl font-bold text-purple-500">3.2s</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Workflows les plus utilisés</h3>
              <div className="space-y-3">
                {workflows
                  .sort((a, b) => b.metrics.totalRuns - a.metrics.totalRuns)
                  .slice(0, 5)
                  .map(workflow => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">{workflow.name}</p>
                        <p className="text-sm text-text-secondary">{workflow.metrics.totalRuns} exécutions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-500">{workflow.metrics.successRate}%</p>
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
