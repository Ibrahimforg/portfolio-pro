'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Save, 
  ArrowLeft,
  Edit,
  Trash2,
  Briefcase
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  price: string
  duration: string
  featured: boolean
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Briefcase',
    price: '',
    duration: '',
    featured: false
  })

  useEffect(() => {
    if (params.id) {
      fetchService(params.id as string)
    }
  }, [params.id])

  const fetchService = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (error) throw error
      setService(data)
      setFormData(data || {})
    } catch (error) {
      console.error('Error fetching service:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('services')
        .update(formData)
        .eq('id', parseInt(params.id as string))

      if (error) throw error

      router.push('/admin/services')
    } catch (error) {
      console.error('Error updating service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    field: keyof Partial<Service>,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', parseInt(params.id as string))

      if (error) throw error

      router.push('/admin/services')
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  if (!service) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          title="Modifier le Service"
          subtitle={`Modifier : ${service.title}`}
          icon={<Briefcase className="w-6 h-6" />}
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Services', href: '/admin/services' },
            { label: 'Modifier', href: `/admin/services/${params.id}` }
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du service *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Développement Web Full-Stack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 500€/jour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 2 semaines, 1 mois"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icône
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Briefcase">Briefcase</option>
                  <option value="Star">Star</option>
                  <option value="Code">Code</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez en détail ce service, les livrables, et la valeur ajoutée..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Service en vedette
              </label>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <Link
                  href="/admin/services"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Annuler
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
