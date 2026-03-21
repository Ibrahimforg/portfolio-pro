'use client'

import { useState, useEffect } from 'react'
import { useAnalyticsUltraLight } from '@/hooks/useAnalyticsUltraLight'
import { ArrowRight, Mail, Sparkles, Code, Zap, Download, Network, Cloud, Shield, Github, Linkedin, Radio } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useProfileDataSimple } from '@/hooks/useProfileDataSimple'
import { supabase } from '@/lib/supabase'

function PremiumHeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const { trackDownload } = useAnalyticsUltraLight()
  const { profileData, loading, error } = useProfileDataSimple()

  useEffect(() => {
    const loadCV = async () => {
      try {
        const { data: cvData, error: cvError } = await supabase.storage
          .from('documents')
          .list('cv', {
            limit: 1,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (cvError) {
          setCvUrl('/cv.pdf')
          return
        }

        if (cvData && cvData.length > 0) {
          const fileName = cvData[0].name
          const { data } = await supabase.storage
            .from('documents')
            .getPublicUrl(`cv/${fileName}`)
          
          if (data) {
            setCvUrl(data.publicUrl)
          } else {
            setCvUrl('/cv.pdf')
          }
        } else {
          setCvUrl('/cv.pdf')
        }
      } catch (err) {
        setCvUrl('/cv.pdf')
      }
    }
    
    loadCV()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pb-[8vh] sm:min-h-[85vh] sm:pb-[12vh] md:min-h-[80vh] md:pb-[15vh] lg:min-h-[70vh] lg:pb-[18vh]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Content - STRUCTURE UNIQUE ET STABLE */}
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-16 w-full max-w-6xl">
          {/* Photo - Left */}
          <div className="flex-shrink-0 relative order-1 lg:order-1 lg:pr-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 relative">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl relative group">
                <Image
                  src={profileData?.profile_image_url || "/images/profile.svg"}
                  alt="Ibrahim FORGO"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, (max-width: 1280px) 192px, 224px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/profile.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Overlay content au hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm bg-black/20">
                  {profileData?.full_name && (
                    <h3 className="text-white font-bold text-base mb-2">
                      {profileData?.full_name}
                    </h3>
                  )}
                  
                  {profileData?.title && (
                    <p className="text-white/90 text-sm mb-4">
                      {profileData?.title}
                    </p>
                  )}
                  
                  <div className="flex gap-4 mb-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Github className="w-4 h-4 text-white" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4 text-white" />
                    </a>
                    <a href="mailto:ibrahimforgo59@gmail.com" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  </div>
                  
                  {profileData?.full_name && (
                    <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
                      <span className="text-green-300 text-sm font-semibold">Disponible pour missions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content - Right */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2 min-w-0">
            <div className="mb-6">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gradient mb-3 sm:mb-4 md:mb-6 transition-all duration-500 hover:scale-105 leading-none"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {profileData?.display_name || profileData?.full_name || 'Ibrahim FORGO'}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3">
                <Sparkles className={`w-3 h-3 sm:w-4 sm:h-5 text-primary transition-all duration-300 ${isHovered ? 'animate-spin' : ''}`} />
                <span className="text-sm sm:text-base md:text-lg lg:text-2xl text-primary font-semibold">
                  {profileData?.hero_title || profileData?.title || 'Ingénieur Génie des Systèmes Numériques'}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 sm:mb-3">
                <Code className="w-3 h-3 sm:w-4 sm:h-5 text-secondary transition-all duration-300" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary font-semibold">
                  {profileData?.hero_subtitle || 'Optimisation D\'infrastructure Réseaux'}
                </span>
              </div>
            </div>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-3xl mb-6 sm:mb-8 md:mb-10 font-light">
              {profileData?.bio || "Expert en infrastructure réseaux et développement d'applications modernes. Je conçois des solutions techniques robustes, sécurisées et évolutives pour les entreprises ambitieuses qui cherchent l'excellence."}
            </p>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8 sm:mb-10 justify-center lg:justify-start">
              {profileData?.skills_config ? (
                Object.entries(profileData.skills_config).map(([category, config]) => (
                  <div 
                    key={category}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold border transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-1.5 sm:gap-2 ${
                      category === 'réseau' ? 'bg-primary/10 text-primary border-primary/30 hover:border-primary/60' :
                      category === 'télécom' ? 'bg-secondary/10 text-secondary border-secondary/30 hover:border-secondary/60' :
                      category === 'cloud' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60' :
                      category === 'sécurité' ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/60' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/30 hover:border-gray-500/60'
                    }`}
                  >
                    {category === 'réseau' && <Network className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                    {category === 'télécom' && <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                    {category === 'cloud' && <Cloud className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                    {category === 'sécurité' && <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                    <span>{config.title}</span>
                  </div>
                ))
              ) : (
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
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/projects" className="btn-primary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300">
                Voir mes projets
                <ArrowRight className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300">
                Me contacter
                <Mail className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              {cvUrl && (
                <a href={cvUrl} download className="btn-secondary inline-flex items-center justify-center group hover:scale-105 transition-all duration-300" onClick={() => trackDownload('CV')}>
                  Télécharger CV
                  <Download className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Icons */}
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
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default PremiumHeroSection
