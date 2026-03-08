// Page admin profil étendu - Système industriel complet adapté au thème existant
// Version professionnelle respectant la charte graphique du système

'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import { supabase } from '@/lib/supabase'
import { User, Search, Save, Briefcase, Mail, FileText, Camera, Upload, Eye, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ExtendedProfileData, DEFAULT_PROFILE_DATA } from '@/types/profile'
import { FormField } from '@/components/admin/profile/FormField'
import { ProfileIdentitySection } from '@/components/admin/profile/ProfileIdentitySection'
import { PageHeader } from '@/components/admin/premium/PageHeader'
import { PageTabs } from '@/components/admin/premium/PageTabs'
import { PageLayout } from '@/components/admin/premium/PageLayout'

interface SkillsConfig {
  [category: string]: {
    title: string
    skills: string[]
    icon: string
    level: 'expert' | 'advanced' | 'intermediate'
  }
}

interface ProfileData {
  full_name: string
  title: string
  bio: string
  profile_image_url: string | null
  email?: string
  display_name?: string
  hero_title?: string
  hero_subtitle?: string
  seo_title?: string
  seo_description?: string
  skills_config?: SkillsConfig
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Partial<ExtendedProfileData>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [activeSection, setActiveSection] = useState<string>('basic')
  const [bucketName, setBucketName] = useState<string>('')

  useEffect(() => {
    fetchProfile()
    checkStorageBucket()
  }, [])

