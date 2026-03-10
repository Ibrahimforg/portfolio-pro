'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Mail, 
  ArrowLeft,
  User,
  Phone,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageLayout } from '@/components/admin/premium/PageLayout'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  message: string
  created_at: string
  read: boolean
}

export default function ContactDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchContact(params.id as string)
    }
  }, [params.id])

  const fetchContact = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (error) throw error
      setContact(data)
    } catch (error) {
      console.error('Error fetching contact:', error)
    }
  }

  const handleMarkAsRead = async () => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', parseInt(params.id as string))

      if (error) throw error

      setContact(prev => prev ? { ...prev, read: true } : null)
    } catch (error) {
      console.error('Error marking contact as read:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', parseInt(params.id as string))

      if (error) throw error

      router.push('/admin/contacts')
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  if (!contact) {
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
          title="Détails du Contact"
          subtitle={`Message de : ${contact.name}`}
          icon={<MessageSquare className="w-6 h-6" />}
          breadcrumbs={[
            { label: 'Admin', href: '/admin' },
            { label: 'Contacts', href: '/admin/contacts' },
            { label: 'Détails', href: `/admin/contacts/${params.id}` }
          ]}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Nom</p>
                      <p className="text-gray-600">{contact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-gray-500" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Reçu le : {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.read ? 'Lu' : 'Non lu'}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleMarkAsRead}
                    disabled={contact.read}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Marquer comme lu
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link
                href="/admin/contacts"
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la liste
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
