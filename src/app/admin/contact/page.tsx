'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  Trash2,
  Reply,
  Archive,
  Star
} from 'lucide-react'

interface ContactSubmission {
  id: number
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  budget?: string
  timeline?: string
  status: 'pending' | 'in_progress' | 'completed' | 'archived'
  read: boolean
  created_at: string
  updated_at: string
}

export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: ContactSubmission['status']) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status, read: true })
        .eq('id', id)

      if (error) throw error
      
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, status, read: true } : s)
      )
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteSubmission = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setSubmissions(prev => prev.filter(s => s.id !== id))
      setSelectedSubmission(null)
    } catch (error) {
      console.error('Error deleting submission:', error)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      
      setSubmissions(prev => 
        prev.map(s => s.id === id ? { ...s, read: true } : s)
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-64 mb-4"></div>
            <div className="h-4 bg-surface rounded w-96 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-surface rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Gestion des Messages</h1>
          <p className="text-text-secondary">
            Consultez et gérez les messages de contact reçus
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{submissions.length}</p>
                <p className="text-sm text-text-secondary">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {submissions.filter(s => !s.read).length}
                </p>
                <p className="text-sm text-text-secondary">Non lus</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {submissions.filter(s => s.status === 'in_progress').length}
                </p>
                <p className="text-sm text-text-secondary">En cours</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {submissions.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-text-secondary">Terminés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Aucun message</h3>
            <p className="text-text-secondary">
              Aucun message de contact trouvé
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`bg-surface rounded-lg p-6 border transition-all hover:shadow-md ${
                  !submission.read ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {submission.name}
                      </h3>
                      {!submission.read && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Nouveau
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.status === 'pending' ? 'En attente' :
                         submission.status === 'in_progress' ? 'En cours' :
                         submission.status === 'completed' ? 'Terminé' : 'Archivé'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-2">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </span>
                      {submission.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {submission.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-text-primary font-medium mb-2">{submission.subject}</p>
                    <p className="text-text-secondary line-clamp-2">{submission.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission)
                        markAsRead(submission.id)
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-text-primary">Détails du message</h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 hover:bg-surface-light rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Informations de contact</h4>
                  <div className="space-y-2">
                    <p><strong>Nom:</strong> {selectedSubmission.name}</p>
                    <p><strong>Email:</strong> {selectedSubmission.email}</p>
                    {selectedSubmission.phone && <p><strong>Téléphone:</strong> {selectedSubmission.phone}</p>}
                    {selectedSubmission.company && <p><strong>Entreprise:</strong> {selectedSubmission.company}</p>}
                    {selectedSubmission.budget && <p><strong>Budget:</strong> {selectedSubmission.budget}</p>}
                    {selectedSubmission.timeline && <p><strong>Délai:</strong> {selectedSubmission.timeline}</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-text-primary mb-2">Message complet</h4>
                  <p className="text-text-secondary whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <p className="text-sm text-text-muted">
                    Reçu le {formatDate(selectedSubmission.created_at)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedSubmission.id, 'in_progress')}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      En cours
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSubmission.id, 'completed')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Terminé
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSubmission.id, 'archived')}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Archiver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
