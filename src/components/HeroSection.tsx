'use client'

import { useState, useEffect } from 'react'
import { useAnalyticsUltraLight } from '@/hooks/useAnalyticsUltraLight'
import { ArrowRight, Mail, Sparkles, Code, Zap, Globe, Download } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function HeroSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [cvUrl, setCvUrl] = useState<string | null>(null)
  const { trackDownload } = useAnalyticsUltraLight()

  useEffect(() => {
    loadCurrentCV()
  }, [])

  // Charger le CV actuel depuis Supabase Storage (même logique que admin panel)
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
        const fileName = file?.name || ''
        const { data: { publicUrl } } = await supabase
          .storage
          .from('documents')
          .getPublicUrl(`cv/${fileName}`)

        setCvUrl(publicUrl)
      }
    } catch (err) {
      console.error('Erreur lors du chargement du CV:', err)
      // Fallback vers fichier statique si Supabase ne fonctionne pas
      setCvUrl('/cv.pdf')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Mouse Follow Effect */}
        <div 
          className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Photo Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Photo - Left */}
          <div className="flex-shrink-0 relative order-1 lg:order-1">
            <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 relative mx-auto lg:mx-0">
              {/* Photo Container */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl relative group">
                {/* Contenu original à l'intérieur du cercle */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 bg-primary/30 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">I</span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">Ibrahim FORGO</h3>
                  <p className="text-white/80 text-xs mb-3">Développeur Full Stack</p>
                  
                  {/* Icônes sociales */}
                  <div className="flex gap-2 mb-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">in</span>
                    </div>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">gh</span>
                    </div>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">@</span>
                    </div>
                  </div>
                  
                  {/* Bouton Disponible */}
                  <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                    <span className="text-green-300 text-xs font-medium">Disponible pour missions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Content - Right */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-2">
            {/* Animated Title */}
            <div className="mb-6">
              <h1 
                className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-gradient mb-4 transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Ibrahim FORGO
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sparkles className={`w-5 h-5 text-primary transition-all duration-300 ${isHovered ? 'animate-spin' : ''}`} />
                <span className="text-xl lg:text-2xl text-primary font-semibold">
                  Ingénieur Réseaux & Développeur Junior
                </span>
              </div>
            </div>
            
            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                Réseaux & Télécoms
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                Développement Full Stack
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                Cisco & Node.js
              </span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
                Projets Concrets
              </span>
            </div>
            
            {/* CTA Buttons */}
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
      
      {/* Floating Icons */}
      <div className="absolute top-10 left-10 animate-float">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Code className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="absolute top-20 right-10 animate-float animation-delay-1000">
        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
          <Globe className="w-6 h-6 text-blue-500" />
        </div>
      </div>
      <div className="absolute bottom-20 left-20 animate-float animation-delay-2000">
        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
          <Zap className="w-6 h-6 text-green-500" />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
