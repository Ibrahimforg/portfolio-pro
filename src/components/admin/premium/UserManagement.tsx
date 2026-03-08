'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  Clock,
  Activity,
  Mail,
  UserCheck,
  UserX,
  Settings,
  Bell,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  User,
  Crown,
  Briefcase,
  FileText,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  lastLogin?: string
  createdAt: string
  permissions: string[]
  sessions: UserSession[]
  twoFactorEnabled: boolean
  emailVerified: boolean
  metadata: {
    department?: string
    location?: string
    phone?: string
  }
}

interface UserSession {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  createdAt: string
  isActive: boolean
  lastActivity: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
}

interface Role {
  id: string
  name: string
  description: string
  level: number
  permissions: string[]
  color: string
  icon: any
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'sessions'>('users')

  useEffect(() => {
    // Simulation des données
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@portfolio.com',
        name: 'John Doe',
        role: 'super_admin',
        status: 'active',
        lastLogin: '2024-03-08T10:30:00Z',
        createdAt: '2024-01-15T09:00:00Z',
        permissions: ['*'],
        twoFactorEnabled: true,
        emailVerified: true,
        sessions: [
          {
            id: 's1',
            device: 'Chrome on Windows',
            browser: 'Chrome 120.0',
            ip: '192.168.1.100',
            location: 'Paris, France',
            createdAt: '2024-03-08T08:00:00Z',
            isActive: true,
            lastActivity: '2024-03-08T10:30:00Z'
          }
        ],
        metadata: {
          department: 'IT',
          location: 'Paris',
          phone: '+33 1 23 45 67 89'
        }
      },
      {
        id: '2',
        email: 'editor@portfolio.com',
        name: 'Jane Smith',
        role: 'editor',
        status: 'active',
        lastLogin: '2024-03-07T15:45:00Z',
        createdAt: '2024-02-01T14:30:00Z',
        permissions: ['content:read', 'content:write', 'media:read', 'media:write'],
        twoFactorEnabled: false,
        emailVerified: true,
        sessions: [
          {
            id: 's2',
            device: 'Safari on iPhone',
            browser: 'Safari 17.0',
            ip: '192.168.1.101',
            location: 'Lyon, France',
            createdAt: '2024-03-07T14:00:00Z',
            isActive: false,
            lastActivity: '2024-03-07T15:45:00Z'
          }
        ],
        metadata: {
          department: 'Content',
          location: 'Lyon'
        }
      }
    ]

    const mockRoles: Role[] = [
      {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Accès complet à toutes les fonctionnalités',
        level: 100,
        permissions: ['*'],
        color: 'bg-red-500',
        icon: Crown
      },
      {
        id: 'admin',
        name: 'Admin',
        description: 'Gestion complète sauf utilisateurs',
        level: 75,
        permissions: ['content:*', 'media:*', 'analytics:*', 'settings:read'],
        color: 'bg-orange-500',
        icon: Shield
      },
      {
        id: 'editor',
        name: 'Éditeur',
        description: 'Gestion du contenu et médias',
        level: 50,
        permissions: ['content:read', 'content:write', 'media:read', 'media:write'],
        color: 'bg-blue-500',
        icon: Edit
      },
      {
        id: 'viewer',
        name: 'Lecteur',
        description: 'Lecture seule',
        level: 25,
        permissions: ['content:read', 'media:read'],
        color: 'bg-gray-500',
        icon: Eye
      }
    ]

    const mockPermissions: Permission[] = [
      { id: 'content:read', name: 'Lire le contenu', description: 'Voir les pages et articles', category: 'Contenu', resource: 'content', action: 'read' },
      { id: 'content:write', name: 'Écrire le contenu', description: 'Créer et modifier le contenu', category: 'Contenu', resource: 'content', action: 'write' },
      { id: 'content:delete', name: 'Supprimer le contenu', description: 'Supprimer pages et articles', category: 'Contenu', resource: 'content', action: 'delete' },
      { id: 'users:read', name: 'Voir les utilisateurs', description: 'Lister les utilisateurs', category: 'Utilisateurs', resource: 'users', action: 'read' },
      { id: 'users:write', name: 'Gérer les utilisateurs', description: 'Créer et modifier les utilisateurs', category: 'Utilisateurs', resource: 'users', action: 'write' },
      { id: 'analytics:read', name: 'Voir les analytics', description: 'Accéder aux statistiques', category: 'Analytics', resource: 'analytics', action: 'read' }
    ]

