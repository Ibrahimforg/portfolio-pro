'use client'

import { useState, useEffect } from 'react'
import { useAnalyticsUltraLight } from '@/hooks/useAnalyticsUltraLight'
import { ArrowRight, Mail, Sparkles, Code, Zap, Download, Network, Cloud, Shield, Github, Linkedin, Radio } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfileDataSimple } from '@/hooks/useProfileDataSimple'
import { supabase } from '@/lib/supabase'

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
  skills_config?: SkillsConfig
}

function PremiumHeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const { trackDownload } = useAnalyticsUltraLight()
  const { profileData, loading, error } = useProfileDataSimple()

  useEffect(() => {
    const loadCV = async () => {
      try {
        const { data } = await supabase.storage
          .from('profiles')
          .getPublicUrl('cv.pdf')
        
        if (data) {
          setCvUrl(data.publicUrl)
        }
      } catch (err) {
        console.error('Erreur lors du chargement du CV:', err)
        // Fallback vers fichier statique si Supabase ne fonctionne pas
        setCvUrl('/cv.pdf')
      }
    }
    
    loadCV()
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pb-[18vh]">
      {/* Animated Background - Même style que l'original */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Content - Centré seulement dans la zone principale */}
      <div className="relative z-10 h-[70vh] flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Photo Section - Structure corrigée */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
          {/* Photo - Left */}
          <div className="flex-shrink-0 relative order-1 lg:order-1">
            <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 relative mx-auto lg:mx-0">
              {/* Photo Container - Version améliorée avec image réelle */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl relative group">
                {/* Image de profil */}
                <Image
                  src={profileData?.profile_image_url || "/images/profile.jpg"}
                  alt="Ibrahim FORGO"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Fallback vers image statique si l'upload ne charge pas
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/profile.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Overlay content au hover - Version avec données du panel admin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm bg-black/20">
                  {/* Nom et titre seulement si profil existe */}
                  {profileData?.full_name && (
                    <>
                      <h3 className="text-white font-bold text-base mb-2">
                        {profileData?.full_name}
                      </h3>
                    </>
                  )}
                  
                  {profileData?.title && (
                    <p className="text-white/90 text-sm mb-4">
                      {profileData?.title}
                    </p>
                  )}
                  
                  {/* Vraies icônes sociales - toujours visibles */}
                  <div className="flex gap-4 mb-4">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Github className="w-4 h-4 text-white" />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a 
                      href="mailto:ibrahimforgo59@gmail.com" 
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  </div>
                  
                  {/* Bouton Disponible - seulement si profil existe */}
                  {profileData?.full_name && (
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
                      <span className="text-green-300 text-sm font-semibold">Disponible pour missions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content - Right - Structure optimisée */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2 min-w-0">
            {/* Animated Title - Version corrigée */}
            <div className="mb-6">
              <h1 
                className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-black text-gradient mb-6 transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {profileData?.display_name || profileData?.full_name || 'Ibrahim FORGO'}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sparkles className={`w-5 h-5 text-primary transition-all duration-300 ${isHovered ? 'animate-spin' : ''}`} />
                <span className="text-xl lg:text-2xl text-primary font-semibold">
                  {profileData?.hero_title || profileData?.title || 'Ingénieur Réseaux & Systèmes'}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Code className="w-5 h-5 text-secondary transition-all duration-300" />
                <span className="text-xl lg:text-2xl text-secondary font-semibold">
                  {profileData?.hero_subtitle || 'Conception, Automatisation, Infrastructure'}
                </span>
              </div>
            </div>
            
            {/* Description premium */}
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mb-10 font-light">
              {profileData?.bio || "Expert en infrastructure réseaux et développement d'applications modernes. Je conçois des solutions techniques robustes, sécurisées et évolutives pour les entreprises ambitieuses qui cherchent l'excellence."}
            </p>
            
            {/* Specialization Tags - Structure corrigée pour 4 sur une ligne */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center lg:justify-start">
              {profileData?.skills_config ? (
                Object.entries(profileData.skills_config).map(([category, config]) => (
                  <div 
                    key={category}
                    className={`px-3 py-2 rounded-full text-xs font-bold border transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 ${
                      category === 'réseau' ? 'bg-primary/10 text-primary border-primary/30 hover:border-primary/60' :
                      category === 'télécom' ? 'bg-secondary/10 text-secondary border-secondary/30 hover:border-secondary/60' :
                      category === 'cloud' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60' :
                      category === 'sécurité' ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/60' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:border-gray-500/60'
                    }`}
                  >
                    {category === 'réseau' && <Network className="w-3 h-3 flex-shrink-0" />}
                    {category === 'télécom' && <Radio className="w-3 h-3 flex-shrink-0" />}
                    {category === 'cloud' && <Cloud className="w-3 h-3 flex-shrink-0" />}
                    {category === 'sécurité' && <Shield className="w-3 h-3 flex-shrink-0" />}
                    <span>{config.title}</span>
                  </div>
                ))
              ) : (
                // Fallback hardcodé si skills_config non disponible
                <>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                    <Network className="w-3 h-3 flex-shrink-0" />
                    <span>Réseaux & Télécoms</span>
                  </div>
                  <div className="px-3 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold border border-secondary/30 hover:border-secondary/60 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                    <Code className="w-3 h-3 flex-shrink-0" />
                    <span>Développement Full Stack</span>
                  </div>
                  <div className="px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                    <Cloud className="w-3 h-3 flex-shrink-0" />
                    <span>Cloud & DevOps</span>
                  </div>
                  <div className="px-3 py-2 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                    <Shield className="w-3 h-3 flex-shrink-0" />
                    <span>Sécurité & Infrastructure</span>
                  </div>
                </>
              )}
            </div>
            
            {/* CTA Buttons - Mêmes classes que l'original */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/projects" 
                className="btn-primary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300"
              >
                Voir mes projets
                <ArrowRight className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link 
                href="/contact" 
                className="btn-secondary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300"
              >
                Me contacter
                <Mail className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              {cvUrl && (
                <a 
                  href={cvUrl} 
                  download 
                  className="btn-secondary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300"
                  onClick={() => trackDownload('CV')}
                >
                  Télécharger CV
                  <Download className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Icons - Positions corrigées */}
      <div className="absolute top-32 left-10 animate-float">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Code className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute top-20 right-10 animate-float animation-delay-1000">
        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center border border-secondary/20">
          <Cloud className="w-6 h-6 text-secondary" />
        </div>
      </div>
      <div className="absolute bottom-20 left-20 animate-float animation-delay-2000">
        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
          <Zap className="w-6 h-6 text-green-500" />
        </div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float animation-delay-3000">
        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
          <Network className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      
      {/* Scroll Indicator - Positionné plus bas pour être bien visible */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default PremiumHeroSection
