'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Code, 
  Database, 
  Globe, 
  Server, 
  Zap, 
  Shield, 
  Users 
} from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { SmartphoneIcon } from '@/components/ui/PWAManager'
import { supabase } from '@/lib/supabase'
import { Service, PricingInfo, IconComponent } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('published', true)
          .order('order_index')

        if (error) {
          console.error('Erreur services:', error)
          setServices([])
        } else {
          const mappedServices = (data || []).map(service => ({
            ...service,
            icon: getIconComponent(service.icon),
            shortDescription: service.short_description,
            technologies: service.deliverables || []
          }))
          setServices(mappedServices)
        }
      } catch (error) {
        console.error('Erreur critique lors du chargement:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const getIconComponent = (iconName: string) => {
    const iconMap: IconComponent = {
      'Globe': Globe,
      'SmartphoneIcon': SmartphoneIcon,
      'Code': Code,
      'Server': Server,
      'Zap': Zap,
      'Database': Database,
      'Shield': Shield,
      'Users': Users
    }
    return iconMap[iconName] || Code
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Chargement des services...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <ThemeSwitcher />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Services
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Je propose des services de développement complets pour transformer vos idées 
            en produits numériques performants et évolutifs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.id} className="card group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <div className="w-6 h-6 text-primary flex items-center justify-center">
                      <Icon />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-text-secondary">{service.short_description}</p>
                  </div>
                </div>

                <p className="text-text-secondary mb-6 leading-relaxed">
                  {service.full_description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Livrables
                    </h4>
                    <ul className="space-y-1">
                      {service.deliverables.map((deliverable, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Process Section */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Mon Processus de Travail</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Analyse</h3>
              <p className="text-sm text-text-secondary">
                Compréhension de vos besoins et définition des objectifs
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Conception</h3>
              <p className="text-sm text-text-secondary">
                Architecture technique et design de l&apos;interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Développement</h3>
              <p className="text-sm text-text-secondary">
                Implémentation itérative avec tests continus
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Livraison</h3>
              <p className="text-sm text-text-secondary">
                Déploiement et accompagnement post-lancement
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Discutons de vos idées et voyons comment je peux vous aider à les réaliser. 
            Je suis disponible pour des missions freelance et des collaborations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="btn-primary"
            >
              Me contacter
            </Link>
            <Link 
              href="/projects" 
              className="btn-secondary"
            >
              Voir mes projets
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
