'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react'
import { DownloadIcon } from '@/components/ui/PWAManager'
import { supabase } from '@/lib/supabase'
import { PageLayout } from '@/components/admin/premium/PageLayout'
import { PageHeader } from '@/components/admin/premium/PageHeader'

interface CVFile {
  id: string
  name: string
  url: string
  size: number
  created_at: string
}

export default function CVManagement() {
  const [cvFile, setCvFile] = useState<CVFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadCurrentCV()
  }, [])

  // Charger le CV actuel depuis Supabase
  const loadCurrentCV = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('documents')
        .list('cv', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) throw error

      if (data && data.length > 0) {
        const file = data[0]
        if (!file) return;
        const fileName = file?.name || ''
        const { data: { publicUrl } } = await supabase
          .storage
          .from('documents')
          .getPublicUrl(`cv/${fileName}`)

        setCvFile({
          id: file.id,
          name: fileName,
          url: publicUrl,
          size: file?.metadata?.size || 0,
          created_at: file.created_at
        })
      }
    } catch (err) {
      console.error('Erreur lors du chargement du CV:', err)
    }
  }

  // Uploader un nouveau CV
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier que c'est un PDF
    if (file.type !== 'application/pdf') {
      setError('Veuillez sélectionner un fichier PDF')
      return
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 10MB')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // Supprimer l'ancien CV s'il existe
      if (cvFile) {
        await supabase.storage.from('documents').remove([`cv/${cvFile.name}`])
      }

      // Uploader le nouveau CV
      const fileName = `cv-${Date.now()}.pdf`
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`cv/${fileName}`, file, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (error) throw error

      // Mettre à jour l'état
      const { data: { publicUrl } } = supabase
        .storage
        .from('documents')
        .getPublicUrl(`cv/${fileName}`)

      setCvFile({
        id: data.id,
        name: fileName,
        url: publicUrl,
        size: file.size,
        created_at: new Date().toISOString()
      })

      setSuccess('CV uploadé avec succès !')
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err)
      setError('Erreur lors de l\'upload du CV')
    } finally {
      setUploading(false)
    }
  }

  // Supprimer le CV actuel
  const handleDelete = async () => {
    if (!cvFile) return

    try {
      await supabase.storage.from('documents').remove([`cv/${cvFile.name}`])
      setCvFile(null)
      setSuccess('CV supprimé avec succès')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      setError('Erreur lors de la suppression du CV')
    }
  }

  // Formater la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Charger le CV au montage du composant
  useState(() => {
    loadCurrentCV()
  })

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gestion du CV"
          description="Téléchargez et gérez votre CV professionnel"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'CV', href: '/admin/cv' }
          ]}
        />
      }
    >
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Gestion du CV
          </h2>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Upload votre CV
          </h3>
          <p className="text-text-secondary mb-4">
            Format PDF uniquement - Maximum 10MB
          </p>
          
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? 'Upload en cours...' : 'Choisir un fichier'}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* CV Actuel */}
        {cvFile && (
          <div className="mt-6 p-4 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h4 className="font-medium text-text-primary">{cvFile.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {formatFileSize(cvFile.size)} • 
                    {new Date(cvFile.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={cvFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Voir
                </a>
                
                <button
                  onClick={handleDelete}
                  className="btn-secondary text-red-400 hover:text-red-300 inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Instructions</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload votre CV au format PDF</li>
            <li>• Le CV sera automatiquement disponible sur votre portfolio</li>
            <li>• Vous pouvez remplacer le CV à tout moment</li>
            <li>• L&apos;ancien CV sera automatiquement supprimé</li>
          </ul>
        </div>
      </div>
      </div>
      </PageLayout>
  )
}