  // Vérifier si le bucket existe
  const checkStorageBucket = async () => {
    try {
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
      // D'abord vérifier si des données existent
      const { data: existingData, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (checkError) {
        console.error('❌ Erreur vérification table:', checkError)
        setError('Erreur de connexion à la base de données')
        return
      }

      console.log('🔍 Données existantes:', existingData?.length || 0, 'enregistrements')

      // Si pas de données, créer un profil par défaut
      if (!existingData || existingData.length === 0) {
        console.log('📝 Aucun profil trouvé, création du profil par défaut...')
        
        const defaultProfile = {
          full_name: 'Ibrahim FORGO',
          title: 'Ingénieur Réseaux & Système',
          bio: 'Ingénieur spécialisé en réseaux, télécommunications et développement full-stack.',
          profile_image_url: null,
          email: 'ibrahimforgo59@gmail.com',
          display_name: 'Ibrahim FORGO',
          hero_title: 'Ingénieur Réseaux & Système',
          hero_subtitle: 'Conception, Automatisation, Infrastructure'
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single()

        if (insertError) {
          console.error('❌ Erreur création profil:', insertError)
          setError('Erreur lors de la création du profil')
          return
        }

        console.log('✅ Profil par défaut créé')
        setProfileData(defaultProfile)
      } else {
        // Test brut sans filtre pour diagnostic
        console.log("🔍 Admin - Test brut - Variables d'environnement:")
        console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Présente" : "Manquante")
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')

        console.log("ADMIN DATA BRUT:", data)
        console.log("ADMIN ERROR BRUT:", error)
        
        if (error) {
          console.error('❌ Erreur même sans filtre dans admin:', error)
          setError('Erreur fondamentale Supabase dans admin')
          return
        }
        
        if (!data || data.length === 0) {
          console.log('ℹ️ Admin - Table vide - Création profil...')
          // Créer un profil par défaut avec les données étendues
          const defaultProfile = {
            ...DEFAULT_PROFILE_DATA,
            full_name: 'Ibrahim FORGO',
            title: 'Ingénieur Réseaux & Développeur Junior',
            bio: 'Expert en infrastructure réseaux et développement d\'applications modernes.',
            profile_image_url: null,
            email: 'ibrahimforgo59@gmail.com'
          }

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile)
            .select()
            .single()

          if (insertError) {
            console.error('❌ Erreur création profil admin:', insertError)
            setError('Erreur lors de la création du profil')
            return
          }

          console.log('✅ Profil par défaut créé dans admin')
          setProfileData(defaultProfile)
        } else {
          console.log('✅ Admin - Données trouvées:', data.length, 'enregistrements')
          
          // Utiliser le premier profil disponible au lieu de chercher par email
          if (data && data.length > 0) {
            console.log('✅ Admin - Utilisation du premier profil disponible:', data[0])
            setProfileData({
              full_name: data[0].full_name || '',
              title: data[0].title || '',
              bio: data[0].bio || '',
              profile_image_url: data[0].profile_image_url,
              email: data[0].email || '',
              display_name: data[0].display_name || '',
              hero_title: data[0].hero_title || '',
              hero_subtitle: data[0].hero_subtitle || ''
            })
          } else {
            console.log('❌ Admin - Aucun profil trouvé dans la table')
            setError('Aucun profil disponible')
            return
          }
        }
      }
    } catch (err) {
      console.error('❌ Erreur fetch profil:', err)
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string | null | undefined) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      const fileExt = file.name.split('.').pop()
      const fileName = `profile-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Erreur upload Supabase:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)

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

  const saveProfile = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Récupérer l'ID du profil existant
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single()

      if (!existingProfile) {
        setError('Aucun profil trouvé à mettre à jour')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)

      if (error) {
        console.error('Erreur sauvegarde:', error)
        setError('Erreur lors de la sauvegarde: ' + error.message)
        return
      }

      setSuccess('Profil sauvegardé avec succès !')
      setTimeout(() => setSuccess(''), 3000)
      
      // Forcer le rechargement du profil sur toutes les pages
      if (typeof window !== 'undefined' && (window as Window & { refetchProfile?: () => void }).refetchProfile) {
        ;(window as Window & { refetchProfile?: () => void }).refetchProfile()
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'basic', title: 'Informations de base', icon: User },
    { id: 'seo', title: 'SEO', icon: Search }
  ]

  return (
    <PageLayout
      header={
        <PageHeader
          title="Gérer le profil"
          description="Modifiez vos informations personnelles et professionnelles"
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Profil", href: "/admin/profile" }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          }
        />
      }
      tabs={
        <PageTabs
          tabs={[
            {
              id: 'basic',
              label: 'Informations de base',
              content: (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2 mb-6">
                      <User className="w-5 h-5" />
                      Informations personnelles
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder-text-secondary"
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
                          className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder-text-secondary"
                          placeholder="Ex: Ingénieur Réseaux & Développeur"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-text-primary placeholder-text-secondary"
                        placeholder="votre.email@example.com"
                      />
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Biographie
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none text-text-primary placeholder-text-secondary"
                        placeholder="Parlez-vous brièvement..."
                      />
                    </div>
                  </div>

                  {/* Photo de profil */}
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2 mb-6">
                      <Camera className="w-5 h-5" />
                      Photo de profil
                    </h2>
                    
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {profileData.profile_image_url ? (
                          <Image
                            src={profileData.profile_image_url}
                            alt="Photo de profil"
                            width={128}
                            height={128}
                            className="rounded-full object-cover border-4 border-primary/20"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-surface-elevated border-4 border-gray-700 flex items-center justify-center">
                            <User className="w-12 h-12 text-text-secondary" />
                          </div>
                        )}
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary-hover transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      <div>
                        <label className="cursor-pointer">
                          <div className="flex items-center space-x-2 px-4 py-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-surface border border-border transition-colors">
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Téléchargement...' : 'Choisir une image'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        <p className="text-xs text-text-secondary mt-2">
                          Formats: JPG, PNG, WEBP (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'identity',
              label: 'Identité visuelle',
              content: (
                <ProfileIdentitySection
                  profileData={profileData}
                  onChange={handleInputChange}
                  errors={errors}
                />
              )
            },
            {
              id: 'seo',
              label: 'SEO',
              content: (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2 mb-6">
                    <Search className="w-5 h-5" />
                    Configuration SEO
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                      label="Titre SEO"
                      value={profileData.seo_title || ''}
                      onChange={(value) => handleInputChange('seo_title', value)}
                      placeholder="Titre optimisé pour les moteurs de recherche"
                      icon={<Search className="w-4 h-4" />}
                      helper="Titre qui apparaît dans les résultats de recherche"
                      error={errors['seo_title']}
                    />
                    <FormField
                      label="Description SEO"
                      value={profileData.seo_description || ''}
                      onChange={(value) => handleInputChange('seo_description', value)}
                      placeholder="Description optimisée pour les moteurs de recherche"
                      type="textarea"
                      icon={<Search className="w-4 h-4" />}
                      helper="Description qui apparaît dans les résultats de recherche"
                      error={errors['seo_description']}
                    />
                  </div>
                </div>
              )
            }
          ]}
          defaultTab="basic"
        />
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </PageLayout>
  )
}
