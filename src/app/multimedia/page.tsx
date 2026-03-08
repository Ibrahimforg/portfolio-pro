'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { supabase } from '@/lib/supabase'
import { Multimedia } from '@/types'
import { 
  Video, 
  Camera, 
  Music, 
  Film, 
  Play,
  Monitor,
  Palette,
  Mic
} from 'lucide-react'

const multimediaIcons: Record<string, any> = {
  'image': Image,
  'video': Video,
  'audio': Music,
  'document': Camera,
  'animation': Film,
  'editing': Camera,
  'streaming': Monitor,
  'design': Palette,
  'production': Mic
}

export default function MultimediaPage() {
  const [multimedia, setMultimedia] = useState<Multimedia[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const fetchMultimediaFiles = async () => {
      try {
        const { data, error } = await supabase
          .from('multimedia')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setMultimedia(data || [])
      } catch (error) {
        console.error('Error fetching multimedia files:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMultimediaFiles()
  }, [])

  const categories = ['all', 'image', 'video', 'audio', 'document']

  const filteredMultimedia = activeCategory === 'all' 
    ? multimedia 
    : multimedia.filter(item => item.file_type === activeCategory)

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
    <div className="min-h-screen bg-background">
      <ThemeSwitcher />
      <Header />
      
      <main className="pt-6 pb-4">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Multimédia
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8">
                Création de contenu vidéo, audio, graphique et animation
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
                  Production Vidéo
                </span>
                <span className="px-4 py-2 bg-pink-500/10 text-pink-400 rounded-full text-sm font-medium">
                  Post-Production
                </span>
                <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                  Design Graphique
                </span>
                <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                  Animation 3D
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80'
                  }`}
                >
                  {category === 'all' ? 'Toutes' : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Multimedia Files Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMultimedia.map((item) => {
                const IconComponent = multimediaIcons[item.file_type] || Video
                return (
                  <div key={item.id} className="card group hover:border-purple-500/20 transition-all duration-300">
                    {/* File Preview */}
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                      {item.file_type === 'image' && item.file_url && (
                        <Image
                          src={item.file_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        />
                      )}
                      {item.file_type !== 'image' && (
                        <div className="flex items-center justify-center h-full">
                          <IconComponent className="w-12 h-12 text-purple-500/50" />
                        </div>
                      )}
                      
                      {/* File Type Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                          {item.file_type}
                        </span>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-text-secondary text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* File Details */}
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>{item.format?.toUpperCase()}</span>
                        {item.file_size && (
                          <span>{(item.file_size / 1024 / 1024).toFixed(1)} MB</span>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center space-x-3 pt-2">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          <span>Voir</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredMultimedia.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun fichier trouvé</h3>
                <p className="text-text-secondary text-center py-8">
                  Aucun fichier multimédia disponible dans cette catégorie.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Services Multimédia
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Solutions complètes pour vos projets multimédia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center group hover:border-purple-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Video className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Production Vidéo</h3>
                <p className="text-text-secondary text-sm">
                  Tournage, montage et post-production professionnelle
                </p>
              </div>

              <div className="card text-center group hover:border-purple-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Music className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Production Audio</h3>
                <p className="text-text-secondary text-sm">
                  Enregistrement, mixage et mastering audio
                </p>
              </div>

              <div className="card text-center group hover:border-purple-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Design Graphique</h3>
                <p className="text-text-secondary text-sm">
                  Création graphique et traitement d'images
                </p>
              </div>

              <div className="card text-center group hover:border-purple-500/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Animation 3D</h3>
                <p className="text-text-secondary text-sm">
                  Modélisation, animation et rendu 3D
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
