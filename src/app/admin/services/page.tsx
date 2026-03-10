'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Briefcase, 
  DollarSign, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Star,
  Clock
} from 'lucide-react'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import AdminFilters from '@/components/admin/premium/AdminFilters'
import ConfirmModal from '@/components/admin/premium/ConfirmModal'

interface Service {
  id: number
  title: string
  slug: string
  short_description: string
  full_description: string
  icon: string
  deliverables: string[]
  pricing: {
    min?: number
    max?: number
    currency?: string
    type?: 'fixed' | 'hourly' | 'project'
  }
  order_index: number
  created_at: string
  updated_at: string
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; serviceId: number | null; serviceName: string }>({
    isOpen: false,
    serviceId: null,
    serviceName: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (serviceData: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          ...serviceData,
          order_index: services.length
        })

      if (error) throw error

      await fetchServices()
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const handleUpdateService = async (id: number, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      await fetchServices()
      setEditingService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const handleDeleteService = async (id: number) => {
    const service = services.find(s => s.id === id)
    setDeleteModal({
      isOpen: true,
      serviceId: id,
      serviceName: service?.title || 'Ce service'
    })
  }

  const confirmDelete = async () => {
    if (!deleteModal.serviceId) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', deleteModal.serviceId)

      if (error) throw error

      await fetchServices()
      setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' })
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (pricing: Service['pricing']) => {
    if (!pricing) return 'Sur devis'
    if (typeof pricing === 'number') return `${pricing}€`
    if (typeof pricing === 'object' && pricing.min && pricing.max) {
      return `À partir de ${pricing.min}€`
    }
    return 'Sur devis'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des services...</p>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gestion des Services"
          description="Créez, modifiez et gérez vos services professionnels"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Services", href: "/admin/services" }
          ]}
          actions={
            <Link
              href="/admin/services/new"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un service
            </Link>
          }
        />
      }
    >
      {/* Filters */}
      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            type: 'select',
            placeholder: 'Toutes les catégories',
            value: '',
            onChange: (value) => {},
            options: [
              { value: '', label: 'Toutes les catégories' },
              { value: 'consulting', label: 'Consulting' },
              { value: 'development', label: 'Développement' },
              { value: 'design', label: 'Design' }
            ]
          },
          {
            type: 'select',
            placeholder: 'Tous les prix',
            value: '',
            onChange: (value) => {},
            options: [
              { value: '', label: 'Tous les prix' },
              { value: 'fixed', label: 'Prix fixe' },
              { value: 'hourly', label: 'Tarif horaire' },
              { value: 'project', label: 'Par projet' }
            ]
          }
        ]}
        resultsCount={filteredServices.length}
        resultsLabel="service(s)"
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-surface rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary">{service.title}</h3>
                  <p className="text-sm text-text-secondary">Service #{service.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="p-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Description</h4>
                <p className="text-sm text-text-secondary line-clamp-3">
                  {service.short_description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Tarification</h4>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {formatPrice(service.pricing)}
                  </span>
                  {service.pricing?.type && (
                    <span className="text-xs text-text-muted">
                      {service.pricing.type === 'fixed' ? 'Fixe' : service.pricing.type === 'hourly' ? 'Horaire' : 'Projet'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Livraison</h4>
                <div className="flex flex-wrap gap-2">
                  {service.deliverables?.slice(0, 3).map((deliverable, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-surface-elevated text-text-primary rounded-full text-xs"
                    >
                      {deliverable}
                    </span>
                  ))}
                  {service.deliverables && service.deliverables.length > 3 && (
                    <span className="px-2 py-1 bg-surface-elevated text-text-primary rounded-full text-xs">
                      +{service.deliverables.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <span className="text-xs text-text-secondary">
                  Créé le {new Date(service.created_at).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex items-center gap-2">
                  {/* {service.featured && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                      <Star className="w-3 h-3 inline mr-1" />
                      En vedette
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Aucun service</h3>
          <p className="text-text-secondary mb-4">
            Commencez par ajouter vos premiers services professionnels
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ajouter un service
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, serviceId: null, serviceName: '' })}
        onConfirm={confirmDelete}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteModal.serviceName}" ? Cette action est irréversible.`}
        itemName={deleteModal.serviceName}
        type="delete"
      />

      {/* Create/Edit Modal */}
      {(showCreateModal || editingService) && (
        <ServiceModal
          service={editingService}
          onSave={editingService ? 
            (data) => handleUpdateService(editingService.id, data) : 
            handleCreateService
          }
          onClose={() => {
            setShowCreateModal(false)
            setEditingService(null)
          }}
        />
      )}
    </PageLayout>
  )
}

// Service Modal Component
interface ServiceModalProps {
  service: Service | null
  onSave: (service: Partial<Service>) => void
  onClose: () => void
}

function ServiceModal({ service, onSave, onClose }: ServiceModalProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    short_description: '',
    full_description: '',
    icon: '',
    deliverables: [],
    pricing: null,
    order_index: 0
  })

  useEffect(() => {
    if (service) {
      setFormData(prev => ({ ...prev, ...service }))
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {service ? 'Modifier le service' : 'Ajouter un service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Titre du service
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description courte
            </label>
            <textarea
              required
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description complète
            </label>
            <textarea
              required
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Icône
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Briefcase, Code, Design, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tarification (JSON)
            </label>
            <textarea
              value={formData.pricing ? JSON.stringify(formData.pricing, null, 2) : ''}
              onChange={(e) => {
                try {
                  const pricing = e.target.value ? JSON.parse(e.target.value) : null
                  setFormData({ ...formData, pricing })
                } catch (error) {
                  console.error('Invalid JSON:', error)
                }
              }}
              rows={3}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder='{"min": 500, "max": 2000} ou {"type": "fixed", "amount": 1000}'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Livrables (un par ligne)
            </label>
            <textarea
              value={formData.deliverables?.join('\n') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                deliverables: e.target.value.split('\n').filter(item => item.trim())
              })}
              rows={4}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Design responsive&#10;Intégration API&#10;Déploiement&#10;Documentation"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {service ? 'Mettre à jour' : 'Créer'} le service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Service Modal Component
interface ServiceModalProps {
  service: Service | null
  onSave: (service: Partial<Service>) => void
  onClose: () => void
}

function ServiceModal({ service, onSave, onClose }: ServiceModalProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    short_description: '',
    full_description: '',
    icon: '',
    deliverables: [],
    pricing: null,
    order_index: 0
  })

  useEffect(() => {
    if (service) {
      setFormData(prev => ({ ...prev, ...service }))
    }
  }, [service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {service ? 'Modifier le service' : 'Ajouter un service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-light rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Titre du service
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description courte
            </label>
            <textarea
              required
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description complète
            </label>
            <textarea
              required
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Icône
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Briefcase, Code, Design, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tarification (JSON)
            </label>
            <textarea
              value={formData.pricing ? JSON.stringify(formData.pricing, null, 2) : ''}
              onChange={(e) => {
                try {
                  const pricing = e.target.value ? JSON.parse(e.target.value) : null
                  setFormData({ ...formData, pricing })
                } catch (error) {
                  console.error('Invalid JSON:', error)
                }
              }}
              rows={3}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder='{"min": 500, "max": 2000} ou {"type": "fixed", "amount": 1000}'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Livrables (un par ligne)
            </label>
            <textarea
              value={formData.deliverables?.join('\n') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                deliverables: e.target.value.split('\n').filter(item => item.trim())
              })}
              rows={4}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Design responsive&#10;Intégration API&#10;Déploiement&#10;Documentation"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-light transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {service ? 'Mettre à jour' : 'Créer'} le service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
