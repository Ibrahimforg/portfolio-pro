'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import PremiumHeroSection from '@/components/PremiumHeroSection'
import { FeaturedProjectsSection } from '@/components/PremiumSections'
import { RippleButton } from '@/components/ui/RippleButton'

export default function PremiumHomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simuler loading pour effet d'entrée premium
    const timer = setTimeout(() => setIsLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary">Chargement de l&apos;expérience...</p>
          </div>
        </div>
      )}
      
      <Header />
      
      <main className="pt-4 pb-4">
        <section className="py-3">
          <PremiumHeroSection />
        </section>
        
        <section className="py-3">
          <FeaturedProjectsSection />
        </section>
        
        {/* Final CTA */}
        <section className="py-6 px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Prêt à Transformer Vos Idées en Réalité ?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Discutons de votre projet et créons ensemble une solution digitale 
              performante et élégante.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <RippleButton variant="primary" size="lg">
                  Démarrer un projet
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </RippleButton>
              </Link>
              <Link href="/projects">
                <RippleButton variant="outline" size="lg">
                  Voir mes travaux
                </RippleButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