    setUsers(mockUsers)
    setRoles(mockRoles)
    setPermissions(mockPermissions)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleInfo = (roleId: string) => roles.find(role => role.id === roleId)

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) return Smartphone
    if (device.includes('iPad') || device.includes('Tablet')) return Tablet
    return Monitor
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10'
      case 'inactive': return 'text-gray-500 bg-gray-500/10'
      case 'suspended': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const UserCard = ({ user }: { user: User }) => {
    const roleInfo = getRoleInfo(user.role)
    const RoleIcon = roleInfo?.icon || User

    return (
      <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{user.name}</h3>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              getStatusColor(user.status)
            )}>
              {user.status === 'active' && 'Actif'}
              {user.status === 'inactive' && 'Inactif'}
              {user.status === 'suspended' && 'Suspendu'}
            </span>
            <button
              onClick={() => setSelectedUser(user)}
              className="p-1 text-text-secondary hover:text-text-primary"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <RoleIcon className="w-4 h-4 text-primary" />
            <span className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              roleInfo?.color || "bg-gray-500",
              "text-white"
            )}>
              {roleInfo?.name || user.role}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {user.lastLogin ? 
                new Date(user.lastLogin).toLocaleDateString() : 
                'Jamais'
              }
            </div>
            <div className="flex items-center gap-1">
              {user.twoFactorEnabled ? (
                <Shield className="w-3 h-3 text-green-500" />
              ) : (
                <Shield className="w-3 h-3 text-gray-400" />
              )}
              2FA
            </div>
            <div className="flex items-center gap-1">
              {user.emailVerified ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              Email
            </div>
          </div>

          {user.metadata.department && (
            <div className="text-sm text-text-secondary">
              <span className="font-medium">Département:</span> {user.metadata.department}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <button className="flex-1 px-3 py-1 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm">
              <Eye className="w-3 h-3 inline mr-1" />
              Voir
            </button>
            <button className="flex-1 px-3 py-1 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface text-sm">
              <Edit className="w-3 h-3 inline mr-1" />
              Modifier
            </button>
            <button className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
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
            <h1 className="text-3xl font-bold text-text-primary">Gestion des Utilisateurs</h1>
            <p className="text-text-secondary mt-1">Gestion complète des accès et permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel utilisateur
            </button>
            <button className="px-4 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface rounded-lg w-fit mb-6">
          {[
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'roles', label: 'Rôles', icon: Shield },
            { id: 'permissions', label: 'Permissions', icon: Key },
            { id: 'sessions', label: 'Sessions', icon: Activity }
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
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
          >
            <option value="all">Tous les rôles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map(role => {
              const RoleIcon = role.icon
              const usersInRole = users.filter(user => user.role === role.id).length
              
              return (
                <div key={role.id} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white",
                        role.color
                      )}>
                        <RoleIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{role.name}</h3>
                        <p className="text-sm text-text-secondary">{role.description}</p>
                      </div>
                    </div>
                    <button className="p-1 text-text-secondary hover:text-text-primary">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Niveau d'accès</span>
                      <span className="font-medium text-text-primary">{role.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Utilisateurs</span>
                      <span className="font-medium text-text-primary">{usersInRole}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Permissions</span>
                      <span className="font-medium text-text-primary">
                        {role.permissions.includes('*') ? 'Toutes' : role.permissions.length}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Permissions principales:</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map(perm => (
                        <span key={perm} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {perm === '*' ? 'Toutes' : perm}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-500 text-xs rounded">
                          +{role.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-elevated">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Ressource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissions.map(permission => (
                  <tr key={permission.id} className="hover:bg-surface-elevated">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {permission.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {permission.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {permission.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {permission.resource}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {permission.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {users.map(user => (
              <div key={user.id} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">{user.name}</h3>
                  <span className="text-sm text-text-secondary">
                    {user.sessions.filter(s => s.isActive).length} session(s) active(s)
                  </span>
                </div>
                <div className="space-y-3">
                  {user.sessions.map(session => {
                    const DeviceIcon = getDeviceIcon(session.device)
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                        <div className="flex items-center gap-3">
                          <DeviceIcon className="w-5 h-5 text-text-tertiary" />
                          <div>
                            <p className="text-sm font-medium text-text-primary">{session.device}</p>
                            <p className="text-xs text-text-secondary">
                              {session.ip} • {session.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {session.isActive && (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            )}
                            <span className="text-sm text-text-secondary">
                              {new Date(session.lastActivity).toLocaleString()}
                            </span>
                          </div>
                          <button className="text-xs text-red-500 hover:text-red-400 mt-1">
                            {session.isActive ? 'Terminer' : 'Détails'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
