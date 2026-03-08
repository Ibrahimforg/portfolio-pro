'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Camera, Upload, Save, X, User, Mail, Briefcase, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  email?: string
}

export default function ProfileManagement() {
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    title: '',
    bio: '',
    profile_image_url: null,
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [bucketName, setBucketName] = useState<string>('')

  useEffect(() => {
    fetchProfile()
    checkStorageBucket()
  }, [])

  // Vérifier si le bucket existe
  const checkStorageBucket = async () => {
    try {
      // Utiliser le bucket profiles configuré dans SQL
      console.log('🎯 Utilisation du bucket: profiles')
      setBucketName('profiles')
      setError('')
      return
    } catch (err) {
      console.error('❌ Erreur générale:', err)
      setError('Erreur de configuration du stockage.')
    }
  }

  const fetchProfile = async () => {
    try {
      // Simpler: just get profile with id = 1
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfileData(data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err instanceof Error ? err.message : err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('Fichier sélectionné:', file.name, file.type, file.size)

    // Validation
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Upload to Supabase Storage avec le bucket profiles configuré
      const fileExt = file.name.split('.').pop()
      const fileName = `profile-${Date.now()}.${fileExt}`
      
      const targetBucket = bucketName || 'profiles'
      
      console.log('Tentative d\'upload vers bucket:', targetBucket, fileName)
      
      const { data, error: uploadError } = await supabase.storage
        .from(targetBucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Erreur upload Supabase:', uploadError)
        throw uploadError
      }

      console.log('Upload réussi, data:', data)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(targetBucket)
        .getPublicUrl(fileName)

      console.log('URL publique générée:', publicUrl)

      // Update profile data
      setProfileData(prev => ({
        ...prev,
        profile_image_url: publicUrl
      }))

      setSuccess('Image téléchargée avec succès')
    } catch (err) {
      console.error('Erreur complète lors du téléchargement:', err)
      setError('Erreur lors du téléchargement de l\'image: ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Simple: update profile with id = 1
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: 1,
          ...profileData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Détail erreur Supabase:', error)
        throw error
      }

      setSuccess('Profil mis à jour avec succès')
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
      setError('Erreur lors de la sauvegarde du profil: ' + (err instanceof Error ? err.message : 'Erreur inconnue'))
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary mt-4">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Gestion du Profil</h1>
        <p className="text-text-secondary">
          Mettez à jour vos informations personnelles et votre photo de profil
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo de profil */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Photo de profil
          </h2>
          
          <div className="card p-6">
            <div className="flex flex-col items-center space-y-4">
              {profileData.profile_image_url ? (
                <div className="relative">
                  <Image
                      src={profileData.profile_image_url}
                      alt="Photo de profil"
                      width={128}
                      height={128}
                      className="rounded-full object-cover border-4 border-primary/20"
                    />
                  <button
                    onClick={() => handleInputChange('profile_image_url', '')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-surface-elevated rounded-full flex items-center justify-center border-2 border-dashed border-border">
                  <User className="w-8 h-8 text-text-secondary" />
                </div>
              )}
              
              <div className="w-full">
                <label className="block w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Téléchargement...' : 'Choisir une image'}
                  </div>
                </label>
                <p className="text-xs text-text-secondary mt-2 text-center">
                  Formats: JPG, PNG, WEBP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations personnelles
          </h2>
          
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={profileData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Titre/Poste
              </label>
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="Ex: Ingénieur Réseaux & Développeur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profileData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="votre.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Biographie
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                placeholder="Parlez-vous brièvement..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  )
}
