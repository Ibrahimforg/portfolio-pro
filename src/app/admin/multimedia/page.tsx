'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { 
  Upload, 
  Video, 
  Music, 
  FileText, 
  Trash2, 
  Edit, 
  Eye,
  Plus,
  Search
} from 'lucide-react'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import { PageHeader } from '@/components/admin/premium/PageHeader'

interface MultimediaItem {
  id: string  // UUID
  title: string
  description: string | null
  file_type: string  // image, video, audio, document
  file_url: string
  thumbnail_url: string | null
  file_size: number  // BIGINT
  duration: number | null  // Pour vidéos en secondes
  resolution: string | null  // 1080p, 4K, etc.
  format: string | null  // mp4, webm, jpg, png, etc.
  tags: string[]
  category: string | null
  alt_text: string | null
  metadata: Record<string, unknown>  // JSONB
  featured: boolean
  published: boolean
  project_id: number | null
  skill_id: number | null
  order_index: number
  created_at: string
}

export default function MultimediaAdminPage() {
  const [multimedia, setMultimedia] = useState<MultimediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchMultimedia()
  }, [])

  const fetchMultimedia = async () => {
    try {
      const { data, error } = await supabase
        .from('multimedia')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMultimedia(data || [])
    } catch (error) {
      console.error('Error fetching multimedia:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case 'image': return <Eye className="w-8 h-8" />
    case 'video': return <Video className="w-8 h-8" />
    case 'audio': return <Music className="w-8 h-8" />
    case 'document': return <FileText className="w-8 h-8" />
    default: return <FileText className="w-8 h-8" />
  }
}

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleUpload = async (files: File[]) => {
    try {
      for (const file of files) {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('multimedia')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Storage upload error:', uploadError)
          
          // Si le bucket n'existe pas, créer un fallback
          if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
            // Mettre à jour l'état local avec une URL placeholder
            const placeholderUrl = `/uploads/${fileName}`
            const fallbackItem: MultimediaItem = {
              id: Date.now().toString(),
              title: file.name,
              description: `Fichier uploadé localement`,
              file_type: file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 
                        file.type.startsWith('audio/') ? 'audio' : 'document',
              file_url: placeholderUrl,
              thumbnail_url: null,
              file_size: file.size,
              duration: null,
              resolution: null,
              format: file.type.split('/')[1] || null,
              tags: [],
              category: null,
              alt_text: null,
              metadata: {},
              featured: false,
              published: true,
              project_id: null,
              skill_id: null,
              order_index: 0,
              created_at: new Date().toISOString()
            }
            setMultimedia(prev => [fallbackItem, ...prev])
            continue
          }
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('multimedia')
          .getPublicUrl(fileName)

        // Determine file type
        let fileType = 'document'
        if (file.type.startsWith('image/')) fileType = 'image'
        else if (file.type.startsWith('video/')) fileType = 'video'
        else if (file.type.startsWith('audio/')) fileType = 'audio'

        // Insert into database
        const { error: dbError } = await supabase
          .from('multimedia')
          .insert({
            title: file.name,
            description: `Fichier ${fileType} uploadé`,
            file_type: fileType,
            file_url: publicUrl,
            file_size: file.size,
            format: file.type.split('/')[1],
            tags: [],
            alt_text: file.name,
            metadata: { original_filename: file.name, mime_type: file.type },
            published: true
          })

        if (dbError) throw dbError
      }

      // Refresh list
      fetchMultimedia()
    } catch (error) {
      console.error('Error uploading files:', error)
      
      // Fallback local si tout échoue
      const fallbackFiles = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        title: file.name,
        description: `Fichier uploadé (mode dégradé)`,
        file_type: file.type.startsWith('image/') ? 'image' : 'document',
        file_url: URL.createObjectURL(file),
        thumbnail_url: null,
        file_size: file.size,
        duration: null,
        resolution: null,
        format: file.type.split('/')[1] || null,
        tags: [],
        category: null,
        alt_text: null,
        metadata: {},
        featured: false,
        published: true,
        project_id: null,
        skill_id: null,
        order_index: 0,
        created_at: new Date().toISOString()
      }))
      
      setMultimedia(prev => [...fallbackFiles, ...prev])
    }
  }

  const filteredMultimedia = multimedia.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.file_type === filterType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement des fichiers multimédia...</p>
        </div>
      </div>
    )
  }

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gestion Multimédia"
          description="Gérez vos images, vidéos, audio et documents"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Multimédia', href: '/admin/multimedia' }
          ]}
          actions={
            <button
              onClick={() => {
                // Handle upload modal
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un fichier
            </button>
          }
        />
      }
    >

      {/* Actions */}
      <div className="mb-8 bg-surface-light rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un fichier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMultimedia.map((item) => {
            return (
              <div key={item.id} className="bg-surface rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors">
                {/* Preview */}
                <div className="aspect-video bg-surface-light flex items-center justify-center relative">
                  {item.thumbnail_url ? (
                    <Image 
                      src={item.thumbnail_url} 
                      alt={item.alt_text || item.title || 'Multimedia'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center text-text-muted">
                      {getFileIcon(item.file_type || 'document')}
                    </div>
                  )}
                  
                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="p-2 bg-black/50 text-white rounded hover:bg-black/70 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-black/50 text-white rounded hover:bg-black/70 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-black/50 text-white rounded hover:bg-black/70 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary mb-1 truncate">{item.title || 'Sans titre'}</h3>
                  <p className="text-sm text-text-secondary mb-2 line-clamp-2">{item.description || ''}</p>
                  
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="capitalize">{item.file_type || 'document'}</span>
                    <span>{formatFileSize(item.file_size || 0)}</span>
                  </div>
                  
                  {item.duration && (
                    <div className="text-xs text-text-muted mt-1">
                      Durée: {formatDuration(item.duration)}
                    </div>
                  )}
                  
                  {item.resolution && (
                    <div className="text-xs text-text-muted">
                      Résolution: {item.resolution}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    {item.featured && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">Featured</span>
                    )}
                    {item.published && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded">Publié</span>
                    )}
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-surface-light text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-surface-light text-xs rounded">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredMultimedia.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Aucun fichier multimédia</h3>
            <p className="text-text-secondary mb-4">
              Commencez par ajouter vos premiers fichiers multimédia
            </p>
            <button
              onClick={() => {
                // Handle upload modal
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ajouter un fichier
            </button>
          </div>
        )}
      </PageLayout>
  )
}
