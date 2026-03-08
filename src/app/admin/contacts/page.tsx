'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Mail, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Reply,
  X
} from 'lucide-react'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import { PageHeader } from '@/components/admin/premium/PageHeader'

interface Contact {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function ContactsManagement() {
  // const { user } = useAuth()
  const router = useRouter()
  
  // Simulation temporaire
  const user = useMemo(() => ({ email: 'admin@example.com' }), [])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/admin')
      return
    }

    fetchContacts()
  }, [user, router])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Si la table n'existe pas, utiliser des données simulées
        if (error.message.includes('does not exist') || error.code === 'PGRST116') {
          setContacts([])
          return
        }
        throw error
      }
      setContacts(data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
      // En cas d'erreur, utiliser des données simulées pour éviter le crash
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', id)

      if (error) {
        console.warn('Erreur Supabase markAsRead:', error)
        
        // Mettre à jour l'état local même si la BDD échoue
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, read: true } : contact
        ))
        return
      }
      
      // Mettre à jour l'état local si succès
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, read: true } : contact
      ))
    } catch (error) {
      console.error('Error marking as read:', error instanceof Error ? error.message : 'Erreur inconnue')
      
      // En cas d'erreur, quand même mettre à jour l'état local pour éviter le crash
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, read: true } : contact
      ))
    }
  }

  const deleteContact = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) {
        // Si la table n'existe pas, juste mettre à jour l'état local
        if (error.message.includes('does not exist') || error.code === 'PGRST116') {
          setContacts(contacts.filter(c => c.id !== id))
          if (selectedContact?.id === id) {
            setSelectedContact(null)
          }
          return
        }
        throw error
      }
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      // En cas d'erreur, quand même mettre à jour l'état local pour éviter le crash
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
      alert('Erreur lors de la suppression du message')
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'read' && contact.read) ||
                         (filterStatus === 'unread' && !contact.read)
    
    return matchesSearch && matchesStatus
  })

  const unreadCount = contacts.filter(c => !c.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Messages de contact"
          description="Consultez et gérez les messages de contact reçus"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Messages', href: '/admin/contacts' }
          ]}
          actions={
            unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )
          }
        />
      }
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Rechercher un message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field pl-10 appearance-none"
                  >
                    <option value="">Tous les messages</option>
                    <option value="unread">Non lus</option>
                    <option value="read">Lus</option>
                  </select>
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-text-secondary">
                    {filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-3">
              {filteredContacts.length === 0 ? (
                <div className="card text-center py-12">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
                  <p className="text-text-secondary">
                    {searchTerm || filterStatus 
                      ? 'Aucun message trouvé' 
                      : 'Aucun message pour le moment'}
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`card cursor-pointer transition-all duration-300 ${
                      selectedContact?.id === contact.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/20'
                    } ${!contact.read ? 'border-l-4 border-l-primary' : ''}`}
                    onClick={() => {
                      setSelectedContact(contact)
                      if (!contact.read) {
                        markAsRead(contact.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            contact.read ? 'bg-gray-500' : 'bg-primary'
                          }`} />
                          <h3 className="font-semibold">{contact.name}</h3>
                          <span className="text-sm text-text-secondary">{contact.email}</span>
                          {!contact.read && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              Nouveau
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-primary mb-2">{contact.subject}</h4>
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {contact.message}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`mailto:${contact.email}?subject=${encodeURIComponent(contact.subject)}`, '_blank')
                          }}
                          className="p-2 text-text-secondary hover:text-primary transition-colors"
                          title="Répondre par email"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteContact(contact.id)
                          }}
                          className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Detail */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <div className="card sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Détails du message</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Sender Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {selectedContact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedContact.name}</h3>
                        <p className="text-sm text-text-secondary">{selectedContact.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedContact.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-text-secondary">Statut:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedContact.read 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {selectedContact.read ? 'Lu' : 'Non lu'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h4 className="font-semibold mb-2">Sujet</h4>
                    <p className="text-primary">{selectedContact.subject}</p>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <div className="p-4 bg-surface-elevated rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open(`mailto:${selectedContact.email}?subject=${encodeURIComponent(selectedContact.subject)}`, '_blank')}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Reply className="w-5 h-5" />
                      Répondre par email
                    </button>
                    
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                      Supprimer le message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Mail className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
                <p className="text-text-secondary">
                  Sélectionnez un message pour voir les détails
                </p>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
  )
}
