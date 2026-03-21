'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import PremiumHeroSection from '@/components/PremiumHeroSection'
import { FeaturedProjectsSection } from '@/components/PremiumSections'
import PageLayout from '@/components/layout/PageLayout'

export default function PremiumHomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simuler loading pour effet d'entrée premium
    const timer = setTimeout(() => setIsLoaded(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <PageLayout>
      <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <PremiumHeroSection />
        
        {/* Section Projets en Vedette */}
        <FeaturedProjectsSection />
        
        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à collaborer sur votre prochain projet ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Transformons vos idées en réalité avec une approche moderne et des technologies de pointe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/projects" 
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Voir tous les projets
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:bg-white hover:text-primary"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
